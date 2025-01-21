import { BlogList } from '@/components/blog/BlogList';
import { BlogBanner } from '@/components/blog/BlogBanner';
import { Container } from '@/components/ui/Container';

export default function BlogPage() {
  return (
    <main className="py-12">
      <Container size="wide">
        <BlogBanner />
        <h1 className="text-4xl font-heading mb-8">Latest Articles</h1>
        <BlogList />
      </Container>
    </main>
  );
} 