import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../../Components/Card";
import SearchContext from "../../Context/SearchContext";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {search, setSearch} = useContext(SearchContext)

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "/api/v1/product/all-products"
                );
                setProducts(response.data.products);
            } catch (error) {
                setError("Something went wrong");
                toast.error("Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const searchProducts = products.filter((product) => {
        return (
            product.title.toLowerCase().includes(search.toLowerCase()) || 
            product.category.type.toLowerCase().includes(search.toLowerCase())
        );
    });
    

    return (
        search?
        <div className="p-8 min-h-screen min-w-screen">
        <h1 className="text-4xl font-bold mb-20">Products Found</h1>
        <div>
            {isLoading ? ( <div className="m-h-screen flex justify-center items-center text-6xl font-bold mt-20">Loading searched products...</div>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchProducts?.map((product, index) => (
                        <Card
                            key={product.id}
                            product={product}
                            setProducts={setProducts}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>:
        <div className="p-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-20">Available Products</h1>
            <div>
                {isLoading ? (
                    <p className="text-center">Loading products...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products?.map((product, index) => (
                            <Card
                                key={product.id}
                                product={product}
                                setProducts={setProducts}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
