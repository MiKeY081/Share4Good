import { prisma } from "../config/prismaConfig.js";
import { mailTransport } from "../utils/nodemailer.js";

export const makeOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                user: true,
                category: true,
            },
        });

        const mail = {
            from: {
                name: "Share4Good",
                address: "share4good12@gmail.com",
            },
            to: product?.user?.email,
            subject: "Request for donation",
            html: `
                    <p>Hey [${product.user.name}],</p>
                    <p>Just wanted to drop you a quick note to say that your recent donations have been requested by ${user?.name}.</p>
                    <p>If you have any questions or would like to learn more about how your donations are being utilized, please feel free to reach out. We're always here to provide you with updates and information.</p>
                    <p>
                        For more information contact the following user who has requested for your donation
                    </p>
                    <p>
                        Name: ${user.name} <br/>
                        Email: ${user.email} <br/>
                        Phone: ${user.phone}<br/>
                        Address: ${user.address}<br/>
                    </p>
                    <p>Your one donation can make someone's life better.</p>
                    <p>
                        Best regards, <br/>
                        Share4Good <br/>
                    </p>
            `,
        };
        const response = await mailTransport.sendMail(mail);

        if (response.error) {
            return res.status(500).send({
                success: false,
                message: "Failed to place order",
            });
        }

        const order = await prisma.order.create({
            data: {
                owner: product.user.id,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                product: {
                    connect: {
                        id: product.id,
                    },
                },
            },
        });

        return res.status(201).send({
            success: true,
            message: "Your requested has been submitted",
            order,
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

export const comfirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "ACCEPTED",
            },
        });

        await prisma.product.delete({
            where: { id: order.productId },
        });

        return res.status(200).send({
            success: true,
            message: "Request accepted",
            updatedOrder,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: true,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const rejectOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "REJECTED",
            },
        });

        return res.status(200).send({
            success: true,
            message: "Request rejected",
            updatedOrder,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: true,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getOrdersofUser = async (req, res) => {
    try {
        const { user } = req;

        const orders = await prisma.order.findMany({
            where: {
                owner: user.id,
                status: "PENDING",
            },
            include: {
                user: true,
                product: true,
            },
        });

        res.status(200).send({
            orders,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: true,
            message: "Internal server error",
            error: error.message,
        });
    }
};
