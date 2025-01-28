import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import type { Session } from "next-auth";
import { uploadToR2 } from "@/lib/storage";
import { transformInput } from "@/lib/mindful-coloring-prompt-system";

interface ExtendedSession extends Session {
  user: {
    id: string;
    credits: number;
    isSubscribed: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const COST_PER_GENERATION = 1;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🎯 Coloring API route hit");
  try {
    // Check content type
    const contentType = req.headers.get('content-type');
    console.log("📨 Request headers:", Object.fromEntries(req.headers.entries()));
    
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { 
        status: 400 
      });
    }

    const session = await getServerSession(authOptions) as ExtendedSession | null;
    console.log("👤 Session:", session ? "Authenticated" : "Not authenticated");
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { 
        status: 401
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true, isSubscribed: true }
    });
    console.log("💳 User credits:", user?.credits);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { 
        status: 404
      });
    }

    if (!user.isSubscribed && user.credits < COST_PER_GENERATION) {
      return NextResponse.json({ error: "Insufficient credits" }, { 
        status: 402
      });
    }

    let requestData;
    try {
      const rawBody = await req.text();
      console.log("📝 Raw request body:", rawBody);
      requestData = JSON.parse(rawBody);
      console.log("📦 Parsed request data:", requestData);
    } catch (error) {
      console.error("❌ Error parsing request body:", error);
      return NextResponse.json({ error: "Invalid request body" }, { 
        status: 400
      });
    }

    const { prompt: userPrompt, aspectRatio } = requestData;

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { 
        status: 400
      });
    }

    // Transform user input into mindful prompt
    const { prompt: transformedPrompt } = transformInput(userPrompt);
    console.log("🎨 Original prompt:", userPrompt);
    console.log("✨ Transformed prompt:", transformedPrompt);

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Missing Replicate API token");
    }

    // Calculate dimensions based on aspect ratio
    const getDimensions = (ratio: string = '1:1') => {
      const dimensions = {
        '1:1': { width: 1024, height: 1024 },
        '16:9': { width: 1344, height: 768 },
        '9:16': { width: 768, height: 1344 },
        '2:3': { width: 896, height: 1344 },
        '3:2': { width: 1344, height: 896 },
        '4:5': { width: 1024, height: 1280 },
        '5:4': { width: 1280, height: 1024 },
        '4:3': { width: 1344, height: 1008 },
        '3:4': { width: 896, height: 1152 }
      };
      return dimensions[ratio as keyof typeof dimensions] || dimensions['1:1'];
    };

    const dimensions = getDimensions(aspectRatio);
    console.log("📐 Using dimensions:", dimensions);
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: transformedPrompt,
      negative_prompt: "ugly, blurry, poor quality, low quality, oversaturated, undersaturated",
      width: dimensions.width,
      height: dimensions.height
    };

    console.log("📤 Replicate input:", input);
    try {
      console.log("🚀 Calling Replicate API with coloring model");
      // Get fresh user data and check credits before generation
      const freshUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
      });

      if (!freshUser) {
        throw new Error("User not found");
      }

      // Check if user has enough credits (always required)
      if (freshUser.credits < COST_PER_GENERATION) {
        throw new Error("Insufficient credits");
      }

      // Always deduct credits and record usage
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: { credits: freshUser.credits - COST_PER_GENERATION }
        }),
        prisma.creditHistory.create({
          data: {
            userId: session.user.id,
            amount: -COST_PER_GENERATION,
            type: "USAGE",
            description: "Generated coloring page"
          }
        })
      ]);
      console.log("💰 Credits deducted. New balance:", freshUser.credits - COST_PER_GENERATION);

      // Call Replicate API to generate the image
      const prediction = await replicate.predictions.create({
        version: "d2b110483fdce03119b21786d823f10bb3f5a7c49a7429da784c5017df096d33",
        input
      });

      // Wait for the prediction to complete
      let output;
      while (!output) {
        const predictionStatus = await replicate.predictions.get(prediction.id);
        if (predictionStatus.status === "succeeded") {
          output = predictionStatus.output;
          break;
        } else if (predictionStatus.status === "failed") {
          throw new Error("Image generation failed");
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking again
      }

      console.log("📥 Replicate output:", output);

      if (!output?.[0] || typeof output[0] !== 'string' || !output[0].startsWith('http')) {
        throw new Error("Invalid image URL from Replicate");
      }

      // Download image from Replicate
      const replicateUrl = output[0];
      const response = await fetch(replicateUrl);
      if (!response.ok) {
        throw new Error("Failed to download image from Replicate");
      }

      const imageBuffer = Buffer.from(await response.arrayBuffer());
      
      // Upload to R2
      const timestamp = Date.now();
      const filename = `coloring_${timestamp}.png`;
      const imageUrl = await uploadToR2(imageBuffer, filename);

      // Save the artwork to the database
      await prisma.artwork.create({
        data: {
          userId: session.user.id,
          title: transformedPrompt.slice(0, 100),
          description: "Generated coloring page",
          prompt: transformedPrompt,
          imageUrl: imageUrl,
          type: "COLORING",
          tags: [],
          updatedAt: new Date(),
        }
      });
      console.log("💾 Artwork saved to database");

      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error("❌ Replicate API error:", error);
      throw error;
    }
  } catch (error) {
    console.error("❌ Generation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate image" 
    }, { 
      status: 500
    });
  }
} 