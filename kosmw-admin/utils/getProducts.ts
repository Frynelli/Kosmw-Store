// getProducts.ts
//Here we request the products from the database

import clientPromise from '../lib/db';


export async function getProducts() {
  const client = await clientPromise;
  const db = client.db('Kosmw-products');
  const products = await db.collection('products').find({}).toArray();
  return products;
}
