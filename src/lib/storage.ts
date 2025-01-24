import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: 'https://51159ff01e1247a31b68933143db0701.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '0e19d0c44640ff3ed412d5270770dd77',
    secretAccessKey: 'cdc2df03ebc159f8b89302b920573ac1cf07602b06690f3ecebda858212097f7',
  },
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3, initialDelay = 1000) {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries || !error?.message?.includes('rate limit')) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Rate limit hit, retrying in ${delay}ms...`);
      await sleep(delay);
      retries++;
    }
  }
}

export async function uploadToR2(buffer: Buffer, filename: string): Promise<string> {
  console.log('🚀 Starting R2 upload for:', filename);
  try {
    const command = new PutObjectCommand({
      Bucket: 'mindful-art-storage',
      Key: filename,
      Body: buffer,
      ContentType: 'image/png',
      ACL: 'public-read',
      Metadata: {
        'x-amz-acl': 'public-read',
      },
      CacheControl: 'public, max-age=31536000',
    });
    
    console.log('📤 Sending upload command to R2...');
    await retryWithBackoff(() => R2.send(command));
    console.log('✅ Upload successful');

    const imageUrl = `https://pub-e1f86caa0538490c93d0298f702975c3.r2.dev/${filename}`;
    console.log('🔗 Generated URL:', imageUrl);
    return imageUrl;
  } catch (error: any) {
    console.error('❌ Failed to upload to R2:', error);
    console.error('Error details:', {
      name: error?.name || 'Unknown error',
      message: error?.message || 'No error message',
      stack: error?.stack || 'No stack trace',
    });
    throw new Error('Failed to upload image to storage');
  }
} 