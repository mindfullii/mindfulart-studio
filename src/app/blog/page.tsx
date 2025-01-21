import { BlogList } from '@/components/blog/BlogList';
import { BlogBanner } from '@/components/blog/BlogBanner';
import { Container } from '@/components/ui/Container';
import { getBlogPosts } from '@/lib/contentful';
import { Pagination } from '@/components/ui/Pagination';

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1;
  const result = await getBlogPosts({ page, pageSize: 6 });
  
  return (
    <main className="py-12">
      <Container>
        <BlogBanner />
        <BlogList posts={result.items} />
        {result.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              baseUrl="/blog"
            />
          </div>
        )}
      </Container>
    </main>
  );
} 