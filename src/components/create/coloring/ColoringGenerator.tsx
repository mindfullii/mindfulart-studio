'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { jsPDF } from 'jspdf'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { NextResponse } from 'next/server'

// Types
interface Theme {
  id: string;
  label: string;
}

interface ThemeCategory {
  title: string;
  themes: Theme[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Emotion {
  id: string;
  label: string;
}

interface AspectRatio {
  id: string;
  label: string;
  value: string;
}

interface Complexity {
  id: string;
  label: string;
}

interface JsPDFOptions {
  orientation?: 'portrait' | 'landscape'
  unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc'
  format?: [number, number]
}

// Prompt Template Mappings
const emotionalStates = {
  'anxious': 'seeking calm and gentle reassurance',
  'overwhelmed': 'finding space and inner peace',
  'restless': 'discovering stillness and focus',
  'seeking-peace': 'embracing tranquility and harmony',
  'need-grounding': 'finding stability and connection',
  'want-inspiration': 'seeking uplift and creative flow'
} as const;

const emotionalQualities = {
  'anxious': {
    quality: 'calming flow',
    features: [
      'gentle, flowing lines',
      'rounded corners',
      'soft transitions'
    ]
  },
  'overwhelmed': {
    quality: 'spacious breathing room',
    features: [
      'generous white space',
      'clear focal points',
      'uncluttered composition'
    ]
  },
  'restless': {
    quality: 'gentle structure',
    features: [
      'balanced rhythms',
      'predictable patterns',
      'soothing repetition'
    ]
  },
  'seeking-peace': {
    quality: 'harmonious balance',
    features: [
      'symmetrical elements',
      'equal visual weight',
      'unified composition'
    ]
  },
  'need-grounding': {
    quality: 'stable foundation',
    features: [
      'strong base elements',
      'centered composition',
      'anchoring patterns'
    ]
  },
  'want-inspiration': {
    quality: 'uplifting movement',
    features: [
      'rising patterns',
      'dynamic flow',
      'energetic elements'
    ]
  }
} as const;

const themePatterns = {
  'traditional-mindfulness': {
    pattern: 'sacred geometric patterns, mandalas',
    style: 'symmetrical, centered compositions',
    background: 'radiating patterns'
  },
  'natural-elements': {
    pattern: 'organic flowing patterns, nature motifs',
    style: 'fluid, natural compositions',
    background: 'gentle nature-inspired elements'
  },
  'elemental-patterns': {
    pattern: 'ethereal swirling patterns',
    style: 'dynamic, flowing compositions',
    background: 'elemental symbols'
  },
  'abstract-concepts': {
    pattern: 'dynamic energy patterns',
    style: 'fluid, conceptual compositions',
    background: 'abstract flowing forms'
  },
  'emotional-healing': {
    pattern: 'gentle embracing patterns',
    style: 'nurturing, supportive compositions',
    background: 'protective, comforting elements'
  }
} as const;

// Helper functions for prompt generation
function analyzeUserInput(description: string): {
  type: 'character' | 'scene' | 'pattern';
  count: 'single' | 'multiple';
} {
  const characterKeywords = ['character', 'hello kitty', 'pokemon', 'animal', 'creature', 'person', 'figure'];
  const hasCharacter = characterKeywords.some(keyword => description.toLowerCase().includes(keyword));
  
  const multipleIndicators = [' and ', ' with ', ',', '&'];
  const hasMultiple = multipleIndicators.some(indicator => description.includes(indicator));
  
  return {
    type: hasCharacter ? 'character' : 'pattern',
    count: hasMultiple ? 'multiple' : 'single'
  };
}

export function ColoringGenerator() {
  const [description, setDescription] = useState("");
  const [selectedEmotion, setEmotion] = useState<string>("");
  const [selectedTheme, setTheme] = useState<string>("");
  const [selectedComplexity, setComplexity] = useState<string>("");
  const [selectedAspectRatio, setAspectRatio] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Data
  const emotions: Emotion[] = [
    { id: "anxious", label: "Anxious" },
    { id: "overwhelmed", label: "Overwhelmed" },
    { id: "restless", label: "Restless" },
    { id: "seeking-peace", label: "Seeking Peace" },
    { id: "need-grounding", label: "Need Grounding" },
    { id: "want-inspiration", label: "Want Inspiration" },
  ];

  const complexityOptions: Complexity[] = [
    { id: "simple", label: "Simple" },
    { id: "medium", label: "Medium" },
    { id: "detailed", label: "Detailed" },
  ];

  const aspectRatios: AspectRatio[] = [
    { id: "square", label: "Square", value: "1:1" },
    { id: "portrait", label: "Portrait", value: "2:3" },
    { id: "landscape", label: "Landscape", value: "3:2" },
  ];

  const themeCategories: ThemeCategory[] = [
    {
      title: "Traditional Mindfulness",
      themes: [
        { id: "mandala", label: "Mandala" },
        { id: "zen-circle", label: "Zen Circle" },
        { id: "sacred-geometry", label: "Sacred Geometry" },
        { id: "lotus-pattern", label: "Lotus Pattern" }
      ]
    },
    {
      title: "Natural Elements",
      themes: [
        { id: "ocean-waves", label: "Ocean Waves" },
        { id: "forest-path", label: "Forest Path" },
        { id: "garden-sanctuary", label: "Garden Sanctuary" },
        { id: "mountain-vista", label: "Mountain Vista" }
      ]
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What is Mindful Coloring?",
      answer: "Mindful Coloring is your creative companion for mindfulness practice - an AI-powered tool that transforms your ideas into meaningful coloring pages. Whether you are looking to de-stress, find focus, or simply enjoy a moment of creative calm, our tool combines your personal vision with mindful themes to create unique pages for coloring meditation."
    },
    {
      question: "How does Mindful Coloring work?",
      answer: "Share your vision with us through simple words (like a peaceful garden with butterflies;), choose how you are feeling, and select a mindful theme that speaks to you. Our AI will blend these elements into a unique coloring page that is perfect for your mindful practice. You can adjust the style and complexity until it feels just right."
    },
    {
      question: "What makes Mindful Coloring special?",
      answer: "We are unique because we blend art creation with mindfulness practice. Each theme and pattern is carefully designed to enhance your meditation and relaxation experience. Unlike regular coloring pages, ours are crafted to create moments of peace and presence."
    },
    {
      question: "Can I print the coloring pages?",
      answer: "Absolutely! Every page is designed to be printer-friendly. You can download your creation in either PNG or PDF format and print it at home or at your local print shop. We optimize all pages for clear, crisp lines that are perfect for coloring."
    },
    {
      question: "Do I need any artistic skills?",
      answer: "Not at all! All you need is your imagination and openness to mindful practice. Our tool is designed to be simple and intuitive - just share your thoughts, and we will handle the artistic creation."
    },
    {
      question: "How many pages can I create?",
      answer: "It depends on the plan you choose. For plan details, please check membership."
    },
    {
      question: "Can I use these pages commercially?",
      answer: "Yes! All pages you generate are yours to use however you wish. Whether it is for personal meditation, teaching, or commercial projects, you have full rights to your creations."
    },
    {
      question: "How often do you add new themes?",
      answer: "We regularly update our theme library with new mindful elements and patterns. We are constantly working with meditation experts and artists to bring you fresh inspiration for your practice."
    },
    {
      question: "What technology powers Mindful Coloring?",
      answer: "We use advanced AI technology, but what makes us special is how we have trained it specifically for mindful art creation. Our system understands the principles of meditation and peaceful art, ensuring each page supports your mindfulness journey."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you have complete flexibility with your subscription. You can cancel at any time through your account settings, no questions asked."
    },
    {
      question: "Do you offer refunds?",
      answer: "While we do not offer refunds for subscription payments, we encourage everyone to start with our Free Soul membership to experience our service before upgrading to a paid plan."
    }
  ];

  const buildStructuredPrompt = ({
    emotion,
    theme,
    complexity,
    aspectRatio,
    description
  }: {
    emotion: string;
    theme: string;
    complexity: string;
    aspectRatio: string;
    description?: string;
  }) => {
    const themeCategory = themeCategories.find((cat: ThemeCategory) => 
      cat.themes.some((t: Theme) => t.id === theme)
    )?.title.toLowerCase().replace(/\s+/g, '-') || '';

    const emotionalState = emotionalStates[emotion as keyof typeof emotionalStates];
    const emotionalQuality = emotionalQualities[emotion as keyof typeof emotionalQualities];
    const themePattern = themePatterns[themeCategory as keyof typeof themePatterns];
    
    const input = description ? analyzeUserInput(description) : { type: 'pattern', count: 'single' };
    
    let prompt = `Create a mindful ${emotionalState} coloring page featuring ${
      description || theme.replace('-', ' ')
    } with ${complexity} detail.`;

    if (input.type === 'character') {
      prompt += `\n\nCharacter styling:\n${
        input.count === 'multiple' ? 
        `- Create harmonious interaction between characters
         - Balance sizes and positions
         - Maintain individual character essence while creating unity
         - Ensure all mentioned characters are included
         - Create meaningful interaction that tells a story` :
        `- Maintain authentic features while adding mindful elements
         - Position in a meditative or peaceful pose
         - Create serene expression
         - Surround with theme-appropriate patterns`
      }`;
    }

    prompt += `\n\nComposition Guidelines:
    - Style: ${themePattern.style}
    - Pattern: ${themePattern.pattern}
    - Background: ${themePattern.background}
    - Features: ${emotionalQuality.features.join(', ')}
    
    The design should create clear, flowing outlines suitable for therapeutic coloring.
    Maintain generous white space with mindful pattern spacing.
    The background should remain completely white.`;

    return prompt.trim().replace(/\s+/g, ' ');
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      
      const structuredPrompt = buildStructuredPrompt({
        emotion: selectedEmotion,
        theme: selectedTheme,
        complexity: selectedComplexity,
        aspectRatio: selectedAspectRatio,
        description
      });
      
      console.log('Frontend - Sending prompt:', structuredPrompt);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: structuredPrompt,
          aspectRatio: selectedAspectRatio,
          complexity: selectedComplexity
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 401) {
          throw new Error('Please sign in to generate images')
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please purchase more credits or subscribe.')
        } else {
          throw new Error(error.error || 'Failed to generate image')
        }
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setImageUrl(url)

    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPNG = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'coloring-page.png'
    link.click()
  }

  const handleDownloadPDF = () => {
    if (!imageUrl) return;

    const img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const options: JsPDFOptions = {
        orientation: selectedAspectRatio === "2:3" ? "portrait" : "landscape",
        unit: "px",
        format: [img.width, img.height]
      };

      const pdf = new jsPDF(options);
      pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
      pdf.save("coloring-page.pdf");
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-['EB_Garamond'] text-[2.8em] font-semibold leading-[1.2] mb-2">
            Mindful Coloring
          </h1>
          <p className="font-['Quattrocento_Sans'] text-base font-light leading-[1.6] text-gray-600 mb-6">
            Transform moments into mindful coloring pages
          </p>
          <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6] text-gray-600">
            Ready to create some mindful magic? Just tell us what&apos;s on your mind, pick how you&apos;re feeling, 
            and choose a theme that clicks with you. Our AI will weave it all into a unique coloring page 
            that&apos;s yours to bring to life. Think of it as your personal calm-creating machine, but way 
            more fun than that sounds! Download, print, and let those colors flow.
          </p>
          <p className="font-['Quattrocento_Sans'] text-[15px] font-light leading-[1.6] text-gray-600 mt-4">
            ✨ No artistic skills required - just your imagination and a few clicks!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Input Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">
                Describe what you would like to create
              </h3>
              <Textarea
                placeholder="Express your vision here... For example: A peaceful scene with gentle waves under moonlight"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] font-['Quattrocento_Sans'] text-[15px] font-normal"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">
                How are you feeling right now?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {emotions.map((emotion) => (
                  <Button
                    key={emotion.id}
                    onClick={() => setEmotion(emotion.id)}
                    variant={emotion.id === selectedEmotion ? "default" : "outline"}
                    className={cn(
                      "font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em]",
                      emotion.id === selectedEmotion ? "bg-[#88B3BA] hover:bg-[#88B3BA]/90" : "hover:bg-[#88B3BA]/10"
                    )}
                  >
                    {emotion.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">Choose a theme</h3>
              <Accordion type="single" collapsible className="w-full">
                {themeCategories.map((category) => (
                  <AccordionItem key={category.title} value={category.title}>
                    <AccordionTrigger className="font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em] hover:no-underline">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {category.themes.map((theme) => (
                          <Button
                            key={theme.id}
                            onClick={() => setTheme(theme.id)}
                            variant={theme.id === selectedTheme ? "default" : "outline"}
                            className={cn(
                              "font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em]",
                              theme.id === selectedTheme ? "bg-[#88B3BA] hover:bg-[#88B3BA]/90" : "hover:bg-[#88B3BA]/10"
                            )}
                          >
                            {theme.label}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">Pattern Complexity</h3>
              <div className="flex gap-3">
                {complexityOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => setComplexity(option.id)}
                    variant={option.id === selectedComplexity ? "default" : "outline"}
                    className={cn(
                      "font-['Space_Mono'] flex-1 text-[14px] font-normal tracking-[0.02em]",
                      option.id === selectedComplexity ? "bg-[#88B3BA] hover:bg-[#88B3BA]/90" : "hover:bg-[#88B3BA]/10"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">Image Format</h3>
              <div className="flex gap-3">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.value)}
                    variant={selectedAspectRatio === ratio.value ? "default" : "outline"}
                    className={cn(
                      "font-['Space_Mono'] flex-1 text-[14px] font-normal tracking-[0.02em]",
                      selectedAspectRatio === ratio.value ? "bg-[#88B3BA] hover:bg-[#88B3BA]/90" : "hover:bg-[#88B3BA]/10"
                    )}
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isLoading || !description}
              className="w-full bg-[#88B3BA] hover:bg-[#88B3BA]/90 font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em]"
            >
              {isLoading ? "Generating..." : "Generate Coloring Page"}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-2">1 creation costs 1 credit</p>
          </div>

          {/* Right Column - Preview & FAQ Section */}
          <div className="w-full lg:w-1/3 space-y-6">
            <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">Preview</h3>
            <div className="min-h-[400px] rounded-lg border border-gray-200 flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#88B3BA] mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500">Creating your coloring page...</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <>
                  <Dialog>
                    <DialogTrigger className="relative w-full flex-1 cursor-zoom-in">
                      <Image
                        src={imageUrl}
                        alt="Generated coloring page"
                        fill
                        className="object-contain p-4"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/50 backdrop-blur-sm">
                      <div className="relative w-full h-[90vh] bg-white rounded-lg p-4">
                        <Image
                          src={imageUrl}
                          alt="Generated coloring page"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="flex justify-center gap-4 p-4 border-t border-gray-200">
                    <Button
                      onClick={handleDownloadPNG}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-[#88B3BA]/10 font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em]"
                    >
                      Download PNG
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-[#88B3BA]/10 font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em]"
                    >
                      Download PDF
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Your coloring page will appear here</p>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="font-['Spectral'] text-[1.5em] font-normal leading-[1.4]">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="font-['Space_Mono'] text-[14px] font-normal tracking-[0.02em] hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-['Quattrocento_Sans'] text-[13px] leading-[1.4] text-gray-600">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}