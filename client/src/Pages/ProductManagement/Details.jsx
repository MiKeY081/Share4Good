import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import UserContext from "../../Context/userContext";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const {user} = useContext(UserContext)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/product/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const navigate = useNavigate()
  const handleDonateRequest = async (id) => {
    try {
      const { data } = await axios.post(`/api/v1/order/make-order/${id}`);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong on Donation request");
    }
  };
  const handleProductDelete = async (id)  =>  {
       //handleproductdelete
       try {
        const {data} = await axios.delete(`/api/v1/product/delete/${id}`)
        if(data.success){
          toast.success(data.message)
         navigate("/home")
        }else{
          toast.error(data.error)
        }

       } catch (error) {
        toast.error("Something went wrong")
       }
  }

  if (!product) {
    return <div className="m-h-screen flex justify-center items-center text-6xl font-bold mt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center min-h-[100vh] mt-20">
      <div className="lg:w-1/2 lg:h-3/4 w-3/4 h-1/2 overflow-hidden lg:ml-8 rounded-2xl hover:rounded-2xl">
        {/* Assuming 'images' is an array of image URLs */}
        {product.images && product.images.length > 0 && (
            <Swiper
            className="w-full h-[90vh] text-white mb-20"
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              A11y,
              Autoplay,
              EffectFade,
            ]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            effect="fade"
            autoplay={{ delay: 5000 }}
            loop={true}
          >
            {product?.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
              className="w-full h-full rounded-2xl hover:rounded-3xl transition-all duration-300 object-cover"
              src={image} 
              alt={product.title || "No image"}
            />
              </SwiperSlide>
            ))}
          </Swiper>
          )}
      </div>
      <div className="lg:w-1/2 p-8">
        <h2 className="text-4xl font-bold mb-4 text-center">{product.title}</h2>
        <p className="text-gray-800 text-base mb-6 line-clamp-[20]">
          {product.description}
        </p>
        <div className="grid lg:grid-cols-2 gap-4 mb-6 ">
          <p className="text-gray-700 text-base mb-2 lg:mb-0 lg:mr-4">
            <span className="text-lg font-bold mr-3">Stock:</span>{" "}
            {product.stock}
          </p>
          {/* Add other product details as needed */}
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-6 ">
          <p className="text-gray-700 text-base mb-2 lg:mb-0 lg:mr-4">
            <span className="text-lg font-bold mr-3">Posted At:</span>
            {new Date(product.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {product.category && (
            <p className="text-gray-700 text-base">
              <span className="text-lg font-bold mr-3">Category:</span>{" "}
             <span className="capitalize font-semibold"> {product.category.type}</span>
            </p>
          )}
          <br/>
          {product.user && (
            user.id!=product.userId?<p className="text-gray-700 text-base mb-2 lg:mb-0 lg:mr-4">
              <span className="text-lg font-bold mr-3 ">Posted By:</span>{" "}
              <span className="capitalize" >{product.user.name}</span>
            </p>
            :
            <p className="font-semibold text-lg">You will be donating this product soon</p>
          )}
        </div>
        {user.id!=product.userId?
          <div
            className="button "
            onClick={(e) => handleDonateRequest(product.id)}
          >
            Request this product
          </div>:
          <div className="flex justify-between">
            <Link to={`/updateproduct/${product.id}`} className="button">Update product</Link>
            <span className="button" onClick={()=>handleProductDelete(product.id)}>Delete product</span>
          </div>
        }
      </div>
    </div>
  );
};

export default Details;
