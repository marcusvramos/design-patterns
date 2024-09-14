// src/model/purchase-model.ts
import { PrismaClient, PaymentMethod } from '@prisma/client';
import { Purchase } from '../entities/purchase';

export class PurchaseModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserById(userId: number) {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      throw new Error('Failed to get user');
    }
  }

  async validatePaymentMethod(paymentMethod: string): Promise<boolean> {
    const validPaymentMethods = Object.values(PaymentMethod) as string[];
    return validPaymentMethods.includes(paymentMethod);
  }

  async getProductById(productId: number) {
    try {
      return await this.prisma.product.findUnique({ where: { id: productId } });
    } catch (error) {
      throw new Error('Failed to get product');
    }
  }

  async updateProductStock(productId: number, quantity: number) {
    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });
    } catch (error) {
      throw new Error('Failed to update product stock');
    }
  }

  async createPurchase(purchase: Purchase): Promise<Purchase> {
    try {
      const newPurchase = await this.prisma.purchase.create({
        data: {
          ...purchase,
          items: {
            create: purchase.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return newPurchase;
    } catch (error) {
      throw new Error('Failed to create purchase');
    }
  }

  async getAllPurchases(): Promise<Purchase[]> {
    try {
      const purchases = await this.prisma.purchase.findMany({
        include: {
          items: true,
        },
      });

      return purchases.map((purchase) => new Purchase(
        purchase.userId,
        purchase.totalPrice,
        purchase.paymentMethod,
        purchase.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      ));
    } catch (error) {
      throw new Error('Failed to get purchases');
    }
  }

  async getPurchasesByProductId(productId: number) {
    try {
      return await this.prisma.purchaseItem.findMany({
        where: { productId },
        include: {
          purchase: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Failed to get purchases by product id');
    }
  }
}
