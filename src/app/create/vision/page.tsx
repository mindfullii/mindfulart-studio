'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles, Image as ImageIcon, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { StyleCard } from '@/components/create/vision/StyleCard'
import { ImagePreview } from '@/components/create/vision/ImagePreview'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/Textarea'

export default function VisionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [imageData, setImageData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState('1')  // 默认选择 1:1
  const [selectedStyle, setSelectedStyle] = useState('1')  // 默认选择第一个风格
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // 保存表单状态
  useEffect(() => {
    const savedState = localStorage.getItem('visionState')
    if (savedState) {
      const { prompt, selectedRatio, selectedStyle } = JSON.parse(savedState)
      setPrompt(prompt)
      setSelectedRatio(selectedRatio)
      setSelectedStyle(selectedStyle)
      localStorage.removeItem('visionState')
    }
  }, [])

  const aspectRatios = [
    { id: '1', name: '1:1', description: 'Square' },
    { id: '2', name: '4:3', description: 'Classic landscape' },
    { id: '3', name: '3:4', description: 'Classic portrait' },
    { id: '4', name: '16:9', description: 'Widescreen' },
    { id: '5', name: '9:16', description: 'Mobile' },
    { id: '6', name: '3:2', description: 'Standard landscape' },
    { id: '7', name: '2:3', description: 'Standard portrait' },
    { id: '8', name: '7:4', description: 'Wide landscape' },
    { id: '9', name: '4:7', description: 'Tall portrait' }
  ]

  const artStyles = [
    {
      id: '1',
      name: 'Realistic',
      description: 'Photorealistic style with high attention to detail',
      examples: ['portraits', 'landscapes', 'still life'],
      artists: ['Johannes Vermeer', 'Chuck Close']
    },
    {
      id: '2',
      name: 'Impressionist',
      description: 'Emphasis on light, color, and movement',
      examples: ['nature scenes', 'cityscapes', 'gardens'],
      artists: ['Claude Monet', 'Pierre-Auguste Renoir']
    },
    {
      id: '3',
      name: 'Abstract',
      description: 'Non-representational forms and patterns',
      examples: ['geometric shapes', 'color fields', 'dynamic compositions'],
      artists: ['Wassily Kandinsky', 'Piet Mondrian']
    },
    {
      id: '4',
      name: 'Pop Art',
      description: 'Bold colors and popular culture imagery',
      examples: ['consumer products', 'celebrities', 'comic style'],
      artists: ['Andy Warhol', 'Roy Lichtenstein']
    }
  ]

  const handleGenerate = async () => {
    if (!prompt || !selectedStyle || !selectedRatio) {
      alert('Please fill in all required fields')
      return
    }

    setError(null)
    setIsLoading(true)
    setImageData(null)

    // 保存当前状态
    const stateToSave = {
      prompt,
      selectedRatio,
      selectedStyle
    }
    localStorage.setItem('visionState', JSON.stringify(stateToSave))

    try {
      const response = await fetch('/api/create/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          styleId: selectedStyle,
          aspectRatio: aspectRatios.find(r => r.id === selectedRatio)?.name || '1:1'
        })
      })

      if (response.status === 401) {
        setShowLoginDialog(true)
        return
      }

      if (response.status === 402) {
        setError('Insufficient credits. Please purchase more credits or subscribe.')
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate image')
      }

      const data = await response.json()
      setImageData(data.imageUrl)
      setIsPreviewOpen(true)  // 生成完成后显示预览

    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (imageData) {
      try {
        const response = await fetch(imageData)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `vision-art-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Download failed:', error)
        setError('Failed to download image')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Vision Art Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your vision
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="w-full"
                rows={4}
              />
            </div>

            {/* Aspect Ratio Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Choose aspect ratio
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {aspectRatios.map((ratio) => (
                  <Card
                    key={ratio.id}
                    className={`cursor-pointer transition-all ${
                      selectedRatio === ratio.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedRatio(ratio.id)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{ratio.name}</h3>
                      <p className="text-sm text-gray-500">{ratio.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Art Style Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Choose art style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artStyles.map((style) => (
                  <StyleCard
                    key={style.id}
                    {...style}
                    isSelected={selectedStyle === style.id}
                    onClick={() => setSelectedStyle(style.id)}
                  />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt || !selectedStyle || !selectedRatio}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  'Generating...'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <p className="text-sm text-gray-500">
                1 generation costs 1 credit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      <ImagePreview
        imageUrl={imageData}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onDownload={handleDownload}
      />

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-4">Please log in to generate images.</p>
            <Button
              onClick={() => {
                const returnUrl = encodeURIComponent('/create/vision')
                router.push(`/login?returnUrl=${returnUrl}`)
              }}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 