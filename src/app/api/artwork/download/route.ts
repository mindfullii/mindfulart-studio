import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import sharp from 'sharp'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url')
    const format = req.nextUrl.searchParams.get('format') || 'png'
    const title = req.nextUrl.searchParams.get('title') || 'artwork'

    if (!url) {
      return new NextResponse('Missing url parameter', { status: 400 })
    }

    // 获取图片数据
    const imageResponse = await fetch(url)
    const imageBuffer = await imageResponse.arrayBuffer()

    // 使用sharp将图片转换为PNG格式
    const pngBuffer = await sharp(Buffer.from(imageBuffer))
      .png()
      .toBuffer()

    // 如果是PNG格式，直接返回
    if (format === 'png') {
      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${title}.png"`,
        },
      })
    }

    // 如果是PDF格式，转换PNG为PDF
    if (format === 'pdf') {
      try {
        // 使用sharp获取图片尺寸
        const metadata = await sharp(pngBuffer).metadata()
        const { width = 0, height = 0 } = metadata

        // 创建PDF文档
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([width, height])

        // 将PNG嵌入PDF
        const pngImage = await pdfDoc.embedPng(new Uint8Array(pngBuffer))
        
        // 在PDF页面上绘制图片
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        })

        // 生成PDF
        const pdfBytes = await pdfDoc.save()

        return new NextResponse(pdfBytes, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${title}.pdf"`,
          },
        })
      } catch (error) {
        console.error('PDF conversion error:', error)
        return new NextResponse('Failed to convert to PDF', { status: 500 })
      }
    }

    return new NextResponse('Invalid format', { status: 400 })
  } catch (error) {
    console.error('Download error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 