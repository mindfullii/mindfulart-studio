import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE() {
  try {
    // 删除特定用户
    await prisma.user.delete({
      where: {
        email: 'kevinkang604@gmail.com'
      }
    })
    
    return new NextResponse('User deleted', { status: 200 })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 