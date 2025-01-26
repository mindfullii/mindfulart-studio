import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Download, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

interface ImagePreviewProps {
  imageUrl: string
  title: string
  prompt: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ImagePreview({ imageUrl, title, prompt, isOpen, onOpenChange }: ImagePreviewProps) {
  const [downloading, setDownloading] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleDownload = async (format: 'png' | 'pdf') => {
    try {
      setDownloading(true)
      const response = await fetch(`/api/artwork/download?url=${encodeURIComponent(imageUrl)}&format=${format}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to download ${format.toUpperCase()}`)
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `artwork.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      console.error(`Error downloading ${format}:`, error)
      alert(error.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-6">
        <div className="flex gap-8">
          {/* Left: Image Preview */}
          <div className="w-1/2">
            <div className="relative h-[calc(90vh-3rem)] border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
              <div 
                className={`relative w-full h-full flex items-center justify-center ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className={`transition-all duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsZoomed(true)}
                  className="bg-white/90 hover:bg-white"
                  disabled={isZoomed}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsZoomed(false)}
                  className="bg-white/90 hover:bg-white"
                  disabled={!isZoomed}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Information */}
          <div className="w-1/2 space-y-6 overflow-y-auto pr-2">
            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Original Vision</h3>
              <p className="text-base font-medium">{title}</p>
            </div>

            {/* Prompt */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Enhanced Prompt</h3>
              <p className="text-base whitespace-pre-wrap">{prompt}</p>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handleDownload('png')}
                variant="outline"
                className="flex-1"
                disabled={downloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={() => handleDownload('pdf')}
                variant="outline"
                className="flex-1"
                disabled={downloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 