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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Create beautiful mindful coloring pages with AI. Let your imagination flow and bring your ideas to life.
        </p>
      </div>

      {/* Generation form */}
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Enter Your Prompt</h2>
          <p className="text-gray-600">
            Describe what you'd like to see in your coloring page. Be specific about the style, elements, and mood.
          </p>
        </div>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Example: Create a mindful finding space and inner peace coloring page featuring zen morning with simple detail. Composition Guidelines: - Style: fluid, conceptual compositions - Pattern: dynamic energy patterns - Background: abstract flowing forms - Features: generous white space, clear focal points, uncluttered composition"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
              loading || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#6DB889] hover:bg-[#5CA978]'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Coloring Page'}
          </button>
        </div>
      </div>

      {/* Preview and download section */}
      {generatedImageUrl && (
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Your Coloring Page</h2>
          <div className="relative aspect-square w-full mb-6 border border-gray-100 rounded-lg overflow-hidden">
            <Image
              src={generatedImageUrl}
              alt="Generated coloring page"
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

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 border-4 border-[#6DB889] border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium">Creating your coloring page...</p>
            </div>
            <p className="text-gray-500 text-center mt-4">
              This may take a few moments. We're carefully crafting your unique design.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 