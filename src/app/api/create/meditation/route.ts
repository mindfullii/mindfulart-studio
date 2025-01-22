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
  console.log("🎯 Meditation API route hit");
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

    console.log("🎨 Generating meditation image with prompt:", prompt);
    console.log("🔑 Using Replicate API token:", process.env.REPLICATE_API_TOKEN?.substring(0, 8) + "...");
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      width: 768,
      height: 768,
      prompt: prompt,
      scheduler: "K_EULER",
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 50,
      refine: "expert_ensemble_refiner",
      high_noise_frac: 0.8,
      apply_watermark: false
    };

    console.log("📤 Replicate input:", input);
    try {
      console.log("🚀 Calling Replicate API with model: stability-ai/sdxl");
      const prediction = await replicate.predictions.create({
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        input: input
      });

      console.log("📥 Replicate prediction:", prediction);

      // Wait for the prediction to complete
      let imageUrl = null;
      while (!imageUrl) {
        const status = await replicate.predictions.get(prediction.id);
        console.log("🔄 Prediction status:", status);

        if (status.status === "succeeded") {
          imageUrl = status.output?.[0];
          break;
        } else if (status.status === "failed") {
          throw new Error("Image generation failed");
        }

        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
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
            description: "Generated meditation visual",
            type: "USAGE"
          }
        });
        console.log("📝 Credit usage recorded");
      }

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