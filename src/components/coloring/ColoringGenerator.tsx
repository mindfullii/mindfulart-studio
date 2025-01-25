'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function ColoringGenerator() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/create/coloring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      if (!generatedImageUrl) return;

      const downloadUrl = `/api/coloring/download?url=${encodeURIComponent(generatedImageUrl)}&format=png`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coloring_page.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PNG:', error);
      toast.error('Failed to download PNG. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!generatedImageUrl) return;

      const downloadUrl = `/api/coloring/download?url=${encodeURIComponent(generatedImageUrl)}&format=pdf`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coloring_page.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* 温暖的欢迎区域 */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Meet your mindful coloring companion ✨
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4 text-gray-600">
          <p className="text-lg">
            Just tell us what you'd like to draw - your favorite character, an animal, a landscape, or even a simple idea. We'll understand your thoughts and create a unique coloring page just for you.
          </p>
          
          <p className="text-lg">
            What makes it special? It doesn't just draw what you say - it thoughtfully weaves in elements that bring peace and warmth to your heart. As you color, you'll naturally find yourself in a state of calm and mindfulness.
          </p>
          
          <p className="text-lg">
            No complex settings, no confusing choices. Leave everything to your AI companion who understands and cares about your well-being. Every artwork is a personalized mindful experience created just for you 🎨
          </p>
        </div>
      </div>

      {/* 简化的输入区域 */}
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <textarea
          className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-lg"
          placeholder="Share your idea with me..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className={`mt-6 w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-colors ${
            loading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#6DB889] hover:bg-[#5CA978]'
          }`}
        >
          {loading ? 'Creating with care...' : 'Create your mindful coloring page'}
        </button>
      </div>

      {/* 温暖的加载状态 */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 border-4 border-[#6DB889] border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium">Creating your mindful space...</p>
            </div>
            <p className="text-gray-500 text-center mt-4">
              Understanding your thoughts and weaving them into a peaceful design. This thoughtful process takes a moment...
            </p>
          </div>
        </div>
      )}

      {/* 生成结果展示区域 */}
      {generatedImageUrl && (
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Your Mindful Coloring Page</h2>
          <div className="relative aspect-square w-full mb-6 border border-gray-100 rounded-lg overflow-hidden">
            <Image
              src={generatedImageUrl}
              alt="Your mindful coloring page"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 