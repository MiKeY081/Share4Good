import { prisma } from "../config/prismaConfig.js";

export const createCategory = async (req, res) => {
    try {
        const { type } = req.body;

        const categoryExist = await prisma.category.findFirst({
            where: { type: type.toLowerCase() },
        });

        if (!categoryExist) {
            const newCategory = await prisma.category.create({
                data: {
                    type: type.toLowerCase(),
                },
            });

            return res.status(201).send({
                success: true,
                message: "New category added",
                type: newCategory,
            });
        } else {
            return res.status(200).send({
                success: false,
                message: "Category already exist",
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getAllCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({});
        return res.status(200).send({ categories });
    } catch (error) {
        console.log(error.messsage);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
