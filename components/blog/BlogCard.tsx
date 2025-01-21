import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  coverImage: string;
}

export function BlogCard({ title, excerpt, date, category, slug, coverImage }: BlogCardProps) {
  return (
    <article className="border border-gray-200/60 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="mb-2">
            <span className="text-sm font-space-mono text-primary">{category}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm font-space-mono text-gray-500">{date}</span>
          </div>
          <h2 className="text-xl font-heading mb-3">{title}</h2>
          <p className="text-text-secondary font-body line-clamp-2">{excerpt}</p>
        </div>
      </Link>
    </article>
  );
} 