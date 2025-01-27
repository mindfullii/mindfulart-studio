import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'
import { ArtworkCategory } from '@prisma/client'

export async function GET() {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 获取所有作品集
    const collections = await prisma.exploreCollection.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        artworks: true
      }
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 1. 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. 解析表单数据
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as ArtworkCategory
    const cover = formData.get('cover') as File
    const tags = JSON.parse(formData.get('tags') as string) as string[]

    if (!title || !type || !cover) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 3. 上传封面图片到 R2
    const coverExt = cover.name.split('.').pop()
    const coverKey = `explore/collections/${uuidv4()}/cover/cover.${coverExt}`
    
    const coverBuffer = Buffer.from(await cover.arrayBuffer())
    const coverUrl = await uploadToR2(coverBuffer, coverKey)

    // 4. 创建作品集记录
    const collection = await prisma.exploreCollection.create({
      data: {
        title,
        description,
        type,
        coverUrl,
        tags
      }
    })

    return NextResponse.json({ collectionId: collection.id })
  } catch (error) {
    console.error('Collection creation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const id = request.url.split('/').pop()
    if (!id) {
      return new NextResponse('Missing collection ID', { status: 400 })
    }

    // 删除作品集及其相关作品
    await prisma.exploreCollection.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete collection:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const id = request.url.split('/').pop()
    if (!id) {
      return new NextResponse('Missing collection ID', { status: 400 })
    }

    const body = await request.json()
    
    // 更新作品集
    const collection = await prisma.exploreCollection.update({
      where: { id },
      data: body
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Failed to update collection:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 