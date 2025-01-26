'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/Textarea'
import { ImagePreview } from '@/components/create/vision/ImagePreview'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { AuthModal } from '@/components/auth/AuthModal'
import { analyzeEmotionalContent, generateMindfulPrompt } from '@/lib/emotional-analysis'

export default function VisionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [imageData, setImageData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [emotionalFeedback, setEmotionalFeedback] = useState<{
    emotion: string;
    elements: string[];
  } | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeEmotionalContent> | null>(null)

  // Art style options
  const recommendedStyles = [
    {
      id: 'tranquil_watercolor',
      name: 'Tranquil Watercolor',
      description: 'Soft tones and flowing brushstrokes that bring peace and serenity',
      preview: '/styles/watercolor-preview.jpg',
      emotionalValue: 'Helps reduce anxiety and cultivate inner peace'
    },
    {
      id: 'healing_ghibli',
      name: 'Healing Animation',
      description: 'Warm and bright Ghibli-inspired style, full of hope and dreams',
      preview: '/styles/ghibli-preview.jpg',
      emotionalValue: 'Evokes cherished memories and sparks life enthusiasm'
    },
    {
      id: 'romantic_impressionist',
      name: 'Dreamy Impressionist',
      description: 'Soft light and atmospheric feel, poetic and emotionally rich',
      preview: '/styles/impressionist-preview.jpg',
      emotionalValue: 'Enhances artistic perception and nurtures inner space'
    },
    {
      id: 'natural_botanical',
      name: 'Natural Botanical',
      description: 'Detailed natural observation, expressing life\'s rhythm',
      preview: '/styles/botanical-preview.jpg',
      emotionalValue: 'Strengthens connection with nature and inner balance'
    }
  ]

  // Aspect ratio options
  const aspectRatios = [
    {
      id: '1:1',
      name: 'Square 1:1',
      dimensions: { width: 1024, height: 1024 },
      usage: 'Perfect for social media posts and profile pictures'
    },
    {
      id: '16:9',
      name: 'Widescreen 16:9',
      dimensions: { width: 1344, height: 768 },
      usage: 'Ideal for desktop wallpapers and presentations'
    },
    {
      id: '2:3',
      name: 'Portrait 2:3',
      dimensions: { width: 896, height: 1344 },
      usage: 'Great for phone wallpapers and vertical prints'
    },
    {
      id: '3:2',
      name: 'Landscape 3:2',
      dimensions: { width: 1344, height: 896 },
      usage: 'Perfect for landscape photography and horizontal prints'
    },
    {
      id: '4:5',
      name: 'Instagram 4:5',
      dimensions: { width: 1024, height: 1280 },
      usage: 'Optimized for Instagram portrait posts'
    },
    {
      id: '3:4',
      name: 'Portrait 3:4',
      dimensions: { width: 896, height: 1152 },
      usage: 'Classic portrait format for artwork'
    }
  ]

  // Handle input changes with emotional analysis
  const handlePromptChange = (text: string) => {
    setPrompt(text)
    if (text.length > 5) {
      const emotionalAnalysis = analyzeEmotionalContent(text)
      setAnalysis(emotionalAnalysis)
      setEmotionalFeedback({
        emotion: emotionalAnalysis.primaryEmotion,
        elements: emotionalAnalysis.healingElements
      })
    } else {
      setAnalysis(null)
      setEmotionalFeedback(null)
    }
  }

  // Handle generation request
  const handleGenerate = async () => {
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!prompt || !selectedStyle || !selectedRatio || !analysis) {
      setError('Please complete all required selections')
      return
    }

    setError(null)
    setIsLoading(true)
    setImageData(null)

    try {
      const mindfulPrompt = generateMindfulPrompt(prompt, analysis)
      
      const response = await fetch('/api/create/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: mindfulPrompt,
          styleId: selectedStyle,
          aspectRatio: selectedRatio
        })
      })

      if (response.status === 401) {
        setShowAuthModal(true)
        return
      }

      if (response.status === 402) {
        setError('Insufficient credits. Please subscribe or purchase more credits')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setImageData(data.imageUrl)
      setIsPreviewOpen(true)

    } catch (err: any) {
      setError(err.message || 'An error occurred during generation')
    } finally {
      setIsLoading(false)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-medium mb-4">
                Describe Your Vision
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Tell me what you'd like to create in simple words..."
                className="w-full text-lg"
                rows={4}
              />
              {emotionalFeedback && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Emotional tone: {emotionalFeedback.emotion}</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => prompt && setCurrentStep(2)}
              disabled={!prompt}
              className="w-full"
            >
              Next: Choose Style
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-medium mb-4">
                Recommended Art Styles
              </label>
              <div className="grid grid-cols-2 gap-4">
                {recommendedStyles.map((style) => (
                  <Card
                    key={style.id}
                    className={`cursor-pointer transition-all aspect-square ${
                      selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-2">{style.name}</h3>
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </div>
                      <p className="text-sm text-primary mt-auto">{style.emotionalValue}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="w-full"
              >
                Previous
              </Button>
              <Button
                onClick={() => selectedStyle && setCurrentStep(3)}
                disabled={!selectedStyle}
                className="w-full"
              >
                Next: Choose Format
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xl font-medium mb-4">
                Choose Image Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aspectRatios.map((ratio) => (
                  <Card
                    key={ratio.id}
                    className={`cursor-pointer transition-all ${
                      selectedRatio === ratio.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRatio(ratio.id)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{ratio.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{ratio.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="w-full"
              >
                Previous
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !selectedRatio}
                className="w-full"
              >
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Artwork
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <CardTitle className="text-[2em] font-semibold leading-[1.2] text-gray-800">
              Decorate Your Space with Inner Vision ✨
            </CardTitle>
            <div className="space-y-4 text-gray-600">
              <p className="text-base leading-relaxed">
                What makes it special? Inner Vision doesn't just create art - it thoughtfully captures your emotions and transforms them into healing visual experiences. Each piece is designed to bring peace, uplift your energy, and create spaces that resonate with your soul.
              </p>
              <p className="text-base leading-relaxed">
                No need to be an artist or explain complex feelings. Your AI companion understands the language of emotions and translates them into meaningful artwork. Whether it's a serene piece for your meditation corner, an uplifting scene for your workspace, or a series of healing artworks for your home - each creation is personally crafted to support your emotional wellbeing 🎨
              </p>
              <p className="text-base leading-relaxed italic">
                Let's create art that transforms your space and nurtures your spirit.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {imageData && (
        <ImagePreview
          imageUrl={imageData}
          title={prompt}
          prompt={generateMindfulPrompt(prompt, analysis!)}
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
} 