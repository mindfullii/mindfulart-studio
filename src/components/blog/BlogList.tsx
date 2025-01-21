import { BlogCard } from './BlogCard';

export function BlogList() {
  // 这里后续会从 API 或 CMS 获取数据
  const posts = [
    {
      title: "Modern Eden Gallery Presents 'Year of the Snake'",
      excerpt: "As the new year rushes in, join Modern Eden Gallery this weekend for the exciting presentation of 'Year of the Snake', featuring works that explore serpentine symbolism...",
      date: "January 18, 2025",
      category: "Exhibitions",
      slug: "modern-eden-gallery-snake",
      coverImage: "/images/blog/posts/post1.jpg"
    },
    {
      title: "The Art of Digital Mindfulness",
      excerpt: "Exploring how digital artists are incorporating mindfulness practices into their creative process, leading to more meaningful and impactful artwork...",
      date: "January 15, 2025",
      category: "Digital Art",
      slug: "digital-mindfulness-art",
      coverImage: "/images/blog/posts/post2.jpg"
    },
    {
      title: "Meditation Through Color Theory",
      excerpt: "Discover how understanding color theory can enhance your mindful art practice and create more harmonious compositions...",
      date: "January 12, 2025",
      category: "Techniques",
      slug: "meditation-color-theory",
      coverImage: "/images/blog/posts/post3.jpg"
    },
    {
      title: "Artist Spotlight: Sarah Chen's Mindful Landscapes",
      excerpt: "An interview with emerging artist Sarah Chen about her unique approach to creating mindful landscape art using AI...",
      date: "January 10, 2025",
      category: "Artist Spotlight",
      slug: "artist-spotlight-sarah-chen",
      coverImage: "/images/blog/posts/post4.jpg"
    },
    {
      title: "The Rise of AI in Contemplative Art",
      excerpt: "How artificial intelligence is helping artists create more meaningful and meditative artistic experiences...",
      date: "January 8, 2025",
      category: "Technology",
      slug: "ai-contemplative-art",
      coverImage: "/images/blog/posts/post5.jpg"
    },
    {
      title: "Finding Peace Through Creative Practice",
      excerpt: "A guide to incorporating mindfulness techniques into your daily creative routine for better mental health and artistic output...",
      date: "January 5, 2025",
      category: "Wellness",
      slug: "peace-creative-practice",
      coverImage: "/images/blog/posts/post6.jpg"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
} 