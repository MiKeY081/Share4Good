import axios from "axios";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../../Context/userContext";
import { app } from "../../config/firebase";

const ProductForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axios.get(
                    "api/v1/category/all-category"
                );
                setCategories(data.categories);
            } catch (error) {
                toast.error("Something went wrong");
            }
        };
        getCategories();
    }, []);
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/create", {
                title,
                description,
                images,
                categoryId,
                stock,
            });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            navigate("/");
        }
    };
    const handleImageUpload = async (e) => {
        setIsLoading(true);
        try {
            toast.success("Uploading...");
            for (let i = 0; i < e.target.files.length; i++) {
                console.log(i);
                const image = e.target.files[i];
                const storage = getStorage(app);
                const fileName = new Date().getTime() + image.name;
                const storageRef = ref(storage, fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                // Listen for state changes (including errors)
                uploadTask.on("state_changed", (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    console.log("prgress is", progress);

                    if (snapshot.error) {
                        console.error(snapshot.error.message);
                        toast.error("Image upload failed. Try again");
                    }
                });

                // Wait for the upload to complete before getting the URL
                await uploadTask;

                // Now it's safe to call getDownloadURL
                const imageUrl = await getDownloadURL(storageRef);

                // Update image list with new URL
                setImages((prev) => [...prev, imageUrl]);
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            console.error(error.message);
            toast.error("Image upload failed. Try again");
        } finally {
            setIsLoading(false);
        }
    };

    return user?.name ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full">
            <div className="w-1/2 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Add Product
                </h2>
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
                    <p className="text-2xl font-bold mb-3">Category</p>
                    {categories?.map((category) => (
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="category"
                                    id=""
                                    value={category.id}
                                    onChange={() => setCategoryId(category.id)}
                                />
                                <span className="ml-4 font-bold capitalize ">
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
                        type="number"
                        id="stock"
                        name="stock"
                        min={1}
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
                        className="button bg-rose-600 hover:bg-rose-500"
                    >
                        Add this Product
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <>
            {toast.error("You need to login")}
            <Navigate to={"/"} />
        </>
    );
};

export default ProductForm;
