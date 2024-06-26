//api/image-delete.tsx
//Here is the backend for Bulk Delete
//Its connected with products page delete bulk button




import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { mongooseConnect } from '@/lib/mongoose';
import clientPromise from '@/lib/db';
import { deleteImageFromS3 } from '@/lib/s3'; // Import the S3 deletion utility


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const {productId, imageUrls, extractedImageKey } = req.body;
    console.log('Received imageUrls:', imageUrls);
    console.log('Recieved ProductId',productId);
    console.log('Received extractedImages',extractedImageKey);

    if (!extractedImageKey || !Array.isArray(extractedImageKey)) {
        console.log('In extractedImage if its array ');
        return res.status(400).json({ error: 'Invalid image IDs' });
    }

    
    if (!productId || !Array.isArray(productId) || productId.length === 0) {
        console.log("We are In ProductId in Image-delete")
        return res.status(400).json({ error: 'Invalid product IDs' });
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        console.log('In ImageUrls if its array ');
        return res.status(400).json({ error: 'Invalid image URLs' });
    }

    try {
        await mongooseConnect();
        const client = await clientPromise;
        const db = client.db(process.env.DB_DB);
        const ProductsData = db.collection(`${process.env.DB_COLLECTION_1}`);

        //const objectIds = new ObjectId(productId);
        const objectIds = productId.map((id) => new ObjectId(id));
        console.log(objectIds,'ObjectIds ');

        
        // Delete images from S3
        const deleteFromS3Promises = extractedImageKey.map(async (key) => {
            try {
                await deleteImageFromS3(key);
                console.log(`Deleted ${key} from S3`);
            } catch (error) {
                console.error(`Error deleting ${key} from S3:`, error);
                throw error; // Propagate error to handle it later
            }
        });

        // Remove images from MongoDB products
        
        const deleteResult = imageUrls.map(
            async (imageUrl) => {
                try {
                    const deleteImage = await ProductsData.updateMany(
                        {_id: { $in: objectIds }},
                        {$pull: {images: imageUrl}} as any
                    );
                    console.log(deleteImage,'deleteImage from MongoDb');
                }catch(error){
                    console.error(`Error deleting ${imageUrl}:`, error);
                }
            }
        )
        console.log(deleteResult,'delete result in image-delete')
        await Promise.all(deleteResult)
        await Promise.all(deleteFromS3Promises);
        
        res.status(200).json({
            message: 'images deleted successfully',
            deletedCount: imageUrls.length,
        });
    } catch (error) {
        console.log("HERE IS THE ERROR")
        console.error('Error deleting images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
