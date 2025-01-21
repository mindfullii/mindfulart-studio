import { Container } from '@/components/ui/Container';
import { BlogPostBanner } from '@/components/blog/BlogPostBanner';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { RecommendedPosts } from '@/components/blog/RecommendedPosts';
import { getBlogPost } from '@/lib/contentful';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="pb-12">
      <BlogPostBanner post={post} />
      <Container size="wide" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogPostContent content={post.content} />
          </div>
          <div className="lg:col-span-1">
            <RecommendedPosts currentPost={post} />
          </div>
        </div>
      </Container>
    </main>
  );
} 