import { Request, Response } from 'express';
import { Purchase } from '../entities/purchase';
import { PurchaseModel } from '../model/purchase-model';
import { PrismaClient } from '@prisma/client';

export class PurchaseController {
  private purchaseModel: PurchaseModel;
  private prisma: PrismaClient;

  constructor() {
    this.purchaseModel = new PurchaseModel();
    this.prisma = new PrismaClient();
  }

  createPurchase = async (req: Request, res: Response): Promise<Response> => {
    const { userId, totalPrice, paymentMethod, items } = req.body as Purchase;

    try {
      if (!userId || !totalPrice || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing parameters to create purchase' });
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const validPaymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH', 'BILLET'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      for (const item of items) {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          return res.status(404).json({ error: `Product with id ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        }

        if (item.quantity <= 0 || item.price < 0) {
          return res.status(400).json({ error: `Invalid quantity or price for product ${product.name}` });
        }
      }

      if (totalPrice <= 0) {
        return res.status(400).json({ error: 'Invalid total price' });
      }

      const newPurchase = await this.purchaseModel.createPurchase({
        userId,
        totalPrice,
        paymentMethod,
        items,
      } as Purchase);

      for (const item of items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return res.status(201).json(newPurchase); // Retornando a resposta
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create purchase' }); // Retornando a resposta em caso de erro
    }
  };

  getPurchases = async (req: Request, res: Response): Promise<Response> => { // Alterado para retornar Response
    try {
      const purchases = await this.purchaseModel.getAllPurchases();
      return res.status(200).json(purchases); // Retornando a resposta
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get purchases' }); // Retornando a resposta em caso de erro
    }
  };
}
