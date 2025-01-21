import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../ui/Container';
import type { BlogPost } from '@/lib/contentful';
import { formatDate } from '@/lib/utils';

interface BlogPostBannerProps {
  post: BlogPost;
}

export function BlogPostBanner({ post }: BlogPostBannerProps) {
  return (
    <div className="bg-gray-50">
      <Container size="wide" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {post.featuredImage && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
          <div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                {post.subtitle && (
                  <>
                    <span className="text-primary font-space-mono">{post.subtitle}</span>
                    <span className="text-gray-300">•</span>
                  </>
                )}
                <time className="text-gray-500 font-space-mono">
                  {formatDate(post.publishedDate)}
                </time>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading leading-tight">
                {post.title}
              </h1>
              {post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-3 pt-4">
                  {post.author.avatar && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={post.author.avatar.url}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{post.author.name}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 