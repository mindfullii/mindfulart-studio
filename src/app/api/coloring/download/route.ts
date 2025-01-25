import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PDFDocument } from 'pdf-lib';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get parameters from URL
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');
    const format = url.searchParams.get('format')?.toLowerCase(); // 'png' or 'pdf'

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!format || !['png', 'pdf'].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // Fetch image content
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageData = await imageResponse.blob();
    
    // If PNG, return directly
    if (format === 'png') {
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="coloring_page.png"`,
        },
      });
    }

    // If PDF, convert the image
    if (format === 'pdf') {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Convert blob to array buffer
      const imageBytes = await imageData.arrayBuffer();
      
      // Embed the PNG image
      const pngImage = await pdfDoc.embedPng(imageBytes);
      
      // Add a new page
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      
      // Draw the image on the page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="coloring_page.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error: any) {
    console.error("Download failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download image" },
      { status: 500 }
    );
  }
} 