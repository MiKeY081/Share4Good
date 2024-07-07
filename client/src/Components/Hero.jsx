import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
    A11y,
    Autoplay,
    EffectFade,
    Navigation,
    Pagination,
    Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { publicImages } from "../../public/ImageGrabber";
import UserContext from "../Context/userContext";

const SwiperTry = () => {
    const publicImage = publicImages;
    const { user } = useContext(UserContext);
    return (
        <>
            {publicImage && (
                <Swiper
                    className="w-full h-[90vh] bg-black text-white mb-20 cursor-grab"
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
                    autoplay={{ delay: 3000 }}
                    loop={true}
                >
                    {publicImage?.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image}
                                className="object-cover w-full h-full"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            <div className="flex justify-center items-center relative -top-52 gap-32">
                <Link to={"/product/productform"} className="button shadow-2xl">
                    <button
                        className="w-full"
                        onClick={() => {
                            !user?.name &&
                                toast.error("You need to login to donate");
                        }}
                    >
                        Donate now
                    </button>
                </Link>
                <Link to={"/products"} className="button shadow-2xl">
                    Take a tour
                </Link>
            </div>
        </>
    );
};

export default SwiperTry;
