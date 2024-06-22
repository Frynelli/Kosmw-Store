// components/UploadComponent.tsx

import { MdOutlineFileUpload } from "react-icons/md";
import React, { useState } from 'react';
import axios from 'axios';

interface UploadComponentProps {
  onUpload: (imageUrls: string[]) => void;
  setUploadingStatus: (status: boolean) => void;
}
interface UploadedFile {
  fileId: string;
  fileName: string;
  link: string;
}
const UploadComponent = ({ onUpload, setUploadingStatus }: UploadComponentProps) => {
  const [message, setMessage] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // To store image URLs or paths


  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files, "handleUpload fn");
    const files = event.target?.files;
    if (!files || files.length === 0) {
      setMessage('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadingStatus(true);

    const formData = new FormData();
  
    //--Here we map the files so we append the info to formData
    Array.from(files).forEach(file => {
      formData.append('file', file); 
      // console.log(file, 'this is formData from in the loop1');
    });


    //--Here we sent the image data to DB
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Accept':'application/json',
        },
      });
      if (res.data.files && res.data.files.length > 0) {
        
        const uploadedFiles : UploadedFile[] = res.data.files;
        
        //--Links Here
        const links = uploadedFiles.map((file: UploadedFile) => file.link);
        console.log(links,'these are the extracted links');
        setImages(prevImages => [...prevImages, ...links]);
        onUpload([...images,...links]); // Pass the uploaded image URLs
        setMessage('Files uploaded successfully');
      } else {
        setMessage('File uploaded, but no file information returned.');
        onUpload(images);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file.');
       onUpload(images);
    }finally {
      setIsUploading(false);
       setUploadingStatus(false);
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1); // Remove the image at the specified index
    setImages(updatedImages);
    onUpload(updatedImages); // Pass updated images to the parent component
  };

  return (
    <div>
      <label className='cursor-pointer w-24 h-24 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-sm text-gray-600 '>
        <MdOutlineFileUpload />
        <div>Upload</div>
        <input onChange={handleUpload} type="file" multiple name="file" id="file" className="hidden" />
      </label>
      {isUploading && <p>Uploading...</p>}
      {message && <p>{message}</p>}
      <div>
        {images.map((imageUrl, index) => (
          <div key={index} className="flex items-center">
            <img src={imageUrl} alt={`Uploaded ${index + 1}`} className="w-16 h-16 object-cover rounded-md mr-2" />
            <button onClick={() => handleDelete(index)} className="btn btn-sm btn-danger">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadComponent;