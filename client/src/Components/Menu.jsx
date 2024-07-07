import Avatar from "@mui/material/Avatar";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../Context/userContext";

const Menu = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-80 z-50 ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="flex justify-end p-4">
                <button
                    onClick={onClose}
                    className="text-white text-2xl focus:outline-none"
                >
                    &times;
                </button>
            </div>
            <ul className="flex flex-col items-center">
                <li className="mb-4">
                    <Link
                        to="main"
                        smooth
                        onClick={onClose}
                        className="headerlink bottomLine"
                    >
                        Home
                    </Link>
                </li>
                <li className="mb-4">
                    <Link
                        to="about"
                        smooth
                        onClick={onClose}
                        className="headerlink bottomLine"
                    >
                        About
                    </Link>
                </li>
                <li className="mb-4">
                    <Link
                        to="products"
                        smooth
                        onClick={onClose}
                        className="headerlink bottomLine"
                    >
                        Products
                    </Link>
                </li>
                <li>
                    <Link
                        to="contact"
                        smooth
                        onClick={onClose}
                        className="headerlink bottomLine"
                    >
                        Contact
                    </Link>
                </li>
                <li>
                    <Link
                        to="user/login"
                        smooth
                        onClick={onClose}
                        className="headerlink flex items-center"
                    >
                        <Avatar></Avatar>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
