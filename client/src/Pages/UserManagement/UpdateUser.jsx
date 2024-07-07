import React, { useState, useContext } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { RiMailLine } from 'react-icons/ri';
import { AiOutlinePhone } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../config/firebase";

export default function UpdateUser() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [editedUser, setEditedUser] = useState({ ...user });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    setIsLoading(true);
    try {
      toast.success("Uploading...");
        const image = e.target.files[0];
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on("state_changed", (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(progress)

          if (snapshot.error) {
            console.error(snapshot.error.message);
            toast.error("Image upload failed. Try again");
          }
        });

        await uploadTask;

        const imageUrl = await getDownloadURL(storageRef);

        setEditedUser((prevUser) => ({ ...prevUser, profileImage: imageUrl }));
        toast.success("Image uploaded successfully");
      } catch (error) {
      console.error(error.message);
      toast.error("Image upload failed. Try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put("/api/v1/user/update", editedUser);
      if (data.success) {
        setUser(editedUser);
        toast.success(data.message);
        navigate('/userprofile');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate('/userprofile');
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 mx-4 sm:w-3/4 md:w-3/4 lg:w-1/2">
        <div className="text-center">
          <h4 className="text-4xl font-bold mb-4">Edit Profile</h4>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-6">
          <label htmlFor="image-upload" className="relative cursor-pointer">
            <img
              src={image || editedUser?.profileImage || 'placeholder-image-url'}
              alt="avatar"
              className="w-40 h-40 rounded-full shadow-md"
            />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={(e)=>{handleImageUpload(e)}}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-md flex flex-col gap-4">
            <label className="text-lg font-bold">
              <MdAccountCircle className="inline-block mr-2" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editedUser?.name || ''}
              onChange={(e)=>{handleChange(e)}}
              className="text-gray-700 text-xl capitalize"
            />
          </div>

          <div className="border p-4 rounded-md flex flex-col gap-4">
            <label className="text-lg font-bold">
              <AiOutlinePhone className="inline-block mr-2" />
              Mobile
            </label>
            <input
              type="text"
              name="phone"
              value={editedUser?.phone || ''}
              onChange={(e)=>{handleChange(e)}}
              className="text-gray-700 text-xl"
            />
          </div>

          <div className="border p-4 rounded-md flex flex-col gap-4 col-span-2">
            <label className="text-lg font-bold">
              <RiMailLine className="inline-block mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={editedUser?.email || ''}
              onChange={(e)=>{handleChange(e)}}
              className="text-gray-700 text-xl"
            />
          </div>

          <div className="border p-4 rounded-md flex flex-col gap-4 col-span-2">
            <label className="text-lg font-bold">Address</label>
            <input
              type="text"
              name="address"
              value={editedUser?.address || ''}
              onChange={(e)=>{handleChange(e)}}
              className="text-gray-700 text-xl capitalize"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={()=>handleCancel()}
              className="button bg-rose-600 hover:bg-rose-500"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button
              onClick={()=>handleSave()}
              className="button bg-green-500 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FaSave className="mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
