import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
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
      Bucket: process.env.R2_BUCKET_NAME,
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