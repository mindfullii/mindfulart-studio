import React from 'react';
import Image from 'next/image';

interface RichTextNode {
  nodeType: string;
  content?: RichTextNode[];
  value?: string;
  data?: {
    target?: {
      fields: {
        internalName: string;
        caption?: string;
        image: {
          fields: {
            file: {
              url: string;
              details: {
                image: {
                  width: number;
                  height: number;
                };
              };
            };
            title: string;
          };
        };
        fullWidth?: boolean;
      };
    };
  };
}

interface BlogPostContentProps {
  content: {
    content: RichTextNode[];
  };
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  if (!content?.content) return null;

  return (
    <article className="prose prose-lg max-w-none">
      {content.content.map((node, index) => {
        if (node.nodeType === 'paragraph') {
          return (
            <p key={index}>
              {node.content?.map((inline, i) => {
                if (inline.nodeType === 'text') {
                  return <React.Fragment key={i}>{inline.value}</React.Fragment>;
                }
                return null;
              })}
            </p>
          );
        }

        if (node.nodeType === 'embedded-entry-block' && node.data?.target) {
          const { fields } = node.data.target;
          const imageUrl = fields.image.fields.file.url.startsWith('//')
            ? `https:${fields.image.fields.file.url}`
            : fields.image.fields.file.url;

          return (
            <figure key={index} className={fields.fullWidth ? 'col-span-full' : ''}>
              <div className="relative aspect-[16/9]">
                <Image
                  src={imageUrl}
                  alt={fields.image.fields.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              {fields.caption && (
                <figcaption className="text-center mt-2 text-sm text-gray-500">
                  {fields.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
    </article>
  );
} 