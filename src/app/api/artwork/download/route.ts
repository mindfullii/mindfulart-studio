import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { artworkId } = await request.json();

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 });
    }

    // 获取作品信息
    const artwork = await prisma.artwork.findUnique({
      where: {
        id: artworkId,
      },
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    // 获取图片内容
    const imageResponse = await fetch(artwork.imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    // 获取图片内容类型
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    // 更新下载计数
    await prisma.artwork.update({
      where: {
        id: artworkId,
      },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // 返回图片数据
    const imageData = await imageResponse.blob();
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${artwork.title}.png"`,
      },
    });
  } catch (error) {
    console.error("Download failed:", error);
    return NextResponse.json(
      { error: "Failed to download artwork" },
      { status: 500 }
    );
  }
} 