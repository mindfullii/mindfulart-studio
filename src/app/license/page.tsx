import { Container } from '@/components/ui/Container';

export default function LicensePage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-heading mb-8">License Information</h1>
      
      <div className="prose max-w-none">
        <h2>Free to Use License</h2>
        <p>
          All artworks on MindfulArt Studio are free to use for both personal and commercial purposes.
        </p>

        {/* 可以添加更多许可证详细信息 */}
      </div>
    </Container>
  );
} 