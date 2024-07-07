import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Context/userContext";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const getNotifications = async () => {
            const { data } = await axios.get("/api/v1/order/user-orders");
            setNotifications(data.orders);
        };

        getNotifications();
    }, []);

    const handleReject = async (id) => {
        try {
            await axios.post(`/api/v1/order/reject/${id}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const handleAccept = async (id) => {
        try {
            await axios.post(`/api/v1/order/confirm/${id}`);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return user?.name ? (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>
                <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                    {notifications?.map((notification, i) => (
                        <div
                            key={i}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            <p className="text-gray-800">
                                {notification.user.name} has requested for{" "}
                                {notification.product.title} product.
                            </p>
                            <div className="flex items-center gap-3 justify-end mt-3">
                                <button
                                    className="flex items-center gap-2 text-red-500"
                                    onClick={() =>
                                        handleReject(notification.id)
                                    }
                                >
                                    <ImCross size={18} />
                                    Reject
                                </button>
                                <button
                                    className="flex items-center gap-2 text-green-500"
                                    onClick={() =>
                                        handleAccept(notification.id)
                                    }
                                >
                                    <FaCheck size={18} />
                                    Accept
                                </button>
                            </div>
                        </div>
                    ))}
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

export default NotificationPage;
