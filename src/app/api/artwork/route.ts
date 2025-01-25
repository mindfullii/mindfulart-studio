import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

const OLD_R2_DOMAIN = "pub-e4ad43b6066944c089d6de3fa4a35157.r2.dev";
const NEW_R2_DOMAIN = "pub-e1f86caa0538490c93d0298f702975c3.r2.dev";
const STORAGE_DOMAIN = "mindfulart-studio.51159ff01e1247a31b68933143db0701.r2.cloudflarestorage.com";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        prompt: true,
        imageUrl: true,
        createdAt: true,
        type: true,
      },
    });
    
    // Transform URLs to use the new domain
    const transformedArtworks = artworks.map(artwork => {
      let imageUrl = artwork.imageUrl;
      
      // Handle old public URL format
      if (imageUrl.includes(OLD_R2_DOMAIN)) {
        imageUrl = imageUrl.replace(OLD_R2_DOMAIN, NEW_R2_DOMAIN);
      }
      
      // Handle direct storage URL format
      if (imageUrl.includes(STORAGE_DOMAIN)) {
        const filename = imageUrl.split('/').pop();
        imageUrl = `https://${NEW_R2_DOMAIN}/${filename}`;
      }
      
      return {
        ...artwork,
        imageUrl,
        description: artwork.description || '',
        prompt: artwork.prompt || ''
      };
    });
    
    return NextResponse.json(transformedArtworks);
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
} 