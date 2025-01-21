import { Container } from '../../../components/ui/Container';
import { BlogPostBanner } from '../../../components/blog/BlogPostBanner';
import { BlogPostContent } from '../../../components/blog/BlogPostContent';
import { RecommendedPosts } from '../../../components/blog/RecommendedPosts';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // TODO: Fetch post data based on slug
  const post = {
    title: "Artist Directory: Daniel McMahon",
    category: "Artist Directory",
    date: "January 16, 2025",
    coverImage: "/images/blog/posts/post1.jpg",
    content: `Born and raised in Sydney, Australia, Daniel McMahon is a talented pencil artist who has honed his skills through years of practice and dedication to his craft. His passion for art began at a young age, and he has since developed a unique style that showcases his ability to capture the beauty of the world around him.

Daniel specializes in pencil drawings, using the medium to create highly-detailed and intricate artworks that convey a sense of depth and realism. His subjects range from landscapes and cityscapes to portraits and still life, and he is always exploring new techniques and styles to push his art to new heights.

Over the years, Daniel has gained recognition for his work, with his pieces being featured in several exhibitions and art shows throughout Sydney. Daniel's dedication to his craft has also earned him a loyal following on social media, where he shares his latest creations with a growing audience of art enthusiasts.`
  };

  return (
    <main className="pb-12">
      <BlogPostBanner post={post} />
      <Container size="wide" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogPostContent content={post.content} />
          </div>
          <div className="lg:col-span-1">
            <RecommendedPosts currentSlug={params.slug} />
          </div>
        </div>
      </Container>
    </main>
  );
} 