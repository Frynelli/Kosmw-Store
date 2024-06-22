//api/bulk-delete.tsx
//Here is the backend for Bulk Delete
//Its connected with products page delete bulk button

import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { mongooseConnect } from '@/lib/mongoose';
import clientPromise from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed frynelli' });
    }

    const { productId } = req.body;
    console.log(productId,':batch-delete')
    if (!productId || !Array.isArray(productId) || productId.length === 0) {
        return res.status(400).json({ error: 'Invalid product IDs' });
    }

    try {
        await mongooseConnect();
        const client = await clientPromise;
        const db = client.db('Kosmw-products');
        const ProductsData = db.collection('products');

        const objectIds = productId.map((id) => new ObjectId(id));
        console.log(objectIds,': ObjectId')
        const deleteResult = await ProductsData.deleteMany({ _id: { $in: objectIds } });
        console.log(deleteResult,'delete result in bulk-delete')
        res.status(200).json({ message: 'Products deleted successfully', deletedCount: deleteResult.deletedCount });
    } catch (error) {
        console.error('Error deleting products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
