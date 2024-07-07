import axios from "axios";
import React, { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Context/userContext";

const Card = ({ product, setProducts }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleLove = async (id) => {
        try {
            const { data } = await axios.post("/api/v1/product/like/" + id);

            if (data.message == "Liked successfully") {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id == id
                            ? {
                                  ...product,
                                  likedId: [...product.likedId, user.id],
                              }
                            : product
                    )
                );
            } else {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === id
                            ? {
                                  ...product,
                                  likedId: product.likedId.filter(
                                      (userId) => userId !== user.id
                                  ),
                              }
                            : product
                    )
                );
            }

            // Toggle the isLoved state
        } catch (error) {
            console.error("Error while sending like:", error);
        }
    };

    return (
        <div className="relative group max-w-sm rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-all duration-300 mb-6">
            <img
                className="w-full h-96 object-cover rounded-t-lg group-hover:rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                src={product.images[0]}
                alt={product.title || "No image"}
                onClick={() => navigate(`/details/${product.id}`)}
            />
            <div className="p-4 bg-white rounded-b-lg group-hover:bg-gray-50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        {product.title}
                    </h3>
                    {/* Add the LoveButton component here */}
                    <div className="flex gap-3 justify-center items-center">
                        <FaHeart
                            onClick={() => {
                                if (!user?.name) {
                                    toast.error("Login required");
                                }
                                handleLove(product.id);
                            }}
                            fill={
                                product?.likedId?.includes(user?.id)
                                    ? "red"
                                    : "darkslategray"
                            }
                            size={25}
                            style={{ cursor: "pointer" }}
                        />
                        <span className="">
                            {" "}
                            {product.likedId.length == 0
                                ? ""
                                : product.likedId.length}{" "}
                        </span>
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                    {product.description}
                </p>
                <Link
                    to={`/details/${product.id}`}
                    className="button bg-rose-600 hover:bg-rose-500 mt-4 mb-4"
                >
                    See details
                </Link>
            </div>
        </div>
    );
};

export default Card;
