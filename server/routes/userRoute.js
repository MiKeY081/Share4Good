import express from "express";
import {
    createUser,
    updateUser,
    userLogin,
    userLogout,
    userProfile,
} from "../controller/userController.js";
import { isSignedIn } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", userLogin);
router.get("/profile", isSignedIn, userProfile);
router.put("/update", isSignedIn, updateUser);
router.post("/logout", isSignedIn, userLogout);

export { router as userRoute };
