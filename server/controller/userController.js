import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaConfig.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExist = await prisma.user.findUnique({ where: { email } });

        if (!userExist) {
            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.status(201).send({
                success: true,
                message: "User Registered successfully",
                user,
            });
        } else {
            res.status(200).send({
                success: false,
                message: "User already registered",
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const passwordMatch = await comparePassword(
                password,
                user.password
            );

            if (passwordMatch) {
                const token = await jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                delete user.password;

                return res
                    .status(200)
                    .cookie("token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    })
                    .send({
                        success: true,
                        message: "Login successful",
                        user,
                    });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Invalid credentials",
                });
            }
        } else {
            res.status(200).send({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const userProfile = async (req, res) => {
    try {
        const { user } = req;

        res.status(200).send({
            user,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.user;

        const { name, profileImage, phone, address, points } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                profileImage,
                phone,
                address,
                points,
            },
        });

        return res.status(200).send({
            success: true,
            message: "Successfully updated",
            updatedUser,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const userLogout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "").send({
            success: true,
            message: "Logout successfully",
            user: {},
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
