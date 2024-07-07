import React, { useContext } from "react";
import Header from "../Components/Layout/Header";
import About from "./About";
import Products from "./ProductManagement/Products";
import ContactUs from "./ContactUs";
import Hero from "../Components/Hero";
import SearchContext from "../Context/SearchContext";

const Home = () => {
  const { search } = useContext(SearchContext);
  return !search ? (
    <div>
      <Hero />
      <Products />
    </div>
  ) : (
    <div>
      <Products />
    </div>
  );
};

export default Home;
