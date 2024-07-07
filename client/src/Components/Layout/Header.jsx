import { Avatar } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchContext from "../../Context/SearchContext";
import UserContext from "../../Context/userContext";
import Menu from "../Menu";
import UserMenu from "../UserMenu";
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useContext(UserContext);
    const { search, setSearch } = useContext(SearchContext);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    const navigate = useNavigate();
    return (
        <>
            <div className="flex sticky top-0 z-20 justify-between items-center text-white p-2 bg-slate-800 h-16">
                <Link to="/home" className="headerlink ml-8">
                    Share4Good
                </Link>
                <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Search donated products"
                    className="w-1/4 text-black px-6 py-2 outline-none rounded-2xl"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="hidden md:flex">
                    <ul className="flex gap-16 items-center">
                        <li className="headerlink bottomLine">
                            <Link to="home">Home</Link>
                        </li>
                        <li>
                            <Link to="about" className="headerlink bottomLine">
                                About
                            </Link>
                        </li>
                        <li className="headerlink bottomLine">
                            <Link to="products">Products</Link>
                        </li>
                        <li className="mr-8 headerlink bottomLine">
                            <Link to="contact">Contact</Link>
                        </li>
                        <li className="mr-8 headerlink flex items-center">
                            {user?.name ? (
                                <>
                                    <UserMenu />
                                    <span>{user?.name.split(" ")[0]}</span>
                                </>
                            ) : (
                                <div onClick={() => navigate("/user/login")}>
                                    <Avatar></Avatar>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white text-2xl focus:outline-none"
                    >
                        &#9776;
                    </button>
                </div>

                {/* Mobile Menu */}
                <Menu isOpen={isMenuOpen} onClose={closeMenu} />
            </div>
        </>
    );
}

export default Header;
