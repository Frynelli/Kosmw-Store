//NEW TRIAL WITH NEW IMAGES
// api/products.tsx
//all product axios methods here
//POST DELETE PUT POSTALL

import {mongooseConnect} from '@/lib/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('Incoming request:', req.method, req.url);
  const { method, url, query, body } = req; //we extract these info from the request
  await mongooseConnect(); //connect to database
  const client = await clientPromise; //the connection to the database
  const db = client.db('Kosmw-products'); //connect to KosmwDB
  const ProductsData = db.collection('products');// connect to product collection

  //For Bulk Delete HERE
  if (method === 'POST' && url === '/api/bulk-delete') {
    // Bulk delete functionality
      const { productIds } = query;
      console.log(productIds,'We are in the POST_URL');
      
      if (!Array.isArray(productIds) || productIds.length === 0) {
        console.log('we cant find the id in POST_URL')
        return res.status(400).json({ error: 'Invalid product IDs' });
      }

      const objectIds = productIds.map((id: string) => new ObjectId(id));
      const deleteResult = await ProductsData.deleteMany({ _id: { $in: objectIds } });

      res.status(200).json({ message: 'Products deleted successfully', deletedCount: deleteResult.deletedCount });
  }else if (method === 'POST') {
    // Create a new product
    try {
      const { title, description, price, images } = req.body;
        
      if (!title ||!description ||!price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await ProductsData.insertOne({
        title,
        description,
        price,
        images: images || [],
        createdAt: new Date(),
      });

      res.status(200).json({ message: 'Product created successfully', productId: result.insertedId });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (method === 'GET') {
    // Get all products from db
    const { id, sortBy } = req.query;
    // console.log(id, "From api/product/");

    try {
      let products;
      if (id) {
        const product = await ProductsData.findOne({ _id: new ObjectId(id as string) });
        if (!product) {
          return res.status(404).json({ error: 'Product with ID not found' });
        }
        products = [product];
      } else {
        let sortCriteria: { [key: string]: number } = { createdAt: -1 }; // Default sort by createdAt descending
        if (sortBy === 'title') {
          sortCriteria = { title: 1 }; // Sort by title ascending
          console.log(sortCriteria,'sortCriteria what is it ')
        }
        products = await ProductsData.find({}).sort(sortCriteria as any).toArray();

      }
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (method === 'PUT') {
    // Update a product in db
    // const id = req.query._id;
    const { _id, title, description, price, images } = body;
    // console.log(_id, 'From api/product/?id');
    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
      // Fetch existing product
      const existingProduct = await ProductsData.findOne({ _id: new ObjectId(_id) });
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      // Combine existing images with new ones
      const updatedImages = [...(existingProduct.images || []), ...(images || [])];
      const updateResult = await ProductsData.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { title, description, price, images: updatedImages || [] } } // Update images array
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update product' });
      }
      if (updateResult.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update product' });
      }
      const updatedProduct = await ProductsData.findOne({ _id: new ObjectId(_id) });

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found after update' });
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if(method === 'DELETE'){
    //Delete one file
    const id = req.query._id;
    console.log(id, 'From delete method');
    try {
      if (!ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const result = await ProductsData.deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}