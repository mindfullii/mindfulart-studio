'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Waves, Maximize2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/Dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface EmotionData {
  description: string;
  themes: string[];
  icon: string;
}

interface Emotions {
  [key: string]: EmotionData;
}

function MeditationFlow() {
  const [currentStep, setCurrentStep] = useState<'emotion' | 'theme' | 'generate'>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const router = useRouter();

  const emotions: Emotions = {
    'Anxious': {
      description: 'Seeking calmness and comfort',
      themes: ['Water Flow', 'Cloud Paths', 'Gentle Waves'],
      icon: '🌊'
    },
    'Overwhelmed': {
      description: 'Finding space and release',
      themes: ['Open Sky', 'Mountain View', 'Forest Clearing'],
      icon: '🗻'
    },
    'Restless': {
      description: 'Finding rhythm and serenity',
      themes: ['Falling Leaves', 'Moonlit Lake', 'Swaying Grass'],
      icon: '🍃'
    },
    'Seeking Peace': {
      description: 'Finding inner tranquility',
      themes: ['Garden Path', 'Lotus Pond', 'Starry Night'],
      icon: '🌸'
    },
    'Need Grounding': {
      description: 'Seeking stability and strength',
      themes: ['Ancient Tree', 'Stone Garden', 'Mountain Base'],
      icon: '🌳'
    },
    'Want Inspiration': {
      description: 'Sparking creativity and vitality',
      themes: ['Rising Sun', 'Blooming Garden', 'Light Streams'],
      icon: '✨'
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    if (!session) {
      const returnUrl = encodeURIComponent("/create/meditation");
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    setSelectedEmotion(emotion);
    setCurrentStep('theme');
  };

  const handleThemeSelect = async (theme: string) => {
    setSelectedTheme(theme);
    setCurrentStep('generate');
    await generateImage(selectedEmotion!, theme);
  };

  const generateImage = async (emotion: string, theme: string) => {
    try {
      const prompt = `A serene and ethereal ${theme.toLowerCase()} scene for meditation. Artistic, dreamlike quality with soft, harmonious colors. ${emotion.toLowerCase()} mood. Minimalist composition, abstract elements, zen atmosphere. High-end digital art, peaceful and calming, masterful lighting. Style of a fine art painting.`;

      console.log('Sending request with:', { prompt });
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/create/meditation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (!data.imageUrl) {
        throw new Error('No image URL received');
      }

      console.log('Setting image URL to:', data.imageUrl);
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('emotion');
    setSelectedEmotion(null);
    setSelectedTheme(null);
    setImageUrl(null);
    setError(null);
  };

  const handleDownload = async () => {
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditation-${selectedEmotion}-${selectedTheme}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="border-none shadow-none">
        <CardContent className="text-center space-y-4">
          <Waves className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Meditation Visual</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            A mindful companion that creates personalized visual guides for your meditation practice. 
            Simply share how you feel, and we&apos;ll generate the perfect visual anchor to support 
            your journey to inner peace.
          </p>
          <p className="text-sm text-muted-foreground">1 creation costs 1 credit</p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area */}
        <div className="lg:col-span-2">
          {/* Emotion Selection */}
          {currentStep === 'emotion' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">How are you feeling today?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(emotions).map(([emotion, data]) => (
                    <button
                      key={emotion}
                      onClick={() => handleEmotionSelect(emotion)}
                      className="p-6 rounded-lg border hover:border-primary hover:bg-accent transition-all text-center space-y-2"
                    >
                      <div className="text-3xl">{data.icon}</div>
                      <div className="font-medium">{emotion}</div>
                      <div className="text-sm text-muted-foreground">{data.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Theme Selection */}
          {currentStep === 'theme' && selectedEmotion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  Choose your visual anchor for {selectedEmotion}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {emotions[selectedEmotion].themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeSelect(theme)}
                      className="p-6 rounded-lg border hover:border-primary hover:bg-accent transition-all text-center space-y-2"
                    >
                      <div className="font-medium">{theme}</div>
                      <div className="text-sm text-muted-foreground">
                        Let this guide your meditation
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('emotion')}
                  className="mt-6"
                >
                  ← Choose another feeling
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generation Step */}
          {currentStep === 'generate' && selectedTheme && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  Creating Your Meditation Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {isGenerating ? (
                  <div className="p-12 bg-accent rounded-lg animate-pulse flex items-center justify-center">
                    <div className="space-y-4 text-center">
                      <Waves className="w-12 h-12 mx-auto text-primary animate-bounce" />
                      <div>Creating your meditation visual...</div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
                    <p>{typeof error === 'string' ? error : 'An error occurred while generating the image'}</p>
                    <Button
                      variant="ghost"
                      onClick={() => generateImage(selectedEmotion!, selectedTheme!)}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : imageUrl ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                      <img
                        key={imageUrl}
                        src={imageUrl}
                        alt="Generated meditation visual"
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Image load error:', e);
                          const imgElement = e.target as HTMLImageElement;
                          console.log('Failed URL:', imgElement.src);
                          console.log('Image natural size:', imgElement.naturalWidth, 'x', imgElement.naturalHeight);
                          console.log('Complete error details:', {
                            error: e,
                            target: imgElement,
                            currentSrc: imgElement.currentSrc,
                            complete: imgElement.complete,
                            naturalSize: `${imgElement.naturalWidth}x${imgElement.naturalHeight}`,
                          });
                          setError('Failed to load the generated image');
                        }}
                        onLoad={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          console.log('Image loaded successfully:', {
                            url: imageUrl,
                            naturalSize: `${imgElement.naturalWidth}x${imgElement.naturalHeight}`,
                            currentSrc: imgElement.currentSrc,
                            complete: imgElement.complete
                          });
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button onClick={handleDownload} className="bg-[#88B3BA] hover:bg-[#6B8F96]">
                        Download Image
                      </Button>
                      <Button onClick={handleStartOver} className="border hover:bg-gray-100">
                        Start Over
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">What is a Meditation Visual?</h3>
                <p className="text-sm text-muted-foreground">
                  A Meditation Visual is a unique image generated to support your meditation practice. 
                  It serves as a visual anchor, helping you maintain focus and enhance your mindfulness experience.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How does it work?</h3>
                <p className="text-sm text-muted-foreground">
                  1. Select your current emotional state
                  2. Choose a theme that resonates with you
                  3. We&apos;ll generate a unique visual tailored to your selection
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How many credits does it cost?</h3>
                <p className="text-sm text-muted-foreground">
                  Each meditation visual generation costs 1 credit. New users receive 10 free credits upon registration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeditationFlow; 