import { BlogCard } from './BlogCard';

export function BlogList() {
  // 这里后续会从 API 或 CMS 获取数据
  const posts = [
    {
      title: "Modern Eden Gallery Presents 'Year of the Snake'",
      excerpt: "As the new year rushes in, join Modern Eden Gallery this weekend for the exciting presentation of 'Year of the Snake'...",
      date: "January 18, 2025",
      category: "Exhibitions",
      slug: "modern-eden-gallery-snake",
      coverImage: "/images/blog/post1.jpg"
    },
    // ... 更多文章
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
} 