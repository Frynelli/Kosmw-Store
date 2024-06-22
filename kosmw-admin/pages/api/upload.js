// // pages/api/upload.js

import multiparty from 'multiparty';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const form = new multiparty.Form();
  const clientS3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  })
   
  form.parse(req, async (err, fields, files) => {
    console.log(files.file, 'this is files from upload.js')
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).send('Error parsing form');
    }

    if (!files.file || files.file.length === 0) {
      return res.status(400).send('No files uploaded');
    }

    const uploadedFiles = [];
    console.log(uploadedFiles,'uploadedFiles from upload.js')
    for (const file of files.file) {
      //all file info here//
      const filePath = file.path;
      const fileName = file.originalFilename;
      const fileType = file.headers['content-type'];
      const fileSize = file.size;
      const ext = fileName.split('.').pop();
      const newFileName = `${Date.now()}_${Math.floor(Math.random() * 1000000)}.${ext}`;
       // Read the file data
      const fileData = fs.readFileSync(filePath);
      //AWS send info to the bucket//
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: newFileName,
        Body: fileData,
        ACL: 'public-read',
        ContentType: fileType,
      })

      // Log file details for debugging
      console.log(`File received: ${newFileName} (${fileSize} bytes) - ${fileType}`,'new filename HERE');
      
      try {
        const s3response = await clientS3.send(command);
        console.log(s3response,"this is the AWS response")
        const newLink = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
    
        uploadedFiles.push({
          fileName: fileName,
          link: newLink,
        });

        // Clean up temporary file
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error saving file to database:', error);
        return res.status(500).send('Error saving file to database');
      }
    }

    res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  });
}

export const config = {
  api: { bodyParser: false }
};
