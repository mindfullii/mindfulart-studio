import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'
import { ArtworkCategory } from '@prisma/client'

// 获取单个作品
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const artwork = await prisma.exploreArtwork.findUnique({
      where: {
        id: params.id
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

    if (!artwork) {
      return new NextResponse('Artwork not found', { status: 404 })
    }

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Failed to fetch artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 更新作品
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { title, description, type, tags, relatedArtworks } = data

    if (!title || !description || !type) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 更新作品
    const artwork = await prisma.exploreArtwork.update({
      where: {
        id: params.id
      },
      data: {
        title,
        description,
        type: type as ArtworkCategory,
        tags,
        relatedTo: {
          set: relatedArtworks.map((id: string) => ({ id }))
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
    console.error('Failed to update artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// 删除作品
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || session.user.email !== 'kevinkang604@gmail.com') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.exploreArtwork.delete({
      where: {
        id: params.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 