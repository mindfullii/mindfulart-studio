import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from 'crypto';

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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