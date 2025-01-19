interface CategoryHeaderProps {
  title: string;
  description: string;
}

export function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <div className="mb-12 max-w-3xl">
      <h1 className="text-4xl font-heading mb-4">{title}</h1>
      <p className="text-lg text-text-secondary font-body leading-relaxed">
        {description}
      </p>
    </div>
  );
} 