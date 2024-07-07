import { prisma } from "../config/prismaConfig.js";

export const createProduct = async (req, res) => {
    try {
        console.log(req);
        const { user } = req;

        console.log(user);

        const { title, description, images, stock, categoryId } = req.body;

        console.log(
            "tittle",
            title,
            "\ndescritiop",
            description,
            "\nimages",
            images,
            "\nstock",
            stock,
            "\ncategory",
            categoryId
        );

        const product = await prisma.product.create({
            data: {
                title,
                description,
                images,
                stock,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
            },
        });
        return res.send({
            success: true,
            message: "created product ",
            product,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
            },
        });

        res.status(200).send({ products: allProducts });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getAProduct = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                user: true,
                category: true,
            },
        });

        console.log(product);

        return res.status(200).send({ product });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { title, description, images, category, stock } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                title,
                description,
                images,
                category,
                stock,
            },
        });

        return res.status(200).send({
            success: true,
            message: "Product updated successfully",
            updatedProduct,
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

export const likeAProduct = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id } });

        const alreadyLikedIndex = product.likedId.findIndex(
            (userId) => userId === user.id
        );

        if (alreadyLikedIndex === -1) {
            // If not already liked, add the user to the likedId array
            await prisma.product.update({
                where: { id },
                data: {
                    likedId: {
                        push: user.id,
                    },
                },
            });

            res.status(200).send({
                message: "Liked successfully",
                product,
            });
        } else {
            // If already liked, remove the user from the likedId array
            await prisma.product.update({
                where: { id },
                data: {
                    likedId: {
                        set: product.likedId.filter(
                            (userId) => userId !== user.id
                        ),
                    },
                },
            });

            res.status(200).send({
                message: "Unlike successfully",
                product,
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

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.delete({ where: { id } });

        return res.status(200).send({
            success: true,
            message: "Product delete successfuly",
            product,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getProductOfUser = async (req, res) => {
    try {
        const { user } = req;

        const allProducts = await prisma.product.findMany({
            where: { userId: user.id },
        });

        res.status(200).send({
            products: allProducts,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
