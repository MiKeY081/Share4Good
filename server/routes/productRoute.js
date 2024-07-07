import express from "express";
import {
    createProduct,
    deleteProduct,
    getAProduct,
    getAllProducts,
    getProductOfUser,
    likeAProduct,
    updateProduct,
} from "../controller/productController.js";
import { isSignedIn } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/create", isSignedIn, createProduct);
router.get("/all-products", getAllProducts);
router.get("/all-product-of-user", isSignedIn, getProductOfUser);
router.put("/edit/:id", isSignedIn, updateProduct);
router.post("/like/:id", isSignedIn, likeAProduct);
router.delete("/delete/:id", isSignedIn, deleteProduct);
router.get("/:id", getAProduct);

export { router as productRoute };
