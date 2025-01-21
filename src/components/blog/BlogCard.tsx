import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/contentful';
import { formatDate, calculateReadingTime } from '@/lib/utils';

export function BlogCard({
  title,
  slug,
  subtitle,
  featuredImage,
  publishedDate,
  content,
  author,
}: BlogPost) {
  const minutes = calculateReadingTime(content);

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
        {featuredImage && (
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={featuredImage.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}
        <div className="p-6">
          {/* Meta information */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
            <span>•</span>
            <span>{minutes} min read</span>
          </div>
          
          {/* Title and subtitle */}
          <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground line-clamp-2 mb-4">{subtitle}</p>
          )}

          {/* Author information */}
          {author && (
            <div className="flex items-center gap-2 mt-4">
              {author.avatar && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar.url}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm text-muted-foreground">{author.name}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
} 