import { Container } from '@/components/ui/Container';
import { ArtworkGrid } from '@/components/explore/ArtworkGrid';
import { CategoryHeader } from '@/components/explore/CategoryHeader';

const mockArtworks = [
  {
    id: '1',
    title: 'Zen Garden',
    description: 'A curated masterpiece combining traditional and modern mindful art.',
    imageUrl: '/images/explore/picks/zen.jpg',
    downloadUrl: '/images/explore/picks/zen.jpg',
    tags: ['zen', 'featured', 'mindful']
  },
  // ... 可以添加更多测试数据
];

export default function EditorsPicks() {
  return (
    <Container className="py-12">
      <CategoryHeader 
        title="Editor's Picks"
        description="A carefully curated collection of our most inspiring artworks, selected for their unique ability to enhance mindfulness practice."
      />
      
      <ArtworkGrid 
        category="editorspicks"
        initialArtworks={mockArtworks}
      />
    </Container>
  );
} 