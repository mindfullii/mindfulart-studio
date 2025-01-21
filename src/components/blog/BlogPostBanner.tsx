import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';

interface BlogPostBannerProps {
  post: {
    title: string;
    category: string;
    date: string;
    coverImage: string;
  };
}

export function BlogPostBanner({ post }: BlogPostBannerProps) {
  return (
    <div className="bg-gray-50">
      <Container size="wide" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-primary font-space-mono">{post.category}</span>
                <span className="text-gray-300">•</span>
                <time className="text-gray-500 font-space-mono">{post.date}</time>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 