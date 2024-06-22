// pages/products.tsx
//product page
//add new product
//edit product
//delete product
//delete bulk

import Layout from '@/components/Layout';
import Link from "next/link";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from 'next/router';


const Products = () => {
const router = useRouter();
const[product,setProduct]=useState([]);
const [selectedProducts, setSelectedProducts] = useState(new Set()); 
const [loading, setLoading] = useState(false);
// console.log(Array.from(selectedProducts), 'Selected Products');

useEffect(()=>{
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/products');
      setProduct(res.data);
    }catch (error) {
      console.error('Error creating product:', error);
    }
  };
  fetchData();
},[])

//Select each one product fn
const handleSelectProduct = (productId) => {
  setSelectedProducts((prevSelected) => {
    const newSelected = new Set(prevSelected);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    return newSelected;
  });
};

//Select all products fn
const handleSelectAll = () => {
  if (selectedProducts.size === product.length) {
    setSelectedProducts(new Set());
  } else {
    const allProductIds = new Set(product.map(product => product._id));
    setSelectedProducts(allProductIds);
  }
};

//Delete bulk fn
const handleBulkDelete = async () => {
  setLoading(true);
  const productIdsArray = Array.from(selectedProducts);
  if (!window.confirm('Are you sure you want to delete the selected products?')) return;
  try {
    const { data } = await axios.post('/api/bulk-delete', { productIds: productIdsArray });
    setProduct(product.filter(p => !selectedProducts.has(p._id)));
    setSelectedProducts(new Set());
    router.push('/products');
  } catch (error) {
    console.error('Error during bulk delete:', error.response ? error.response.data : error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <Layout>
      <h1>Products</h1>
      <Link href="/products/new" className="btn-primary btn-peach">
        <span>Add New Product</span>
      </Link>
      {product.length === 0 ? (
                <div className="mt-5 text-center">
                    <h2>No products yet. Add your first product!</h2>
                </div>
            ):(<span> <div className="flex items-center justify-end mt-5">
              {/* Select All / Diselect All */}
            <button onClick={handleSelectAll} className="btn-primary btn-peach mr-2">
              {selectedProducts.size === product.length ? 'Deselect All' : 'Select All'}
            </button>
            {/* Delete Bulk Btn */}
            <button onClick={handleBulkDelete} className="btn-primary btn-peach inline-flex items-center " disabled={selectedProducts.size === 0}>
            <FaRegTrashCan className='m-2' />
            </button>
          </div>
      <ul className="mt-5">
      {product.map((product) => (
          <li className='border hover:border-customSungloDark  p-2 m-1 flex' key={product._id}>
            {/* Checkbox below */}
           <input
              type="checkbox"
              checked={selectedProducts.has(product._id)}
              onChange={() => handleSelectProduct(product._id)}
              className="m-2 w-auto"
            />
           <div className='flex justify-between w-full'>
            <div className='box-1'>
            <Link href={`/products/${product._id}`}>
              <h2 className='text-xl mb-4 text-customSungloDark capitalize'>{product.title}</h2>
            </Link>
             
            <div className="flex space-x-2">
            {(product.images || []).map((image, index) => (
                        <img key={index} src={image} alt={product.title} className="w-40 h-40 object-cover rounded-md border-2" />
                      ))}
                      </div>
            <p className='text-gray-400 mt-4 capitalize'>{product.description}</p>
            <p className='text-gray-700 italic'>Price: {product.price}€</p>
            </div>
            {/* HERE the BTN Edit/Delete */}
            <div className='box-2 mr-5 flex items-start '>
            <Link className='btn-primary btn-peach inline-flex items-center mr-2 ' href={`/products/edit/${product._id}`}>
                <MdEdit className='m-2' /> 
                </Link>
                {/* <Link className='btn-primary btn-peach inline-flex items-center ' href={`/products/delete/${product._id}`}>
                <FaRegTrashCan className='m-2' /> 
                </Link> */}
                </div>
                </div>
          </li>
        ))}
      </ul>
      
      </span> 
    )}
    </Layout>
  );
}

export default Products;




