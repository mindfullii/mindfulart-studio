-- CreateTable
CREATE TABLE "ExploreCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT NOT NULL,
    "type" "ArtworkCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExploreCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExploreArtwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "downloadUrls" JSONB NOT NULL,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "artistName" TEXT,
    "artistUrl" TEXT,
    "orderInCollection" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ArtworkCategory" NOT NULL,
    "collectionId" TEXT,

    CONSTRAINT "ExploreArtwork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExploreCollection_type_idx" ON "ExploreCollection"("type");

-- CreateIndex
CREATE INDEX "ExploreArtwork_type_idx" ON "ExploreArtwork"("type");

-- CreateIndex
CREATE INDEX "ExploreArtwork_collectionId_idx" ON "ExploreArtwork"("collectionId");
