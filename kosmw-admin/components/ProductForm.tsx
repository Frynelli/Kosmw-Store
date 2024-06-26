// // Product Form

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import UploadComponent from "./UploadComponent";
// import Spinner from '../components/Spinner'
// import Link from 'next/link';
// import { FaRegTrashCan } from 'react-icons/fa6';

// interface Product {
//   _id?: string;
//   title?: string;
//   description?: string;
//   price?: string;
//   images?: string[]; // Changed to images
//   dataId?: string;
// }

// interface ProductFormProps {
//   _id?: string;
//   title?: string;
//   description?: string;
//   price?: string;
//   images?: string[]; // Changed to images
//   dataId?: string; // id of the product to be updated
// }

// const ProductForm = ({ _id, title, description, price, images, dataId }: ProductFormProps) => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [product, setProduct] = useState<Product>({
//     title: '',
//     description: '',
//     price: '',
//     images: [],
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [uploadedImages, setUploadedImages] = useState<string[]>(images || []);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
// console.log(product,':This is Product from ProductForm');
// console.log(uploadedImages,':UploadedImages from ProductForm')
//   useEffect(() => {
//     if (id && _id) {
//       fetchProduct(id as string);
//     }
//   }, [id, _id]);

//   const fetchProduct = async (productId: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/products?id=${productId}`);
//       const fetchedProduct: Product = res.data[0];
//       setProduct(fetchedProduct);
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   //Delete one image
//   const handleImageDelete = (index: number) => {
//     const updatedImages = [...uploadedImages];
//     updatedImages.splice(index, 1);
//     setUploadedImages(updatedImages);
//     setProduct(prevProduct => ({
//       ...prevProduct,
//       images: updatedImages,
//     }));
//   };

//   //Uploading images
//   const handleImageUpload = (imageUrls: string[]) => {
//     setProduct(prevProduct => ({
//       ...prevProduct,
//       images: imageUrls,
//     }));
//     setUploadedImages(imageUrls);
//   };
// //Submit function
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const url = id ? `/api/products?id=${id}` : '/api/products';
//     const method = id ? 'PUT' : 'POST';
//     const res = await axios({
//       method: method,
//       url: url,
//       data: product,
//     });
//     if (res.status === 200) {
//       router.push('/products'); // Redirect to product list page
//     }
//   } catch (error) {
//     console.error('Error submitting product:', error);
//   } finally {
//     setLoading(false);
//   }
// };
//   const setUploadingStatus = (status: boolean) => {
//     setIsUploading(status);
//   };
  
//   if (loading) return <div className='loading'><p><Spinner/></p></div>;

//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor='title'>Title:</label>
//       <input
//         id="title"
//         type="text"
//         value={product.title}
//         onChange={(e) => setProduct({ ...product, title: e.target.value })}
//         required
//       />
//       <label htmlFor='images'>Images:</label>
//       {uploadedImages.length > 0 && (
//         <div className='mb-2 flex flex-wrap'>
//           {uploadedImages.map((image, index) => (
//             <span>
//             <img 
//             key={index} 
//             src={image} 
//             alt={`Product Image ${index + 1}`} 
//             className='w-48 h-48 object-cover rounded-md mr-2 border-2 border-gray-400 mt-2 mb-2' />
//            <button
//                 type="button"
//                 className=" bg-red-500 text-white rounded-full p-1 m-2 hover:bg-red-600"
//                 onClick={() => handleImageDelete(index)}
//               >
//                 <FaRegTrashCan className='m-1' />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}
//       <div className='mb-2'>
//         <UploadComponent
//           setUploadingStatus={setUploadingStatus}
//           onUpload={handleImageUpload}
//         />
//       </div>
//       <label htmlFor='description'>Description:</label>
//       <input
//         id='description'
//         type="text"
//         value={product.description}
//         onChange={(e) => setProduct({ ...product, description: e.target.value })}
//         required
//       />
//       <label htmlFor='price'>Price:</label>
//       <input
//         id='price'
//         type="number"
//         value={product.price}
//         onChange={(e) => setProduct({ ...product, price: e.target.value })}
//         required
//       />
//       <button className='btn-primary btn-peach' type="submit" disabled={isUploading}>{id ? 'Update Product' : 'Create Product'}</button>
//     </form>
//   );
// };

// export default ProductForm;

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
//import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
//import { deleteImageFromS3, deleteImageFromDatabase } from '@/lib/s3'; 

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
  images?: string[]; // Changed to images
  dataId?: string; // id of the product to be updated
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
  
  
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fetchedImages, setFetchedImages]= useState<string[]>([]);
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

       // Set the initial fetched images state
       initialFetchedImages.current = fetchedProduct.images || [];
       // Set the initial product state
       initialProduct.current = fetchedProduct;

    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  //Delete bulk fn
// const handleBulkDelete = async (selectedImages: string[]) => {
//   setLoading(true);
//   const imageIdsArray = Array.from(fetchedImages);
//   console.log(imageIdsArray,"ImageARRAY handleBulkDelete ProductForm")
//   if (!window.confirm('Are you sure you want to delete the selected products?')) return;
//   try {
//     const { data } = await axios.post('/api/bulk-delete', { 
//       imageId: selectedImages,
//       productId:[product._id] 
//     });
//     console.log(data,'data handleBulkDelete ProductForm')
//     await fetchProduct(id as string);
//   } catch (error) {
//     console.error('Error during bulk delete:', error);
//   } finally {
//     setLoading(false);
//   }
// };

  // const handleImageDelete = async (index: number) => {
  //   try {
  //     const updatedImages = [...uploadedImages];
  //     const deletedImage = updatedImages.splice(index, 1)[0]; // Get the deleted image URL
  //     setUploadedImages(updatedImages);
  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       images: updatedImages,
  //     }));
  //     console.log(deletedImage, 'deletedImage: ProductForm: handleImageDelete')
  //     // Extract the filename from the URL (assuming it's the last segment after '/')
  //     const fileName = deletedImage.split('/').pop();
  //     if (!fileName) {
  //       console.error('Invalid image URL:', deletedImage);
  //       return;
  //     }
  //     // Construct the S3 delete command
  //     const deleteCommand = new DeleteObjectCommand({
  //       Bucket: process.env.BUCKET_NAME,
  //       Key: fileName,
  //     });
  
  //     // Send the delete request to S3
  //     await clientS3.send(deleteCommand);
  
  //     console.log(`Deleted file from S3: ${fileName}`);
  //   } catch (error) {
  //     console.error('Error deleting file from S3:', error);
  //     // Handle error appropriately, e.g., show an error message to the user
  //   }
  // };
//handleImageDelete is to pass the image info to ProductForm
  // const handleImageDelete = async (index: number) => {
  //   try {
  //     // Copy the uploadedImages array and remove the selected image
  //     const updatedImages = [...uploadedImages];
  //     const deletedImage = updatedImages.splice(index, 1)[0]; // Get the URL of the deleted image
  //     console.log(deletedImage,'deleted image')
  //     // Update state with the new array
      
  //     setUploadedImages(updatedImages);
  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       images: updatedImages,
  //     }));

  //     //S3 logic here
  //     const clientS3 = new S3Client({
  //       credentials: {
  //         accessKeyId: process.env.S3_ACCESS_KEY || '',
  //         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  //       },
  //       region: 'us-east-1', 
  //     });

  //     //console.log(deletedImage, 'deletedImage: ProductForm: handleImageDelete');
      
  //     // Extract the filename from the URL
  //     const fileName = deletedImage.split('/').pop(); // Assuming the URL ends with the filename
  //     if (!fileName) {
  //       console.error('Invalid image URL:', deletedImage);
  //       return;
  //     }
  
  //     // Construct the S3 delete command
  //     const deleteCommand = new DeleteObjectCommand({
  //       Bucket: process.env.BUCKET_NAME, // Use NEXT_PUBLIC to make sure it's available in the client environment
  //       Key: deletedImage,
  //     });
  
  //     // Send the delete request to S3
  //     await clientS3.send(deleteCommand);
      
  //     //mongoDb delete logic

  //     console.log(`Deleted file from S3: ${fileName}`);
  //   } catch (error) {
  //     console.error('Error deleting file from S3:', error);
  //     // Handle error appropriately, e.g., show an error message to the user
  //   }
  // };
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
      console.log(combinedImages,'CombinedImages from handleSubmit')
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
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  
  //   try {
  //     // Perform deletion of marked images from S3 and database
  //     if (imagesToDelete.length > 0) {
  //       const response = await fetch('/api/bulk-delete', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //               productId: [product._id],  // Assuming `product.id` is the current product's ID
  //               imageIds: imagesToDelete,
  //           }),
  //       });
  //       const result = await response.json();
  //       console.log(result.message, 'Bulk delete response');
  //   }
  
  //     // Combine remaining fetched and uploaded images
  //     const combinedImages = [...uploadedImages];
  //     const updatedProduct = { ...product, images: combinedImages };
  
  //     const url = id ? `/api/products?id=${id}` : '/api/products';
  //     const method = id ? 'PUT' : 'POST';
  //     const res = await axios({
  //       method: method,
  //       url: url,
  //       data: updatedProduct,
  //     });
  
  //     if (res.status === 200) {
  //       router.push('/products'); // Redirect to product list page
  //     }
  //   } catch (error) {
  //     console.error('Error submitting product:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

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
