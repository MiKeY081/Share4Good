import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import DashBoardPage from "./Pages/UserManagement/DashBoardPage";
import Home from "./Pages/Home";
import NotificationPage from "./Pages/NotificationPage";
import Details from "./Pages/ProductManagement/Details";
import ProductForm from "./Pages/ProductManagement/ProductForm";
import Products from "./Pages/ProductManagement/Products";
import Login from "./Pages/UserManagement/Login";
import Register from "./Pages/UserManagement/Register";
import UserProfile from "./Pages/UserManagement/UserProfile";
import UpdateUser from "./Pages/UserManagement/UpdateUser";
import UpdateProduct from "./Pages/ProductManagement/UpdateProduct";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<Products />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/userprofile' element={<UserProfile />} />
          <Route path='/user/login' element={<Login />} />
          <Route path='/user/register' element={<Register />} />
          <Route path='/product/productform' element={<ProductForm />} />
          <Route path='/updateproduct/:id' element={<UpdateProduct />} />
          <Route path='/details/:id' element={<Details />} />
          <Route path='/user/dashboard' element={<DashBoardPage />} />
          <Route path='/user/notification' element={<NotificationPage />} />
          <Route path='/user/updateuser' element={<UpdateUser />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
