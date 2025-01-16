import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
} 