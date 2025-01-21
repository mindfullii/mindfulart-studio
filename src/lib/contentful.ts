import { createClient } from 'contentful';

// 正常客户端 - 用于获取已发布的内容
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// 预览客户端 - 用于获取草稿内容
export const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
});

// 根据是否预览模式选择客户端
export function getClient(preview: boolean = false) {
  return preview ? previewClient : contentfulClient;
}

// 前端使用的博客文章类型
export interface BlogPost {
  title: string;
  slug: string;
  subtitle?: string;
  featuredImage?: {
    url: string;
    title: string;
    width: number;
    height: number;
  };
  publishedDate: string;
  content: any; // Rich Text content
  author?: {
    name: string;
    avatar?: {
      url: string;
    };
  };
  relatedBlogPosts?: BlogPost[];
  tags: string[];
}

// 分页参数接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 分页结果接口
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 获取所有博客文章（带分页）
export async function getBlogPosts(pagination?: PaginationParams): Promise<PaginatedResult<BlogPost>> {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 6;
  const skip = (page - 1) * pageSize;

  const response = await contentfulClient.getEntries({
    content_type: 'pageBlogPost',
    order: ['-sys.createdAt'],
    include: 2,
    limit: pageSize,
    skip: skip,
  });

  const items = response.items.map((item: any) => ({
    title: item.fields.title || 'Untitled',
    slug: item.fields.slug || 'no-slug',
    subtitle: item.fields.subtitle,
    featuredImage: item.fields.featuredImage && {
      url: item.fields.featuredImage.fields.file.url.startsWith('//')
        ? `https:${item.fields.featuredImage.fields.file.url}`
        : item.fields.featuredImage.fields.file.url,
      title: item.fields.featuredImage.fields.title || 'No title',
      width: item.fields.featuredImage.fields.file.details?.image?.width,
      height: item.fields.featuredImage.fields.file.details?.image?.height,
    },
    publishedDate: item.fields.publishedDate 
      ? new Date(item.fields.publishedDate).toLocaleDateString()
      : new Date(item.sys.createdAt).toLocaleDateString(),
    content: item.fields.content,
    author: item.fields.author && {
      name: item.fields.author.fields.name || 'Anonymous',
      avatar: item.fields.author.fields.avatar && {
        url: item.fields.author.fields.avatar.fields.file.url.startsWith('//')
          ? `https:${item.fields.author.fields.avatar.fields.file.url}`
          : item.fields.author.fields.avatar.fields.file.url,
      }
    },
    relatedBlogPosts: Array.isArray(item.fields.relatedBlogPosts)
      ? item.fields.relatedBlogPosts.map((post: any) => ({
          title: post.fields.title || 'Untitled',
          slug: post.fields.slug || 'no-slug',
        }))
      : undefined,
    tags: item.metadata?.tags?.map((tag: any) => tag.sys.id) || [],
  }));

  return {
    items,
    total: response.total,
    page,
    pageSize,
    totalPages: Math.ceil(response.total / pageSize),
  };
}

// 获取单个博客文章
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const response = await contentfulClient.getEntries({
    content_type: 'pageBlogPost',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  });

  if (!response.items.length) {
    return null;
  }

  const item: any = response.items[0];
  return {
    title: item.fields.title || 'Untitled',
    slug: item.fields.slug || 'no-slug',
    subtitle: item.fields.subtitle,
    featuredImage: item.fields.featuredImage && {
      url: item.fields.featuredImage.fields.file.url.startsWith('//')
        ? `https:${item.fields.featuredImage.fields.file.url}`
        : item.fields.featuredImage.fields.file.url,
      title: item.fields.featuredImage.fields.title || 'No title',
      width: item.fields.featuredImage.fields.file.details?.image?.width,
      height: item.fields.featuredImage.fields.file.details?.image?.height,
    },
    publishedDate: item.fields.publishedDate 
      ? new Date(item.fields.publishedDate).toLocaleDateString()
      : new Date(item.sys.createdAt).toLocaleDateString(),
    content: item.fields.content,
    author: item.fields.author && {
      name: item.fields.author.fields.name || 'Anonymous',
      avatar: item.fields.author.fields.avatar && {
        url: item.fields.author.fields.avatar.fields.file.url.startsWith('//')
          ? `https:${item.fields.author.fields.avatar.fields.file.url}`
          : item.fields.author.fields.avatar.fields.file.url,
      }
    },
    relatedBlogPosts: Array.isArray(item.fields.relatedBlogPosts)
      ? item.fields.relatedBlogPosts.map((post: any) => ({
          title: post.fields.title || 'Untitled',
          slug: post.fields.slug || 'no-slug',
        }))
      : undefined,
    tags: item.metadata?.tags?.map((tag: any) => tag.sys.id) || [],
  };
}

// 根据标签获取文章（带分页）
export async function getPostsByTag(tag: string, pagination?: PaginationParams): Promise<PaginatedResult<BlogPost>> {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 6;
  const skip = (page - 1) * pageSize;

  const response = await contentfulClient.getEntries({
    content_type: 'pageBlogPost',
    order: ['-sys.createdAt'],
    'metadata.tags.sys.id[in]': [tag], // Fix: Wrap tag in array
    include: 2,
    limit: pageSize,
    skip: skip,
  });

  const items = response.items.map((item: any) => ({
    title: item.fields.title || 'Untitled',
    slug: item.fields.slug || 'no-slug',
    subtitle: item.fields.subtitle,
    featuredImage: item.fields.featuredImage && {
      url: item.fields.featuredImage.fields.file.url.startsWith('//')
        ? `https:${item.fields.featuredImage.fields.file.url}`
        : item.fields.featuredImage.fields.file.url,
      title: item.fields.featuredImage.fields.title || 'No title',
      width: item.fields.featuredImage.fields.file.details?.image?.width,
      height: item.fields.featuredImage.fields.file.details?.image?.height,
    },
    publishedDate: item.fields.publishedDate 
      ? new Date(item.fields.publishedDate).toLocaleDateString()
      : new Date(item.sys.createdAt).toLocaleDateString(),
    content: item.fields.content,
    author: item.fields.author && {
      name: item.fields.author.fields.name || 'Anonymous',
      avatar: item.fields.author.fields.avatar && {
        url: item.fields.author.fields.avatar.fields.file.url.startsWith('//')
          ? `https:${item.fields.author.fields.avatar.fields.file.url}`
          : item.fields.author.fields.avatar.fields.file.url,
      }
    },
    relatedBlogPosts: Array.isArray(item.fields.relatedBlogPosts)
      ? item.fields.relatedBlogPosts.map((post: any) => ({
          title: post.fields.title || 'Untitled',
          slug: post.fields.slug || 'no-slug',
        }))
      : undefined,
    tags: item.metadata?.tags?.map((tag: any) => tag.sys.id) || [],
  }));

  return {
    items,
    total: response.total,
    page,
    pageSize,
    totalPages: Math.ceil(response.total / pageSize),
  };
} 