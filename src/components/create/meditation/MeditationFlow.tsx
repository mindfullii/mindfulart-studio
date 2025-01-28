'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { meditationThemes } from "@/lib/meditation-themes";
import { Theme } from "@/types/meditation";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Maximize2 } from "lucide-react";
import { MeditationPreviewDialog } from "./MeditationPreviewDialog";
import { AuthModal } from "@/components/auth/AuthModal";

interface EmotionData {
  label: string;
  description: string;
  icon: string;
  resonancePattern: string;
  healingElements: string[];
}

const emotions: Record<string, EmotionData> = {
  'anxious': {
    label: 'Anxious',
    description: 'Feeling worried or uneasy',
    icon: '🌊',
    resonancePattern: 'grounding',
    healingElements: ['stability', 'safety', 'peace']
  },
  'overwhelmed': {
    label: 'Overwhelmed',
    description: 'Too much to handle',
    icon: '🗻',
    resonancePattern: 'centering',
    healingElements: ['space', 'clarity', 'simplicity']
  },
  'restless': {
    label: 'Restless',
    description: 'Unable to stay still or focus',
    icon: '🍃',
    resonancePattern: 'flowing',
    healingElements: ['rhythm', 'flow', 'balance']
  },
  'seeking-growth': {
    label: 'Seeking Growth',
    description: 'Ready for transformation',
    icon: '🌱',
    resonancePattern: 'expanding',
    healingElements: ['possibility', 'transformation', 'expansion']
  },
  'need-grounding': {
    label: 'Need Grounding',
    description: 'Feeling disconnected',
    icon: '🌳',
    resonancePattern: 'grounding',
    healingElements: ['stability', 'connection', 'presence']
  },
  'seeking-harmony': {
    label: 'Seeking Harmony',
    description: 'Looking for balance',
    icon: '☯️',
    resonancePattern: 'centering',
    healingElements: ['harmony', 'balance', 'unity']
  }
};

export function MeditationFlow() {
  const [currentStep, setCurrentStep] = useState<'emotion' | 'theme' | 'format'>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'mobile' | 'desktop' | 'tablet' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  const handleEmotionSelect = (emotion: string) => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    setSelectedEmotion(emotion);
    setCurrentStep('theme');
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setCurrentStep('format');
  };

  const handleFormatSelect = async (format: 'mobile' | 'desktop' | 'tablet') => {
    setSelectedFormat(format);
    setIsGenerating(true);
    await generateImage(format);
  };

  const generateImage = async (format: string) => {
    if (!selectedEmotion || !selectedTheme) return;

    try {
      const emotion = emotions[selectedEmotion];
      const prompt = `Create a meditation visual that embodies ${emotion.resonancePattern} energy.
Theme: ${selectedTheme.label}
Emotional State: ${emotion.label}
Healing Elements: ${emotion.healingElements.join(', ')}
Visual Elements: ${selectedTheme.visualElements.join(', ')}
Format: Optimized for ${format} viewing
Style: Soft, ethereal, mindful visual design with perfect composition for ${format} screens`;

      const response = await fetch('/api/create/meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate image');
      
      setImageUrl(data.imageUrl);
      setShowPreview(true);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      {/* Title and Introduction Section - Default Background */}
      <div className="w-full max-w-4xl mx-auto space-y-4 text-center pt-8 mb-8">
        <h1 className="text-[2em] font-bold">
          Meet your mindful wallpaper companion ✨
        </h1>
        <div className="space-y-4 text-muted-foreground">
          <p>
            What makes it special? It's not just a wallpaper – it's a visual anchor that brings peace to your daily digital life. Each time you look at your screen, you'll naturally find yourself drawn into a moment of calm and presence.
          </p>
          <p>
            No complex settings, no overwhelming choices. Let your AI companion create the perfect meditation visual that resonates with your emotional state. Every wallpaper is a personalized mindful space crafted just for you, available in sizes that fit all your devices perfectly 🌸
          </p>
        </div>
      </div>

      {/* Content Section - White Background */}
      <Card className="w-full max-w-4xl mx-auto bg-white">
        <CardContent className="p-6 space-y-8">
          {currentStep === 'emotion' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">How are you feeling today?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(emotions).map(([key, emotion]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className={cn(
                      "h-auto p-6 flex flex-col items-center gap-2",
                      selectedEmotion === key && "border-2 border-primary"
                    )}
                    onClick={() => handleEmotionSelect(key)}
                  >
                    <span className="text-3xl">{emotion.icon}</span>
                    <span className="font-medium">{emotion.label}</span>
                    <span className="text-sm text-muted-foreground text-center">
                      {emotion.description}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'theme' && selectedEmotion && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Choose a theme that resonates with you
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(meditationThemes).flatMap(category => 
                  category.themes.filter((theme: Theme) => 
                    theme.resonancePattern === emotions[selectedEmotion].resonancePattern
                  )
                ).map((theme: Theme) => (
                  <Button
                    key={theme.id}
                    variant="outline"
                    className={cn(
                      "h-auto p-4 flex flex-col items-start gap-2",
                      selectedTheme?.id === theme.id && "border-2 border-primary"
                    )}
                    onClick={() => handleThemeSelect(theme)}
                  >
                    <span className="font-medium">{theme.label}</span>
                    <span className="text-sm text-muted-foreground text-left">
                      {theme.description}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {theme.healingProperties.map((prop: string) => (
                        <span
                          key={prop}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {prop}
                        </span>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'format' && selectedTheme && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Choose your device format
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['mobile', 'tablet', 'desktop'].map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    className={cn(
                      "h-auto p-4",
                      selectedFormat === format && "border-2 border-primary"
                    )}
                    onClick={() => handleFormatSelect(format as 'mobile' | 'desktop' | 'tablet')}
                    disabled={isGenerating}
                  >
                    <span className="font-medium capitalize">{format}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="text-center">
              <span className="animate-pulse">Creating your mindful space...</span>
            </div>
          )}

          {imageUrl && selectedEmotion && selectedTheme && selectedFormat && (
            <MeditationPreviewDialog
              imageUrl={imageUrl}
              format={selectedFormat}
              emotion={emotions[selectedEmotion].label}
              theme={selectedTheme.label}
              onClose={() => {
                setShowPreview(false);
                setCurrentStep('emotion');
                setSelectedEmotion(null);
                setSelectedTheme(null);
                setSelectedFormat(null);
                setImageUrl(null);
              }}
              open={showPreview}
            />
          )}
        </CardContent>
      </Card>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
} 