import React, { useContext } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RiMailLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../../Context/userContext";

export default function UserProfile() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    return user?.name ? (
        <div className="p-8 min-h-screen">
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white rounded-lg shadow-lg p-8 mx-4 sm:w-3/4 md:w-3/4 lg:w-1/2">
                    <div className="text-center">
                        <h4 className="text-4xl font-bold mb-4">Profile</h4>
                    </div>

                    <div className="flex justify-center py-4">
                        <img
                            src={user?.profileImage}
                            className="w-40 h-40 rounded-full shadow-md"
                            alt="avatar"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border p-4 rounded-md flex gap-4 font-bold">
                            <div className="text-lg font-bold mb-2">
                                <MdAccountCircle className="inline-block mr-2" />
                                Name
                            </div>
                            <div className="text-gray-700 text-xl mb-2 capitalize">
                                {user?.name}
                            </div>
                        </div>

                        <div className="border p-4 rounded-md flex gap-4 font-bold">
                            <div className="text-lg font-bold mb-2">
                                <AiOutlinePhone className="inline-block mr-2" />
                                Mobile
                            </div>
                            <div className="text-gray-700 text-xl mb-2">
                                {user?.phone}
                            </div>
                        </div>

                        <div className="border p-4 rounded-md flex gap-4 font-bold col-span-2">
                            <div className="text-lg font-bold mb-2">
                                <RiMailLine className="inline-block mr-2" />
                                Email
                            </div>
                            <div className="text-gray-700 text-xl mb-2">
                                {user?.email}
                            </div>
                        </div>

                        <div className="border p-4 rounded-md flex gap-4 font-bold col-span-2">
                            <div className="text-lg font-bold mb-2">
                                Address
                            </div>
                            <div className="text-gray-700 text-xl mb-2 capitalize">
                                {user?.address}
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button
                                className="button"
                                onClick={(e) => {
                                    navigate("/user/updateuser");
                                }}
                            >
                                <FaEdit className="mr-2" />
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <>
            {toast.error("You need to login")}
            <Navigate to={"/"} />
        </>
    );
}
