import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 从 URL 获取参数
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const format = url.searchParams.get('format')?.toLowerCase(); // 'png' 或 'pdf'

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!format || !['png', 'pdf'].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // 获取图片内容
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageData = await imageResponse.blob();
    
    // 如果是 PNG，直接返回
    if (format === 'png') {
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="coloring_page.png"`,
        },
      });
    }

    // TODO: 如果是 PDF，需要转换
    // 这里需要添加 PDF 转换的逻辑
    // 可以使用 pdf-lib 或其他库来创建 PDF

    return NextResponse.json({ error: "PDF format not implemented yet" }, { status: 501 });
  } catch (error) {
    console.error("Download failed:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
} 