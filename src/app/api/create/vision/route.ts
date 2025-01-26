import { NextResponse } from 'next/server'
import Replicate from "replicate"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from "@/lib/storage"

const COST_PER_GENERATION = 1

// Style-specific transformations
const styleTransformations = {
  tranquil_watercolor: {
    prefix: 'Create a serene watercolor artwork with soft, flowing brushstrokes. ',
    suffix: ' Use a gentle color palette with translucent layers that create a peaceful atmosphere.',
    negativePrompt: 'harsh lines, bold colors, aggressive strokes, digital art style'
  },
  healing_ghibli: {
    prefix: 'Create a heartwarming Ghibli-inspired illustration with attention to light and atmosphere. ',
    suffix: ' Include subtle details that evoke warmth and nostalgia.',
    negativePrompt: 'photorealistic, dark themes, harsh shadows, overly detailed'
  },
  romantic_impressionist: {
    prefix: 'Paint an impressionist scene with emphasis on light and emotional atmosphere. ',
    suffix: ' Focus on capturing the feeling of the moment through loose, expressive brushwork.',
    negativePrompt: 'sharp details, flat colors, geometric shapes, modern style'
  },
  natural_botanical: {
    prefix: 'Create a detailed botanical illustration with a focus on natural forms and organic patterns. ',
    suffix: ' Maintain scientific accuracy while expressing the beauty of natural growth.',
    negativePrompt: 'artificial elements, abstract forms, unnatural colors'
  }
}

// Calculate dimensions based on aspect ratio
function calculateDimensions(aspectRatio: string): { width: number; height: number } {
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
  }

  return dimensions[aspectRatio as keyof typeof dimensions] || { width: 1024, height: 1024 }
}

export async function POST(request: Request) {
  try {
    // Validate user session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get fresh user data and check credits
    const freshUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!freshUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (freshUser.credits < COST_PER_GENERATION) {
      return new NextResponse('Insufficient credits', { status: 402 })
    }

    // Deduct credits and record usage
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
          description: "Generated vision artwork"
        }
      })
    ]);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN ?? ''
    })

    const { prompt, styleId, aspectRatio } = await request.json()
    
    // Apply style transformation
    const style = styleTransformations[styleId as keyof typeof styleTransformations]
    if (!style) {
      throw new Error('Invalid style selected')
    }

    const transformedPrompt = `${style.prefix}${prompt}${style.suffix}`
    console.log('Transformed prompt:', transformedPrompt)
    
    // Calculate dimensions
    const dimensions = calculateDimensions(aspectRatio)
    console.log('Using dimensions:', dimensions)

    // Generate image with exact dimensions
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: transformedPrompt,
          width: dimensions.width,
          height: dimensions.height,
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 7.5,
          negative_prompt: "ugly, blurry, poor quality, distorted",
          num_inference_steps: 50,
        }
      }
    )

    console.log('API Route - Replicate response:', output)

    if (!output || !Array.isArray(output) || !output[0]) {
      throw new Error('No output from Replicate API')
    }

    // Handle the output stream
    const stream = output[0]
    if (stream instanceof ReadableStream) {
      const reader = stream.getReader()
      const chunks = []
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
      
      const imageBuffer = Buffer.concat(chunks)
      
      // Generate unique filename
      const timestamp = Date.now()
      const filename = `vision_${timestamp}.png`
      
      // Upload to R2
      const imageUrl = await uploadToR2(imageBuffer, filename)

      // Save artwork to database
      await prisma.artwork.create({
        data: {
          userId: session.user.id,
          title: prompt.slice(0, 100),
          description: transformedPrompt,
          prompt: transformedPrompt,
          imageUrl: imageUrl,
          type: "VISION",
          tags: [`style_${styleId}`, `ratio_${aspectRatio}`],
          updatedAt: new Date()
        }
      })

      return NextResponse.json({ imageUrl });
    } else {
      throw new Error('Unexpected response format from API')
    }

  } catch (error: any) {
    console.error('API Route - Error:', error)
    return NextResponse.json({ 
      error: error.message || "Failed to generate image",
    }, { status: 500 })
  }
} 