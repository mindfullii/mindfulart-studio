import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ImagePreviewProps {
  imageUrl: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
}

export function ImagePreview({
  imageUrl,
  isOpen,
  onOpenChange,
  onDownload,
}: ImagePreviewProps) {
  if (!imageUrl) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Preview Generated Image</DialogTitle>
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt="Generated artwork preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 