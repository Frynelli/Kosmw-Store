// import Layout from "@/components/Layout";
// import { useRouter } from "next/router";
// import axios from 'axios';
// import { useEffect, useState } from 'react';


// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   price: string;
//   image: string;
//   dataId:string;
// }

// const DeleteProduct = () => {
//     const router = useRouter();
//     const [product, setProduct] = useState<Product| null>(null);
//     const [products, setProducts] = useState<Product| null>(null);
//     const id = router.query.id;
//     console.log(products,"this is the product in delete page")
    
//     useEffect(() => {
//         if (id) {
//             const fetchProduct = async () => {
//                 try {
//                     const cleanId = Array.isArray(id) ? id[0].replace('delete', '') : id.replace('delete', '');
//                     const res = await axios.get(`/api/products?id=${cleanId}`);
//                     const productData = res.data.find((product: Product) => product._id === cleanId);
//                     if (!productData) {
//                       console.log('Product not found');
//                       return;
//                     }
//                     setProduct(productData);
//                 } catch (error) {
//                     console.error('Error fetching product:', error);
//                 }
//             };
//             const fetchData = async () => {
//               if (!id) {
//                 console.log('no id found');
//                 return;
//               }
          
//               try {
//                 const cleanId = Array.isArray(id)? id[0].replace('edit', '') : id.replace('edit', '');
//                 const res = await axios.get(`/api/products?id=${cleanId}`);
//                 const productData = res.data.find((product: Product) => product._id === cleanId);
//                 if (!productData) {
//                   console.log('Product not found');
//                   return;
//                 }
          
//                 setProducts(productData);
                
//               } catch (error) {
//                 console.error('Error fetching product:', error);
//               }
//             };
//             fetchData();
//             fetchProduct();  
//         } 
//     }, [id]);

//     const goBack = () => {
//         router.push('/products');
//     }

//     const handleDelete = async () => {
//         if (!product) {
//             console.log('No specific id found in handle delete');
//             return;
//         }
//         try {
//           if(product){
//             console.log(product._id,"this is inside the handle delete")
//             await axios.delete(`/api/products?_id=${product._id}`);
//             router.push('/products');
//           } 
//           router.push('/products');
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     };

//     return (
//         <Layout>
//               <div className="flex flex-col items-center justify-center">
//                 {product ? (
//                     <>
//                         <h2>Do you really want to delete {product.title}?</h2>
//                         {/* <ProductForm _id={product?._id} {...products}/> */}
//                         <span>
//                           <button className="btn-primary btn-blue hover:bg-red-600 hover:text-white hover:border-red-600  m-2" onClick={handleDelete}>Yes</button>
//                           <button className="btn-primary btn-blue" onClick={goBack}>No</button>
//                         </span>
//                     </>
//                 ) : (
//                     <p>Loading product...</p>
//                 )}
//             </div>
//         </Layout>
//     )
// }

// export default DeleteProduct;

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaRegTrashCan } from 'react-icons/fa6';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  images: string[];
}

const DeleteProduct = () => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!id){
          console.log('No Id')
        }else{
          const cleanId = Array.isArray(id) ? id[0].replace('delete', '') : id.replace('delete', '');
        const res = await axios.get(`/api/products?id=${cleanId}`);
        const productData = res.data.find((product: Product) => product._id === cleanId);
        if (!productData) {
          console.log('Product not found');
          return;
        }
        setProduct(productData);
      }
        
        
        
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!product) {
      console.log('No specific id found in handle delete');
      return;
    }
    try {
      await axios.delete(`/api/products?_id=${product._id}`);
      router.push('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const goBack = () => {
    router.push('/products');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        {product ? (
          <>
            <h2>Do you really want to delete {product.title}?</h2>
            <div className='mb-2 flex flex-wrap'>
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Product Image ${index + 1}`} 
                    className='w-48 h-48 object-cover rounded-md mr-2 border-2 border-gray-400 mt-2 mb-2'
                  />
                  <Link href={`/products/edit/${product._id}`}>
                    <button className=' bg-red-500 text-white rounded-full p-1 m-2 hover:bg-red-600'>
                      <FaRegTrashCan className='m-1' />
                      </button>
                  </Link>
                </div>
              ))}
            </div>
            <span>
              <button className="btn-primary btn-blue hover:bg-red-600 hover:text-white hover:border-red-600  m-2" onClick={handleDelete}>Yes</button>
              <button className="btn-primary btn-blue" onClick={goBack}>No</button>
            </span>
          </>
        ) : (
          <p>Loading product...</p>
        )}
      </div>
    </Layout>
  );
};

export default DeleteProduct;
