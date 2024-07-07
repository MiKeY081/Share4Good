import express from "express";
import {
    comfirmOrder,
    getOrdersofUser,
    makeOrder,
    rejectOrder,
} from "../controller/orderController.js";
import { isSignedIn } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/make-order/:id", isSignedIn, makeOrder);
router.get("/user-orders", isSignedIn, getOrdersofUser);
router.post("/confirm/:orderId", isSignedIn, comfirmOrder);
router.post("/reject/:orderId", isSignedIn, rejectOrder);

export { router as orderRoute };
