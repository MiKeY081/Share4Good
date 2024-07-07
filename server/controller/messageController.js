import { prisma } from "../config/prismaConfig.js";

export const createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newMessage = await prisma.message.create({
            data: {
                name,
                email,
                message,
            },
        });

        return res.status(201).send({
            success: true,
            message: "Message sent successfully",
            message: newMessage,
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
