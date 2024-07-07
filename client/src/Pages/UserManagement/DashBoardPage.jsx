import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Card from "../../Components/Card";
import UserContext from "../../Context/userContext";

const DashBoardPage = () => {
    const [userProduct, setUserProduct] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const getListing = async () => {
            try {
                const { data } = await axios.get(
                    "/api/v1/product/all-product-of-user"
                );
                setUserProduct(data.products);
            } catch (error) {
                console.error("Error fetching user products:", error.message);
            }
        };

        getListing();
    }, []);

    return user?.name ? (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto ">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    Dashboard
                </h2>
                <h3 className="text-xl font-bold mb-2">My Listings</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {userProduct?.map((product, index) => (
                        <Card key={index} product={product} />
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

export default DashBoardPage;
