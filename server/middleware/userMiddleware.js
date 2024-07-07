import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig.js";

export const isSignedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(400).send({ message: "not signed in" });

        const { id } = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id },
        });

        delete user.password;

        req.user = user;

        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
