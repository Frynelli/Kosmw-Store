// import React, { useEffect, useState } from 'react';
// import { FaRegTrashAlt } from 'react-icons/fa';

// interface ProductGalleryProps {
//   images: string[];
//   onSelect: (image: string) => void;
//   onDelete: (images:string[]) => void;
// }

// const ProductGallery: React.FC<ProductGalleryProps> = ({ images, onSelect, onDelete }) => {
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [remainingImages, setRemainingImages] = useState<string[]>([]);
//   //console.log(selectedImages,'These are the selected Images')
//   //console.log(images,'Images in ProductGallery ')

//   useEffect(() => {
//     setRemainingImages(images);
//   }, [images]);

//   const handleSelectImage = (image: string) => {
//     if (selectedImages.includes(image)) {
//       setSelectedImages(selectedImages.filter(img => img !== image));
//     } else {
//       setSelectedImages([...selectedImages, image]);
//     }
//     //console.log(image,'this is in the handle select image')
//     onSelect(image);
//   };

 
  
//   const handleDeleteSelected = () => {
//     if (selectedImages.length > 0) {
//       onDelete(selectedImages);
//       //console.log(selectedImages,'from the deleteselected IMPORTANT')
//       const updatedRemainingImages = remainingImages.filter(img => !selectedImages.includes(img));
//       setRemainingImages(updatedRemainingImages);
//       setSelectedImages([]); // Reset selected images after deletion
//     }
//   };

//   return (
//     <div className="product-gallery justify-between flex flex-wrap flex-row items-center">
//       <span className="flex flex-wrap flex-row">
//       {images.length === 0 ? (
//         <p>No images available.</p>
//       ) : (
//         <>
//       {images.map((image, index) => (
//         <div key={index}>
//           <img 
//           src={image} 
//           alt={`Product Image ${index}`} 
//           className="w-40 max-h-40 object-cover rounded-md border-2 border-gray-400 overflow-scroll m-2" />
//           <input
//             type="checkbox"
            
//             checked={selectedImages.includes(image)}
//             onChange={() => handleSelectImage(image)}
//           />
//         </div>
//       ))}</>)}
//       </span>
//       <button 
//       className='h-fit-content btn-peach btn-primary inline-flex items-center mr-4' 
//       onClick={handleDeleteSelected} 
//       disabled={selectedImages.length === 0}>
//         <FaRegTrashAlt />
//       </button>
//     </div>
//   );
// };

// export default ProductGallery;

import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

interface ProductGalleryProps {
  images: string[];
  onSelect: (image: string) => void;
  onDelete: (images:string[]) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, onSelect, onDelete }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [remainingImages, setRemainingImages] = useState<string[]>(images);
  //console.log(selectedImages,'These are the selected Images')
  //console.log(images,'Images in ProductGallery ')

  useEffect(() => {
    setRemainingImages(images);
  }, [images]);

  const handleSelectImage = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
    //console.log(image,'this is in the handle select image')
    onSelect(image);
  };

 
  
  const handleDeleteSelected = () => {
    if (selectedImages.length > 0) {
      onDelete(selectedImages);
      //console.log(selectedImages,'from the deleteselected IMPORTANT')
      const updatedRemainingImages = remainingImages.filter(img => !selectedImages.includes(img));
      setRemainingImages(updatedRemainingImages);
      setSelectedImages([]); // Reset selected images after deletion
    }
  };

  return (
    <div className="product-gallery justify-between flex flex-wrap flex-row items-center">
      <span className="flex flex-wrap flex-row">
      {remainingImages.length === 0 ? (
        <p>No images available.</p>
      ) : (
        <>
      {remainingImages.map((image, index) => (
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
