'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <div className="relative h-screen w-full">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Mindful Art Background"
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
      </div>

      {/* 内容层 */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-heading text-white mb-6">
              Create Mindful Art with AI
            </h1>
            <p className="text-xl text-white/90 mb-8 font-body">
              Transform your imagination into beautiful artworks while practicing mindfulness
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/create">Start Creating</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/explore">Explore Gallery</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
} 