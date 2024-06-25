import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

interface ProductGalleryProps {
  images: string[];
  onSelect: (image: string) => void;
  onDelete: (index: number) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, onSelect, onDelete }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
console.log(selectedImages,'These are the selected Images')
console.log(images,'Images in ProductGallery ')


  const handleSelectImage = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
    onSelect(image);
  };

  const handleDeleteSelected = () => {
    // Loop through selectedImages and call onDelete for each index
    selectedImages.forEach((image) => {
      const index = images.findIndex((img) => img === image);
      if (index !== -1) {
        //console.log(index,'This is the index HandleDelete/ProductGallery ')
        onDelete(index);
      }
    });
    setSelectedImages([]);
  };
  // const handleDeleteSelected = () => {
  //   selectedImages.forEach((image) => {
  //     // Assuming images have unique IDs or URLs
  //     const newImages = images.filter(img => img !== image);
      
  //     console.log(newImages,'new Images handleDelete ProductGallery');
    
  //     onDelete(newImages.indexOf(image));
  //   });
  //   //setSelectedImages([]);
  // };
  

  return (
    <div className="product-gallery justify-between flex flex-wrap flex-row items-center">
      <span className="flex flex-wrap flex-row">
      {images.length === 0 ? (
        <p>No images available.</p>
      ) : (
        <>
      {images.map((image, index) => (
        <div key={index}>
          <img 
          src={image} 
          alt={`Product Image ${index}`} 
          className="w-40 max-h-40 object-cover rounded-md border-2 border-gray-400 overflow-scroll m-2" />
          <input
            type="checkbox"
            
            checked={selectedImages.includes(image)}
            onChange={() => handleSelectImage(image)}
          />
        </div>
      ))}</>)}
      </span>
      <button 
      className='h-fit-content btn-peach btn-primary inline-flex items-center mr-4' 
      onClick={handleDeleteSelected} 
      disabled={selectedImages.length === 0}>
        <FaRegTrashAlt />
      </button>
    </div>
  );
};

export default ProductGallery;
