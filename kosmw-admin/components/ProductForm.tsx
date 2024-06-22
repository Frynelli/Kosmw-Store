// Product Form
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import UploadComponent from "./UploadComponent";

interface Product {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  images?: string[]; // Changed to images
  dataId?: string;
}

interface ProductFormProps {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  images?: string[]; // Changed to images
  dataId?: string; // id of the product to be updated
}

const ProductForm = ({ _id, title, description, price, images, dataId }: ProductFormProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({ _id, title, description, price, images, dataId });
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(images || []);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setUploadedImages(images || []);
  }, [images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProduct = { ...product, images: uploadedImages };
      if (_id) {
        await axios.put(`/api/products?_id=${_id}`, updatedProduct);
      } else {
        await axios.post('/api/products', updatedProduct);
      }
      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (uploadedImages: string[]) => {
    setUploadedImages(uploadedImages);
    setProduct(prevProduct => ({
      ...prevProduct,
      images: uploadedImages
    }));
  };

  const setUploadingStatus = (status: boolean) => {
    setIsUploading(status);
  };

  if (loading) return <div className='loading'><p>Loading...</p></div>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='title'>Title:</label>
      <input
        id="title"
        type="text"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        required
      />
      <label htmlFor='images'>Images:</label>
      <div className='mb-2'>
        <UploadComponent
          setUploadingStatus={setUploadingStatus}
          onUpload={handleImageUpload}
        />
      </div>
      <label htmlFor='description'>Description:</label>
      <input
        id='description'
        type="text"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        required
      />
      <label htmlFor='price'>Price:</label>
      <input
        id='price'
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        required
      />
      <button className='btn-primary btn-peach' type="submit" disabled={isUploading}>Save Product</button>
    </form>
  );
};

export default ProductForm;
