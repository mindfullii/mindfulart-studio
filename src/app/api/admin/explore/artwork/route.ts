import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'
import { ArtworkCategory } from '@prisma/client'

// 获取所有作品
export async function GET() {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const artworks = await prisma.exploreArtwork.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        type: true,
        tags: true,
        relatedTo: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          }
        }
      }
    })

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Failed to fetch artworks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 上传新作品
export async function POST(request: Request) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const tags = JSON.parse(formData.get('tags') as string) as string[]
    const relatedArtworks = JSON.parse(formData.get('relatedArtworks') as string) as string[]

    if (!image || !title || !description || !type) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 生成唯一的文件名
    const fileExt = image.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`

    // 根据类型选择存储路径
    const storagePath = type === 'COLORINGPAGES' ? 'artworks' : 'explore'
    
    // 上传图片到 R2
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const imageKey = `${storagePath}/${fileName}`
    const imageUrl = await uploadToR2(imageBuffer, imageKey)

    // 创建作品记录
    const artwork = await prisma.exploreArtwork.create({
      data: {
        title,
        description,
        imageUrl,
        type: type as ArtworkCategory,
        tags,
        downloadUrls: {
          png: imageUrl,
          pdf: imageUrl // 如果需要PDF版本，这里需要额外处理
        },
        relatedTo: {
          connect: relatedArtworks.map(id => ({ id }))
        }
      },
      include: {
        relatedTo: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          }
        }
      }
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Failed to create artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 