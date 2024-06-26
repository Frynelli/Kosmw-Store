// Product Form
//component/ProductForm
//its called in products/edit 
//its called in products/new

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import UploadComponent from './UploadComponent';
import Spinner from '../components/Spinner';
//import { FaRegTrashCan } from 'react-icons/fa6';
import ProductGallery from '@/components/ProductGallery'; // Assuming the path is correct

interface Product {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  images?: string[]; // Changed to images
  dataId?: string; // id of the product to be updated
}

interface ProductFormProps {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  images?: string[];
  dataId?: string; 
}

const ProductForm: React.FC<ProductFormProps> = ({ _id, title, description, price, images, dataId }) => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product>({
    _id:'',
    title: '',
    description: '',
    price: '',
    images: [],
  });
  
  
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); //images that we want to delete we get it from ProductGallery selection
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); //images uploaded from the UploadedComponent
  const [fetchedImages, setFetchedImages]= useState<string[]>([]); //initial fetching of the images
  const [isUploading, setIsUploading] = useState<boolean>(false);
  //console.log(uploadedImages,'uploaded Images productForm');
  //console.log(fetchedImages,'fetchedImages ProductForm');
  //console.log(imagesToDelete,'imagesToDelete ProductForm');
  
  
  // Store the initial state to compare later
  const initialProduct = useRef({ ...product });
  const initialFetchedImages = useRef<string[]>([]);

  useEffect(() => {
    if (id && _id) {
      fetchProduct(id as string);
    }
  }, [id, _id]);

  const fetchProduct = async (productId: string) => {
    //this fetched product I recieve it from MongoDb
    setLoading(true);
    try {
      const res = await axios.get(`/api/products?id=${productId}`);
      const fetchedProduct: Product = res.data[0];
      //console.log(fetchedProduct._id,'this is the id is it?IMPORTANT')
      setProduct(fetchedProduct);
      setFetchedImages(fetchedProduct.images || []);

       // Set the initial fetched images and product state
       initialFetchedImages.current = fetchedProduct.images || [];
       initialProduct.current = fetchedProduct;
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  //Delete bulk fn
  const handleSelectedImagesToDelete = (images:string | string[]) => {
    if (!Array.isArray(images)) {
      console.log(images,'24092384092isadjhfiaohf')
      console.error('Expected an array of strings for images.');
      return;
  }

  console.log(images,'Here are the images in the handledelete')
    setImagesToDelete(images);
    };

  //deleting Of Images
  const extractImageKey = (imageUrl: string): string => {
    const baseUrl = "https://kosmwbucket.s3.amazonaws.com/";

    if (imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, '');
    } else {
        console.error(`Image URL does not match the base URL: ${imageUrl}`);
        return imageUrl; // Fallback to the original URL if it doesn't match
    }
};

  const deletingImages = async () => {
    console.log('You are IN DeletingImages')
    if (imagesToDelete.length > 0) {
      
      const imageKeysToDelete: string[] = imagesToDelete.map(extractImageKey);
        //console.log(id,"is it the correct ID?")
        console.log(imageKeysToDelete, 'Cleaned Image Keys to Delete');
        console.log(imagesToDelete,'ImagesToDelete');
        try {
            const response = await axios.post('/api/image-delete', {
                imageUrls: imagesToDelete,
                productId: id,
                extractedImageKey:imageKeysToDelete
            });

            console.log(response.data.message, 'Image-Bulk delete response what it says?');
        } catch (error) {
            console.error('Error deleting images:', error);
            alert("there is an error here!")
        }
    }
};

  //handleImageUpload logic Here
  const handleImageUpload = (imageUrls: string | string[])=>{
    //console.log(imageUrls,'imageUrls handleUpload function');
    const imageArray = typeof imageUrls === 'string' ? imageUrls.split(',') : imageUrls;
    console.log(imageArray,'ImageArray? handleImageUpload')
    setUploadedImages(imageArray);
    
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("we are IN SUBMIT")
    try {
       // Delete images first
      await deletingImages();

      const currentProduct = {
        ...product,
        images: [...fetchedImages, ...uploadedImages],
      };

      // Check if there are any changes
      const hasChanges =
        JSON.stringify(currentProduct) !== JSON.stringify(initialProduct.current) ||
        JSON.stringify(fetchedImages) !== JSON.stringify(initialFetchedImages.current);

      if (!hasChanges) {
        router.push('/products'); // Redirect if no changes
        return;
      }
      
      //Combine fetched with uploaded images
      const combinedImages = [...uploadedImages];
      const updatedProduct = { ...product, images: combinedImages };
      //console.log(combinedImages,'CombinedImages from handleSubmit')
      const url = id ? `/api/products?id=${id}` : '/api/products';
      const method = id ? 'PUT' : 'POST';
      const res = await axios({
        method: method,
        url: url,
        data: updatedProduct,
      });
      if (res.status === 200) {
        router.push('/products'); // Redirect to product list page
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const setUploadingStatus = (status: boolean) => {
    setIsUploading(status);
  };

  if (loading) return <div className="loading"><p><Spinner /></p></div>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        required
      />
      <label>Images:</label>
      <ProductGallery
        images={fetchedImages}
        onSelect={() => {}}
        onDelete={handleSelectedImagesToDelete}
      />
      <div className="mb-2">
        <UploadComponent
          setUploadingStatus={setUploadingStatus}
          onUpload={handleImageUpload}
        />
      </div>
      <label htmlFor="description">Description:</label>
      <input
        id="description"
        type="text"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        required
      />
      <label htmlFor="price">Price:</label>
      <input
        id="price"
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        required
      />
      <button className="btn-primary btn-peach" type="submit" disabled={isUploading}>
        {id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;
