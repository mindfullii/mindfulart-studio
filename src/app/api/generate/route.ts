import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { prompt, aspectRatio, complexity } = await request.json()

    // Add complexity to the prompt
    const enhancedPrompt = `${prompt} Create a black and white coloring page with ${complexity} detail level, clear outlines suitable for coloring. The background should be completely white.`

    const output = await replicate.run(
      "pnickolas1/sdxl-coloringbook:d2b110483fdce03119b21786d823f10bb3f5a7c49a7429da784c5017df096d33",
      {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: "color, shading, grayscale, photorealistic, blurry lines, messy, unclear outlines",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          // Adjust aspect ratio based on user selection
          width: aspectRatio === "1:1" ? 1024 : aspectRatio === "3:2" ? 1536 : 1024,
          height: aspectRatio === "1:1" ? 1024 : aspectRatio === "3:2" ? 1024 : 1536,
        }
      }
    ) as string[]

    // Get the first image URL from the output array
    const imageUrl = output[0]
    if (!imageUrl) {
      throw new Error('No image generated')
    }

    // Fetch the image and convert it to a blob
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()

    // Return the image blob with appropriate headers
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
} 