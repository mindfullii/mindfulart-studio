import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/contentful';

interface RecommendedPostsProps {
  currentPost: BlogPost;
}

export function RecommendedPosts({ currentPost }: RecommendedPostsProps) {
  const recommendedPosts = currentPost.relatedBlogPosts || [];

  if (recommendedPosts.length === 0) {
    return null;
  }

  return (
    <aside>
      <h2 className="text-2xl font-heading mb-6">Related Articles</h2>
      <div className="space-y-6">
        {recommendedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="grid grid-cols-3 gap-4">
              {post.featuredImage && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="col-span-2">
                <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {post.subtitle}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </aside>
  );
} 