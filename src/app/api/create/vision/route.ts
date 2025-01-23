import { NextResponse } from 'next/server'
import Replicate from "replicate"
import { generatePrompt } from '@/app/create/vision/promptTemplates'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { mkdir } from 'fs/promises'

const COST_PER_GENERATION = 1

// 定义Replicate输出类型
type ReplicateOutput = string[] | { output: string[] } | null

// 根据长宽比计算实际尺寸
function calculateDimensions(aspectRatio: string): { width: number; height: number } {
  const maxSize = 768;  // 最大边长
  const [w, h] = aspectRatio.split(':').map(Number);
  
  if (h > w) {  // 竖向图片（如 9:16）
    return {
      width: Math.round(maxSize * (w / h)),
      height: maxSize
    };
  } else {  // 横向图片
    return {
      width: maxSize,
      height: Math.round(maxSize * (h / w))
    };
  }
}

export async function POST(request: Request) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get fresh user data and check credits before generation
    const freshUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!freshUser) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if user has enough credits (always required)
    if (freshUser.credits < COST_PER_GENERATION) {
      return new NextResponse('Insufficient credits', { status: 402 })
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
          description: "Generated vision artwork"
        }
      })
    ]);
    console.log("💰 Credits deducted. New balance:", freshUser.credits - COST_PER_GENERATION);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN ?? ''
    })

    const { prompt, styleId, aspectRatio } = await request.json()
    console.log('Received aspectRatio:', aspectRatio)
    
    // 转换aspectRatio格式从 '/' 到 ':'
    const formattedAspectRatio = aspectRatio.replace('/', ':')
    
    // 生成完整的 prompt
    const fullPrompt = generatePrompt(prompt, styleId, formattedAspectRatio)
    console.log('Generated prompt:', fullPrompt)

    // 计算实际尺寸
    const dimensions = calculateDimensions(formattedAspectRatio)
    console.log('Calculated dimensions:', dimensions)
    
    // 确保尺寸是有效的
    const width = Math.max(64, Math.min(1024, dimensions.width))
    const height = Math.max(64, Math.min(1024, dimensions.height))

    // 使用run方法直接运行模型
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: fullPrompt,
          num_inference_steps: 4,
          guidance_scale: 7.5,
          negative_prompt: "ugly, blurry, bad quality, distorted",
          num_outputs: 1
        }
      }
    )

    console.log('API Route - Replicate response:', output)

    if (!output || !Array.isArray(output) || !output[0]) {
      throw new Error('No output from Replicate API')
    }

    // 处理ReadableStream
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
      
      // 生成唯一的文件名
      const timestamp = Date.now()
      const filename = `generated_${timestamp}.png`
      const publicDir = join(process.cwd(), 'public')
      const imageDir = join(publicDir, 'images', 'generated')
      const filePath = join(imageDir, filename)
      const imageUrl = `/images/generated/${filename}`

      // 确保目录存在
      try {
        await mkdir(imageDir, { recursive: true })
      } catch (error) {
        console.error('Failed to create directory:', error)
      }

      // 保存图片文件
      try {
        await writeFile(filePath, imageBuffer)
        console.log('Image saved successfully at:', filePath)
      } catch (error) {
        console.error('Failed to save image:', error)
        // 继续执行，即使保存失败也返回生成的图片
      }

      // 记录作品
      await prisma.artwork.create({
        data: {
          userId: session.user.id,
          title: prompt.slice(0, 100),
          description: `Generated with style ${styleId} and aspect ratio ${formattedAspectRatio}`,
          prompt: fullPrompt,
          imageUrl: imageUrl,
          type: "vision",
          tags: [`style_${styleId}`, `ratio_${formattedAspectRatio}`]
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