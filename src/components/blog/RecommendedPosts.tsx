import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RecommendedPostsProps {
  currentSlug: string;
}

export function RecommendedPosts({ currentSlug }: RecommendedPostsProps) {
  // TODO: 这里后续会根据当前文章获取相关推荐
  const recommendedPosts = [
    {
      title: "The Art of Digital Mindfulness",
      excerpt: "Exploring how digital artists are incorporating mindfulness practices...",
      slug: "digital-mindfulness-art",
      coverImage: "/images/blog/posts/post2.jpg"
    },
    {
      title: "Meditation Through Color Theory",
      excerpt: "Discover how understanding color theory can enhance your mindful art practice...",
      slug: "meditation-color-theory",
      coverImage: "/images/blog/posts/post3.jpg"
    }
  ].filter(post => post.slug !== currentSlug);

  return (
    <aside>
      <h2 className="text-2xl font-heading mb-6">Recommended Articles</h2>
      <div className="space-y-6">
        {recommendedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="grid grid-cols-3 gap-4">
              <div className="relative aspect-[4/3]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2 mt-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </aside>
  );
} 