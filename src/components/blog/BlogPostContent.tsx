import React from 'react';

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <article className="prose prose-lg max-w-none">
      {content.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
} 