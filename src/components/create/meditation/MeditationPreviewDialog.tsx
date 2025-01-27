import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MeditationPreviewDialogProps {
  imageUrl: string;
  format: 'mobile' | 'desktop' | 'tablet';
  emotion: string;
  theme: string;
  onClose: () => void;
  open: boolean;
}

export function MeditationPreviewDialog({
  imageUrl,
  format,
  emotion,
  theme,
  onClose,
  open
}: MeditationPreviewDialogProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/artwork/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl,
          fileName: `meditation-${emotion}-${theme}.png`
        }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditation-${emotion}-${theme}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] p-6">
        <DialogTitle className="sr-only">Preview Meditation Visual</DialogTitle>
        <div className={cn(
          "flex gap-6",
          format === 'mobile' ? "flex-row items-center" : "flex-col lg:flex-row"
        )}>
          {/* Image Preview */}
          <div className={cn(
            "relative",
            format === 'mobile' ? "w-[35%] flex-shrink-0" : "flex-1"
          )}>
            <div className={cn(
              "relative overflow-hidden rounded-lg bg-muted",
              format === 'mobile' && "max-h-[75vh] aspect-[9/16]",
              format === 'tablet' && "aspect-[4/3]",
              format === 'desktop' && "aspect-[16/9]"
            )}>
              <Image
                src={imageUrl}
                alt="Your meditation visual"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className={cn(
            "flex flex-col gap-4",
            format === 'mobile' ? "flex-1" : "w-full lg:w-80"
          )}>
            <div>
              <h3 className="text-lg font-semibold">Your Mindful Space</h3>
              <p className="text-sm text-muted-foreground mt-2">
                A visual anchor for your {format} screen, crafted to bring moments of peace to your digital life.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Theme</h4>
                <p className="text-sm text-muted-foreground mt-1">{theme}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Emotional Resonance</h4>
                <p className="text-sm text-muted-foreground mt-1">{emotion}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Format</h4>
                <p className="text-sm text-muted-foreground mt-1">Optimized for {format} screens</p>
              </div>
            </div>

            <Button 
              className="w-full mt-auto" 
              onClick={handleDownload}
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 