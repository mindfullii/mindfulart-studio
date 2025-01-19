import { Container } from '@/components/ui/Container';
import { ArtworkGrid } from '@/components/explore/ArtworkGrid';
import { CategoryHeader } from '@/components/explore/CategoryHeader';

const mockArtworks = [
  {
    id: '1',
    title: 'Urban Sketching',
    description: 'A mindful journey through urban landscapes.',
    imageUrl: '/images/explore/journal/urban.jpg',
    downloadUrl: '/images/explore/journal/urban.jpg',
    tags: ['urban', 'sketching', 'mindful']
  },
  // ... 可以添加更多测试数据
];

export default function VisualJournalArtworks() {
  return (
    <Container className="py-12">
      <CategoryHeader 
        title="Visual Journal Artworks"
        description="Explore artistic expressions of daily mindfulness practice through visual journaling. Each piece tells a unique story of presence and reflection."
      />
      
      <ArtworkGrid 
        category="visualjournalartworks"
        initialArtworks={mockArtworks}
      />
    </Container>
  );
} 