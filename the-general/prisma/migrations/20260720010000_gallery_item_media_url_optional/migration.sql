-- Make GalleryItem.mediaUrl optional, so items can be seeded/created
-- before real media is uploaded (consistent with Achievement.mediaUrl
-- and BiographySection.imageUrl).
ALTER TABLE "GalleryItem" ALTER COLUMN "mediaUrl" DROP NOT NULL;
