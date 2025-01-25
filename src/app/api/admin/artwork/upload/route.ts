import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/lib/storage'

// 管理员邮箱列表
const ADMIN_EMAILS = ['kevinkang604@gmail.com']

export async function POST(request: Request) {
  try {
    // 检查用户权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 检查管理员权限
    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 解析表单数据
    const formData = await request.formData()
    const image = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const tags = JSON.parse(formData.get('tags') as string) as string[]

    if (!image || !title || !description || !type) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const filename = `${type}_${timestamp}.${image.type.split('/')[1]}`

    // 上传图片到 R2
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const imageUrl = await uploadToR2(imageBuffer, filename)

    // 保存到数据库
    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        imageUrl,
        type,
        tags,
        userId: session.user.id,
        source: 'CURATED',
      },
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 