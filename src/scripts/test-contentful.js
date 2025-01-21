const { getBlogPosts, getBlogPost } = require('../../dist/lib/contentful');

async function main() {
  try {
    console.log('Fetching all blog posts...');
    const posts = await getBlogPosts();
    console.log(`Found ${posts.length} posts:`);
    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Category: ${post.category}`);
      console.log(`   Excerpt: ${post.excerpt}`);
    });

    if (posts.length > 0) {
      console.log('\nFetching first post details...');
      const post = await getBlogPost(posts[0].slug);
      if (post) {
        console.log('\nFirst post details:');
        console.log(JSON.stringify(post, null, 2));
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 