import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

interface RichTextNode {
  nodeType: string;
  content?: RichTextNode[];
  value?: string;
}

export function calculateReadingTime(content: { content?: RichTextNode[] } | undefined): number {
  if (!content?.content) return 1;

  const words = content.content.reduce((acc: number, node: RichTextNode) => {
    if (node.nodeType === 'paragraph') {
      const text = node.content?.reduce((text: string, item: RichTextNode) => 
        item.nodeType === 'text' ? text + (item.value || '') : text, '');
      return acc + (text?.length || 0);
    }
    return acc;
  }, 0);

  return Math.ceil(words / 200) || 1;
} 