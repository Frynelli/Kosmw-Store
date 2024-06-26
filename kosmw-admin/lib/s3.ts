// lib/s3.ts

import AWS from 'aws-sdk';

// Configure AWS with your credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

export const deleteImageFromS3 = async (imageKey: string): Promise<void> => {
    const bucketName = process.env.BUCKET_NAME;
    console.log(bucketName,'bucketname')
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME is not defined in environment variables.');
  }

  const params = {
    Bucket: bucketName,
    Key: imageKey, // The image key (file path in the bucket)
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Deleted image from S3: ${imageKey}`);
  } catch (error) {
    console.error(`Failed to delete image from S3: ${imageKey}`, error);
    throw error;
  }
};
