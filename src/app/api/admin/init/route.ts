import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const email = 'kevinkang604@gmail.com'

    // 确保请求来自目标邮箱
    if (!session?.user?.email || session.user.email !== email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    // 更新用户为管理员
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.ADMIN,
        isSubscribed: true,
        credits: 999999
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Failed to initialize admin:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 