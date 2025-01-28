import { NextResponse } from "next/server";
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export async function GET(request: Request) {
  try {
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

    // Get the image data as Buffer
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // If PNG, return directly
    if (format === 'png') {
      // Convert to PNG if not already
      const pngBuffer = await sharp(imageBuffer).png().toBuffer();
      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="artwork.png"`,
        },
      });
    }

    // If PDF, convert the image
    if (format === 'pdf') {
      try {
        console.log('Starting PDF conversion...');
        
        // First convert image to PNG using sharp
        console.log('Converting image to PNG format...');
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        console.log('Image converted to PNG successfully');
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        console.log('PDF document created');
        
        // Get image dimensions
        const metadata = await sharp(pngBuffer).metadata();
        const { width = 800, height = 600 } = metadata;
        
        // Embed the PNG image
        console.log('Attempting to embed PNG image...');
        const pngImage = await pdfDoc.embedPng(pngBuffer);
        console.log('PNG image embedded successfully');
        
        // Add a new page with the image dimensions
        const page = pdfDoc.addPage([width, height]);
        console.log('Page added with dimensions:', width, 'x', height);
        
        // Draw the image on the page
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
        console.log('Image drawn on page');
        
        // Save the PDF
        console.log('Saving PDF...');
        const pdfBytes = await pdfDoc.save();
        console.log('PDF saved successfully');
        
        return new NextResponse(pdfBytes, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="artwork.pdf"`,
          },
        });
      } catch (pdfError: any) {
        console.error("PDF conversion failed:", pdfError);
        console.error("Error details:", pdfError.message);
        console.error("Error stack:", pdfError.stack);
        throw new Error(`Failed to convert image to PDF: ${pdfError.message}`);
      }
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