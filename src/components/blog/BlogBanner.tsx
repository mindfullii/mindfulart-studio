import Image from 'next/image';
import Link from 'next/link';

export function BlogBanner() {
  return (
    <div className="relative w-full h-[400px] mb-12 rounded-xl overflow-hidden">
      <Image
        src="/images/blog/banner.jpg"
        alt="Blog Banner"
        fill
        className="object-cover brightness-[0.85]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-3xl">
          <div className="mb-4">
            <span className="text-sm font-space-mono text-primary-100 bg-primary/90 px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
            The Evolution of AI Art: From Pixels to Masterpieces
          </h2>
          <p className="text-lg font-body text-white/90 mb-6">
            Explore the fascinating journey of AI-generated art and its impact on the contemporary art world
          </p>
          <Link 
            href="/blog/ai-art-evolution" 
            className="inline-block px-6 py-3 bg-white text-primary font-space-mono text-sm hover:bg-white/90 transition-colors rounded-lg"
          >
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
} 