import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import type { Session } from "next-auth";

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

    const { prompt } = requestData;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { 
        status: 400
      });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Missing Replicate API token");
    }

    console.log("🎨 Generating coloring image with prompt:", prompt);
    console.log("🔑 Using Replicate API token:", process.env.REPLICATE_API_TOKEN?.substring(0, 8) + "...");
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      negative_prompt: "ugly, blurry, poor quality, low quality, oversaturated, undersaturated"
    };

    console.log("📤 Replicate input:", input);
    try {
      console.log("🚀 Calling Replicate API with coloring model");
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

      // Deduct credits if user is not subscribed
      if (!user.isSubscribed) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { credits: user.credits - COST_PER_GENERATION }
        });
        console.log("💰 Credits deducted. New balance:", user.credits - COST_PER_GENERATION);

        // Record credit usage
        await prisma.creditHistory.create({
          data: {
            userId: session.user.id,
            amount: -COST_PER_GENERATION,
            description: "Generated coloring page",
            type: "USAGE"
          }
        });
        console.log("📝 Credit usage recorded");
      }

      // Return the direct image URL from Replicate
      const imageUrl = output[0];
      console.log("🖼️ Generated image URL:", imageUrl);
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