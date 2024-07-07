import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';import { app } from '../../config/firebase';

const UpdateProduct = () => {
  const [product, setProduct] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('');
  const [categories, setCategories] = useState([]); // Fix typo in state name
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/product/${id}`);
        const fetchedProduct = response.data.product;

        // Set the state with the fetched product details
        setTitle(fetchedProduct.title);
        setDescription(fetchedProduct.description);
        setImages(fetchedProduct.images);
        setCategoryId(fetchedProduct.categoryId);
        setStock(fetchedProduct.stock);
        setCategories([fetchedProduct.category]); // Assuming category is an object
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.put(`/api/v1/product/edit/${id}`, {
        title,
        description,
        images,
        categoryId,
        stock,
      });
      if (data.success) {
        // Assuming you have a toast notification library
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      // Redirect to the home page after updating
      navigate('/');
    }
  };

  const handleImageUpload = async (e) => {
    setIsLoading(true);
    try {
      toast.success('Uploading...');
      for (let i = 0; i < e.target.files.length; i++) {
        console.log(i);
        const image = e.target.files[i];
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        // Listen for state changes (including errors)
        uploadTask.on('state_changed', (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          console.log('progress is', progress);

          if (snapshot.error) {
            console.error(snapshot.error.message);
            toast.error('Image upload failed. Try again');
          }
        });

        // Wait for the upload to complete before getting the URL
        await uploadTask;

        // Now it's safe to call getDownloadURL
        const imageUrl = await getDownloadURL(storageRef);

        // Update image list with new URL
        setImages((prev) => [...prev, imageUrl]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Image upload failed. Try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-1/2 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-800"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter the product title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 hover:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-800"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter the product description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 hover:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="images"
            className="block mb-2 text-sm font-medium text-gray-800"
          >
            Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 hover:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-800"
          >
            Category
          </label>
          {categories.map((category) => (
            <div key={category.id}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={categoryId === category.id}
                  onChange={() => setCategoryId(category.id)}
                />
                <span className="ml-4 font-bold capitalize">
                  {category.type}
                </span>
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-gray-800"
          >
            Stock
          </label>
          <input
            type="text"
            id="stock"
            name="stock"
            placeholder="Enter the stock quantity"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 hover:border-blue-500"
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
