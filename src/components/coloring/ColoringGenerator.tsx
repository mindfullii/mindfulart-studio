'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { toast } from "sonner";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { AuthModal } from '@/components/auth/AuthModal';

interface ColoringPreviewProps {
  imageUrl: string
  description: string
  prompt: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (format: 'png' | 'pdf') => void
  isDownloading: boolean
}

function ColoringPreview({ 
  imageUrl, 
  description,
  prompt,
  isOpen, 
  onOpenChange,
  onDownload,
  isDownloading 
}: ColoringPreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] p-8">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Your Mindful Coloring Page</h2>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Content */}
          <div className="flex gap-8 h-[calc(90vh-8rem)]">
            {/* Left: Image Preview */}
            <div className="flex-1 min-w-0">
              <div className="relative h-full border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Generated coloring page"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Right: Information */}
            <div className="w-96 flex flex-col">
              {/* Generated Prompt */}
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-base font-medium mb-3">Generated Prompt</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{prompt}</p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="space-y-3 pt-6">
                <Button
                  onClick={() => onDownload('png')}
                  variant="outline"
                  className="w-full"
                  disabled={isDownloading}
                >
                  Download PNG
                </Button>
                <Button
                  onClick={() => onDownload('pdf')}
                  variant="outline"
                  className="w-full"
                  disabled={isDownloading}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ColoringGenerator() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 智能共振转化层系统
  const resonanceSystem = {
    // 第一层：意图识别层
    analyzeIntent: (input: string) => {
      const keywords = {
        character: ['character', 'person', 'figure', 'hero', 'friend', 'animal', 'creature'],
        scene: ['landscape', 'scene', 'place', 'garden', 'forest', 'beach', 'mountain'],
        abstract: ['pattern', 'design', 'shape', 'form', 'flow', 'energy', 'feeling'],
        memory: ['memory', 'childhood', 'remember', 'past', 'time', 'moment', 'experience']
      };

      input = input.toLowerCase();
      for (const [type, words] of Object.entries(keywords)) {
        if (words.some(word => input.includes(word))) {
          return type;
        }
      }
      return 'scene'; // 默认场景类型
    },

    // 第二层：情感共振层
    analyzeResonance: (input: string) => {
      const resonancePatterns = {
        nurturing: ['comfort', 'warm', 'safe', 'gentle', 'soft', 'care'],
        empowering: ['strong', 'power', 'confident', 'brave', 'free'],
        calming: ['peace', 'quiet', 'calm', 'relax', 'tranquil', 'serene'],
        uplifting: ['happy', 'joy', 'light', 'bright', 'fun', 'play'],
        grounding: ['earth', 'solid', 'stable', 'root', 'deep', 'firm'],
        flowing: ['water', 'flow', 'river', 'wave', 'stream', 'fluid']
      };

      input = input.toLowerCase();
      let resonances = [];
      for (const [pattern, words] of Object.entries(resonancePatterns)) {
        if (words.some(word => input.includes(word))) {
          resonances.push(pattern);
        }
      }
      return resonances[0] || 'calming'; // 默认使用平静的共振
    },

    // 第三层：转化增益层
    generateTransformation: (intent: string, resonance: string) => {
      const transformations = {
        character: {
          nurturing: {
            elements: ['gentle expressions', 'soft outlines', 'protective symbols'],
            focus: 'creating a sense of comfort and care'
          },
          empowering: {
            elements: ['dynamic poses', 'uplifting gestures', 'strength symbols'],
            focus: 'expressing inner strength and confidence'
          },
          calming: {
            elements: ['peaceful expressions', 'balanced poses', 'serene details'],
            focus: 'radiating tranquility and peace'
          },
          uplifting: {
            elements: ['joyful expressions', 'playful details', 'light motifs'],
            focus: 'sharing joy and positive energy'
          },
          grounding: {
            elements: ['stable poses', 'earth symbols', 'rooted forms'],
            focus: 'connecting with inner stability'
          },
          flowing: {
            elements: ['flowing lines', 'graceful movements', 'fluid forms'],
            focus: 'expressing natural flow and harmony'
          }
        },
        scene: {
          nurturing: {
            elements: ['cozy spaces', 'protective elements', 'soft landscapes'],
            focus: 'creating a safe and nurturing environment'
          },
          empowering: {
            elements: ['expansive views', 'rising forms', 'strong landmarks'],
            focus: 'inspiring strength and possibility'
          },
          calming: {
            elements: ['peaceful settings', 'gentle nature', 'quiet spaces'],
            focus: 'fostering peace and tranquility'
          },
          uplifting: {
            elements: ['bright scenes', 'playful nature', 'joyful settings'],
            focus: 'celebrating life and joy'
          },
          grounding: {
            elements: ['solid structures', 'earth elements', 'stable forms'],
            focus: 'providing stability and groundedness'
          },
          flowing: {
            elements: ['flowing water', 'wind patterns', 'natural rhythms'],
            focus: 'moving with life\'s natural flow'
          }
        },
        abstract: {
          nurturing: {
            elements: ['rounded forms', 'embracing shapes', 'protective patterns'],
            focus: 'expressing care and comfort'
          },
          empowering: {
            elements: ['rising patterns', 'dynamic forms', 'strong shapes'],
            focus: 'channeling inner strength'
          },
          calming: {
            elements: ['balanced patterns', 'gentle rhythms', 'peaceful forms'],
            focus: 'creating visual peace'
          },
          uplifting: {
            elements: ['light patterns', 'playful shapes', 'joyful forms'],
            focus: 'lifting spirits through design'
          },
          grounding: {
            elements: ['stable patterns', 'rooted forms', 'earth symbols'],
            focus: 'anchoring through design'
          },
          flowing: {
            elements: ['fluid patterns', 'flowing forms', 'natural rhythms'],
            focus: 'expressing natural movement'
          }
        },
        memory: {
          nurturing: {
            elements: ['nostalgic symbols', 'comforting details', 'familiar forms'],
            focus: 'honoring cherished memories'
          },
          empowering: {
            elements: ['transformative symbols', 'growth patterns', 'journey motifs'],
            focus: 'celebrating personal growth'
          },
          calming: {
            elements: ['gentle reminders', 'peaceful moments', 'serene memories'],
            focus: 'finding peace in reflection'
          },
          uplifting: {
            elements: ['happy moments', 'joyful memories', 'playful details'],
            focus: 'celebrating joyful memories'
          },
          grounding: {
            elements: ['rooted memories', 'foundational moments', 'stable symbols'],
            focus: 'connecting with our roots'
          },
          flowing: {
            elements: ['flowing timelines', 'evolving patterns', 'journey symbols'],
            focus: 'embracing life\'s flow'
          }
        }
      };

      const transformation = transformations[intent as keyof typeof transformations]?.[resonance as keyof (typeof transformations)['character']] || 
        transformations.scene.calming;

      return transformation;
    }
  };

  const buildStructuredPrompt = (description: string) => {
    // 使用智能共振转化层系统分析和转化用户输入
    const intent = resonanceSystem.analyzeIntent(description);
    const resonance = resonanceSystem.analyzeResonance(description);
    const transformation = resonanceSystem.generateTransformation(intent, resonance);
    
    let prompt = `Create a mindful coloring page featuring ${description}.

Transformation Focus: ${transformation.focus}

Style Guidelines:
- Key elements: ${transformation.elements.join(', ')}
- Create clear, flowing outlines suitable for therapeutic coloring
- Maintain generous white space with mindful pattern spacing
- Keep the background completely white for coloring
- Add subtle details that encourage mindful attention
- Ensure all lines are clean and well-defined

The design should be both visually engaging and calming to color, promoting a sense of peace and mindfulness.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!session) {
      setShowAuthModal(true)
      return
    }

    if (!prompt.trim()) {
      toast.error('Please share what you would like to create');
      return;
    }

    setLoading(true);
    try {
      const structuredPrompt = buildStructuredPrompt(prompt);
      setGeneratedPrompt(structuredPrompt);

      const response = await fetch('/api/create/coloring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: structuredPrompt,
          description: prompt
        }),
      });

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate coloring page');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate coloring page');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!generatedImageUrl) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/artwork/download?url=${encodeURIComponent(generatedImageUrl)}&format=${format}`);
      if (!response.ok) {
        throw new Error('Failed to download');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coloring-page.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* 温暖的欢迎区域 */}
      <div className="text-center space-y-6">
        <h1 className="font-['EB_Garamond'] text-[2.8em] font-semibold leading-[1.2] mb-4">
          Coloring Meditation
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4 text-gray-600">
          <p className="font-['Quattrocento_Sans'] text-base font-light leading-[1.6]">
            Paint your thoughts with gentle strokes. Find peace in every line.
          </p>
          
          <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6]">
            Create your personal coloring meditation in two simple steps:
          </p>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-['Quattrocento_Sans'] text-[17px] font-semibold mb-2">Share Your Vision</h3>
              <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6]">
                Let your thoughts flow freely - whether it's a peaceful landscape, a beloved character, or a feeling you want to express. Your words will guide our creation.
              </p>
            </div>
            <div>
              <h3 className="font-['Quattrocento_Sans'] text-[17px] font-semibold mb-2">Begin Your Practice</h3>
              <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6]">
                Within moments, your unique coloring page will be ready. Find your quiet space, pick up your colors, and let each stroke guide you to inner peace.
              </p>
            </div>
          </div>

          <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6] mt-8 italic">
            Remember: There are no rules in mindful coloring. Each line you color is a moment of peace, each page a new journey to tranquility.
          </p>
        </div>
      </div>

      {/* 简化的输入区域 */}
      <div className="bg-white rounded-lg p-8 shadow-lg space-y-6">
        <div className="text-gray-600">
          <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6] mb-4">
            Just tell us what you'd like to draw - your favorite character, an animal, a landscape, or even a simple idea. We'll understand your thoughts and create a unique coloring page just for you.
          </p>
        </div>
        
        <textarea
          className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6DB889] resize-none text-base"
          placeholder="Share your idea with me..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium text-base transition-colors ${
            loading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#6DB889] hover:bg-[#5CA978]'
          }`}
        >
          {loading ? 'Creating with care...' : 'Create your mindful coloring page'}
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />

      {/* Preview Dialog */}
      {generatedImageUrl && (
        <ColoringPreview
          imageUrl={generatedImageUrl}
          description={prompt}
          prompt={generatedPrompt}
          isOpen={showPreview}
          onOpenChange={setShowPreview}
          onDownload={handleDownload}
          isDownloading={loading}
        />
      )}
    </div>
  );
} 