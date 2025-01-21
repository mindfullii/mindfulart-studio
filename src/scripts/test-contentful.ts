require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful');

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error('\x1b[31mError: Missing required environment variables\x1b[0m');
  console.error('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID);
  console.error('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN);
  process.exit(1);
}

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: '_7SWbYfiRWgvyJ7w1Ebx-XYTqDj0ZCx_GWEKjViE1G4',
});

function extractTextFromRichText(richText: any): string {
  if (!richText || !richText.content) return '';
  
  let text = '';
  richText.content.forEach((node: any) => {
    if (node.nodeType === 'text') {
      text += node.value;
    } else if (node.content) {
      text += extractTextFromRichText(node);
    }
  });
  return text;
}

function formatRichTextContent(content: any): string {
  if (!content || !content.content) return '';

  let formattedText = '';
  content.content.forEach((node: any) => {
    if (node.nodeType === 'paragraph') {
      const text = extractTextFromRichText(node);
      if (text) {
        formattedText += `\n    ${text}\n`;
      }
    } else if (node.nodeType === 'embedded-entry-block' && node.data.target) {
      const image = node.data.target.fields;
      if (image) {
        formattedText += '\n    [Image]';
        formattedText += `\n    Title: ${image.internalName || 'No title'}`;
        formattedText += `\n    Caption: ${image.caption || 'No caption'}`;
        formattedText += '\n';
      }
    }
  });
  return formattedText;
}

async function main() {
  try {
    console.log('\x1b[34m=== Fetching all blog posts ===\x1b[0m');
    const response = await client.getEntries({
      content_type: 'pageBlogPost',
      order: ['-sys.createdAt'],
    });

    console.log(`\x1b[32mFound ${response.items.length} posts:\x1b[0m`);
    console.log('\x1b[33m----------------------------------------\x1b[0m');
    
    response.items.forEach((item: any, index: number) => {
      const fields = item.fields;
      console.log(`\x1b[36m${index + 1}. ${fields.title || 'Untitled'}\x1b[0m`);
      console.log(`   📎 Slug: ${fields.slug || 'no-slug'}`);
      console.log(`   📌 Subtitle: ${fields.subtitle || 'No subtitle'}`);
      if (fields.content) {
        const contentText = extractTextFromRichText(fields.content);
        console.log(`   📄 Preview: ${contentText.substring(0, 100)}...\n`);
      }
      console.log('\x1b[33m----------------------------------------\x1b[0m');
    });

    if (response.items.length > 0) {
      console.log('\n\x1b[34m=== First Post Details ===\x1b[0m');
      const firstPost = response.items[0];
      const fields = firstPost.fields;
      
      const postDetails = {
        title: fields.title || 'Untitled',
        subtitle: fields.subtitle || null,
        slug: fields.slug || 'no-slug',
        featuredImage: fields.featuredImage && {
          url: fields.featuredImage.fields.file.url.startsWith('//')
            ? `https:${fields.featuredImage.fields.file.url}`
            : fields.featuredImage.fields.file.url,
          title: fields.featuredImage.fields.title || 'No title',
          dimensions: {
            width: fields.featuredImage.fields.file.details?.image?.width,
            height: fields.featuredImage.fields.file.details?.image?.height,
          }
        },
        publishedDate: fields.publishedDate 
          ? new Date(fields.publishedDate).toLocaleDateString()
          : new Date(firstPost.sys.createdAt).toLocaleDateString(),
        author: fields.author && {
          name: fields.author.fields.name || 'Anonymous',
          avatar: fields.author.fields.avatar && {
            url: fields.author.fields.avatar.fields.file.url.startsWith('//')
              ? `https:${fields.author.fields.avatar.fields.file.url}`
              : fields.author.fields.avatar.fields.file.url,
          }
        },
        relatedPosts: Array.isArray(fields.relatedBlogPosts)
          ? fields.relatedBlogPosts.map((post: any) => ({
              title: post.fields.title || 'Untitled',
              slug: post.fields.slug || 'no-slug',
            }))
          : [],
      };

      console.log('\n📑 Basic Information:');
      console.log(`   Title: ${postDetails.title}`);
      console.log(`   Subtitle: ${postDetails.subtitle || 'No subtitle'}`);
      console.log(`   Slug: ${postDetails.slug}`);
      console.log(`   Published: ${postDetails.publishedDate}`);

      if (postDetails.featuredImage) {
        console.log('\n🖼️  Featured Image:');
        console.log(`   Title: ${postDetails.featuredImage.title}`);
        console.log(`   URL: ${postDetails.featuredImage.url}`);
        console.log(`   Dimensions: ${postDetails.featuredImage.dimensions.width}x${postDetails.featuredImage.dimensions.height}`);
      }

      if (postDetails.author) {
        console.log('\n👤 Author:');
        console.log(`   Name: ${postDetails.author.name}`);
        if (postDetails.author.avatar) {
          console.log(`   Avatar: ${postDetails.author.avatar.url}`);
        }
      }

      if (fields.content) {
        console.log('\n📝 Content:');
        console.log(formatRichTextContent(fields.content));
      }

      if (postDetails.relatedPosts.length > 0) {
        console.log('\n🔗 Related Posts:');
        postDetails.relatedPosts.forEach((post: any, index: number) => {
          console.log(`   ${index + 1}. ${post.title} (${post.slug})`);
        });
      }
    }
  } catch (error) {
    console.error('\x1b[31mError:\x1b[0m', error);
  }
}

main(); 