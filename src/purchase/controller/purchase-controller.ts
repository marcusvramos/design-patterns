// src/controller/purchase-controller.ts
import { Request, Response } from 'express';
import { Purchase } from '../entities/purchase';
import { PurchaseModel } from '../model/purchase-model';
import { PaymentMethod } from '@prisma/client';

export class PurchaseController {
  private purchaseModel: PurchaseModel;

  constructor() {
    this.purchaseModel = new PurchaseModel();
  }

  createPurchase = async (req: Request, res: Response): Promise<Response> => {
    const { userId, paymentMethod, items } = req.body as {
      userId: number;
      paymentMethod: string;
      items: { productId: number; quantity: number }[];
    };

    try {
      const validationError = await this.validatePurchaseInput(userId, paymentMethod, items);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }
      
      const { totalPrice, updatedItems, validationError: itemError } = await this.processItems(items);
      if (itemError) {
        return res.status(400).json({ error: itemError });
      }

      const newPurchase = await this.purchaseModel.createPurchase({
        userId,
        totalPrice,
        paymentMethod: paymentMethod as PaymentMethod,
        items: updatedItems,
      } as Purchase);
      await this.updateProductStocks(items);

      return res.status(201).json(newPurchase);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create purchase', details: error });
    }
  };

  getPurchases = async (req: Request, res: Response): Promise<Response> => {
    try {
      const purchases = await this.purchaseModel.getAllPurchases();
      return res.status(200).json(purchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return res.status(500).json({ error: 'Failed to get purchases', details: error });
    }
  };

  private async validatePurchaseInput(userId: number, paymentMethod: string, items: { productId: number; quantity: number }[]): Promise<string | null> {
    if (!userId || !paymentMethod || !items || items.length === 0) {
      return 'Missing parameters to create purchase';
    }

    const user = await this.purchaseModel.getUserById(userId);
    if (!user) {
      return 'User not found';
    }

    const isValidPaymentMethod = await this.purchaseModel.validatePaymentMethod(paymentMethod);
    if (!isValidPaymentMethod) {
      return 'Invalid payment method';
    }

    return null;
  }

  private async processItems(items: { productId: number; quantity: number }[]): Promise<{ totalPrice: number; updatedItems: any[]; validationError?: string }> {
    let totalPrice = 0;
    const updatedItems = [];

    for (const item of items) {
      const product = await this.purchaseModel.getProductById(item.productId);

      if (!product) {
        return { totalPrice: 0, updatedItems: [], validationError: `Product with id ${item.productId} not found` };
      }

      if (product.stock < item.quantity) {
        return { totalPrice: 0, updatedItems: [], validationError: `Insufficient stock for product ${product.name}` };
      }

      if (item.quantity <= 0) {
        return { totalPrice: 0, updatedItems: [], validationError: `Invalid quantity for product ${product.name}` };
      }

      const itemTotalPrice = product.price * item.quantity;
      totalPrice += itemTotalPrice;
      updatedItems.push({ ...item, price: product.price });
    }

    if (totalPrice <= 0) {
      return { totalPrice: 0, updatedItems: [], validationError: 'Invalid total price' };
    }

    return { totalPrice, updatedItems };
  }

  private async updateProductStocks(items: { productId: number; quantity: number }[]) {
    for (const item of items) {
      await this.purchaseModel.updateProductStock(item.productId, item.quantity);
    }
  }
}
