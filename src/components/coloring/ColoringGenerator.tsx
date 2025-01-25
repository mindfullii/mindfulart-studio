'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signIn } from 'next-auth/react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export function ColoringGenerator() {
  const { data: session } = useSession();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

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

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/create/coloring' });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // 处理注册
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error('Registration failed');
        }

        // 注册成功后自动登录
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        setShowAuthModal(false);
      } else {
        // 处理登录
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        setShowAuthModal(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Meet your mindful coloring companion ✨
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4 text-gray-600">
          <p className="text-base leading-relaxed">
            What makes it special? It doesn't just draw what you say - it thoughtfully weaves in elements that bring peace and warmth to your heart. As you color, you'll naturally find yourself in a state of calm and mindfulness.
          </p>
          
          <p className="text-base leading-relaxed">
            No complex settings, no confusing choices. Leave everything to your AI companion who understands and cares about your well-being. Every artwork is a personalized mindful experience created just for you 🎨
          </p>
        </div>
      </div>

      {/* 简化的输入区域 */}
      <div className="bg-white rounded-lg p-8 shadow-lg space-y-6">
        <div className="text-gray-600">
          <p className="text-base leading-relaxed mb-4">
            Just tell us what you'd like to draw - your favorite character, an animal, a landscape, or even a simple idea. We'll understand your thoughts and create a unique coloring page just for you.
          </p>
        </div>
        
        <textarea
          className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base"
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

      {/* 新的登录提示模态框 */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="grid grid-cols-2">
            {/* Left Column - Value Proposition */}
            <div className="bg-[#F8FAF9] p-6 flex flex-col justify-center min-h-[420px]">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">✨</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                Join us to create your artwork
              </h3>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  Sign in to unlock the full creative experience:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-base">✨</span>
                    <span className="text-sm">Save your mindful artworks</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-base">📈</span>
                    <span className="text-sm">Track your creative journey</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-base">🎨</span>
                    <span className="text-sm">Get personalized recommendations</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-base">⭐</span>
                    <span className="text-sm">Access premium features</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="p-6 flex flex-col min-h-[420px]">
              {/* Tabs */}
              <div className="flex space-x-4 border-b mb-4">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`pb-2 px-4 transition-colors ${
                    activeTab === 'signin'
                      ? 'border-b-2 border-[#6DB889] text-[#6DB889]'
                      : 'text-gray-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`pb-2 px-4 transition-colors ${
                    activeTab === 'signup'
                      ? 'border-b-2 border-[#6DB889] text-[#6DB889]'
                      : 'text-gray-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="space-y-4">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg px-4 py-2 border border-gray-200 transition-colors"
                  >
                    <img
                      src="/icons/google.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    Continue with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="h-[180px] transition-all duration-200 ease-in-out">
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      {activeTab === 'signup' && (
                        <Input
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      )}
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      
                      {activeTab === 'signin' && (
                        <div className="flex justify-end">
                          <Link 
                            href="/forgot-password"
                            className="text-sm text-[#6DB889] hover:text-[#5CA978] transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6DB889] hover:bg-[#5CA978] text-white font-medium rounded-lg px-4 py-2 transition-colors mt-2"
                      >
                        {isLoading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 温暖的加载状态 */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 border-4 border-[#6DB889] border-t-transparent rounded-full animate-spin" />
              <p className="text-base font-medium">Creating your mindful space...</p>
            </div>
            <p className="text-gray-500 text-center mt-4 text-sm">
              Understanding your thoughts and weaving them into a peaceful design. This thoughtful process takes a moment...
            </p>
          </div>
        </div>
      )}

      {/* 生成结果展示区域 */}
      {generatedImageUrl && (
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-6">Your Mindful Coloring Page</h2>
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
              className="flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-base"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-base"
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