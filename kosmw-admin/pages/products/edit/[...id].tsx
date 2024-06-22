import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from '@/components/ProductForm';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    if (!id) {
      console.log('no id found');
      return;
    }

    try {
      const cleanId = Array.isArray(id)? id[0].replace('edit', '') : id.replace('edit', '');
      const res = await axios.get(`/api/products?id=${cleanId}`);
      const productData = res.data.find((product: Product) => product._id === cleanId);
      if (!productData) {
        console.log('Product not found');
        return;
      }

      setProduct(productData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <h1>Edit Product</h1>
      <ProductForm _id={product?._id} {...product} />
    </Layout>
  );
};

export default EditProductPage;
