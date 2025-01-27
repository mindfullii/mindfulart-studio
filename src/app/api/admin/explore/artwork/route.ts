import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'
import { ArtworkCategory } from '@prisma/client'

export async function POST(request: Request) {
  try {
    // 1. 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. 解析表单数据
    const formData = await request.formData()
    const collectionId = formData.get('collectionId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    if (!collectionId || !title || !image) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 3. 上传图片到 R2
    const imageExt = image.name.split('.').pop()
    const imageKey = `explore/collections/${collectionId}/artworks/${uuidv4()}/image.${imageExt}`
    
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const imageUrl = await uploadToR2(imageBuffer, imageKey)

    // 获取作品集类型
    const collection = await prisma.exploreCollection.findUnique({
      where: { id: collectionId }
    })

    if (!collection) {
      return new NextResponse('Collection not found', { status: 404 })
    }

    // 4. 创建作品记录
    const artwork = await prisma.exploreArtwork.create({
      data: {
        title,
        description,
        imageUrl,
        downloadUrls: {
          png: imageUrl,
          pdf: '' // TODO: 生成 PDF
        },
        type: collection.type,
        collectionId,
        tags: []
      }
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Artwork upload error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 