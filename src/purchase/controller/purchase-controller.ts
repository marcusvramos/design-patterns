import { Request, Response } from 'express';
import { Purchase } from '../entities/purchase';
import { PurchaseModel } from '../model/purchase-model';
import { PaymentMethod, PrismaClient } from '@prisma/client';

export class PurchaseController {
  private purchaseModel: PurchaseModel;
  private prisma: PrismaClient;

  constructor() {
    this.purchaseModel = new PurchaseModel();
    this.prisma = new PrismaClient();
  }

  createPurchase = async (req: Request, res: Response): Promise<Response> => {
    const { userId, paymentMethod, items } = req.body as {
      userId: number;
      paymentMethod: string;
      items: { productId: number; quantity: number }[];
    };

    try {
      if (!userId || !paymentMethod || !items || items.length === 0) {
        return res
          .status(400)
          .json({ error: 'Missing parameters to create purchase' });
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const validPaymentMethods = Object.values(PaymentMethod) as string[];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      let totalPrice = 0;
      const updatedItems = [];
      for (const item of items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          return res
            .status(404)
            .json({ error: `Product with id ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ error: `Insufficient stock for product ${product.name}` });
        }

        if (item.quantity <= 0) {
          return res
            .status(400)
            .json({ error: `Invalid quantity for product ${product.name}` });
        }

        const itemTotalPrice = product.price * item.quantity;
        totalPrice += itemTotalPrice;
        updatedItems.push({ ...item, price: product.price });
      }

      if (totalPrice <= 0) {
        return res.status(400).json({ error: 'Invalid total price' });
      }

      const newPurchase = await this.purchaseModel.createPurchase({
        userId,
        totalPrice,
        paymentMethod: paymentMethod as PaymentMethod,
        items: updatedItems,
      } as Purchase);

      for (const item of items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return res.status(201).json(newPurchase);
    } catch (error) {
      console.error('Error creating purchase:', error);
      return res
        .status(500)
        .json({ error: 'Failed to create purchase', details: error });
    }
  };

  getPurchases = async (req: Request, res: Response): Promise<Response> => {
    try {
      const purchases = await this.purchaseModel.getAllPurchases();
      return res.status(200).json(purchases);
    } catch (error) {
      console.error('Error fetching purchases:', error); // Log detalhado do erro
      return res
        .status(500)
        .json({ error: 'Failed to get purchases', details: error });
    }
  };
}
