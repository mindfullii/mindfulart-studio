import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  imagePath: string;
}

export function FeatureCard({ title, description, imagePath }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
        <Image 
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-[1.5em] font-subheading text-text-primary">{title}</h3>
      <p className="text-base font-body text-text-secondary">
        {description}
      </p>
    </div>
  );
} 
