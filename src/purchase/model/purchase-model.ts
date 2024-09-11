import { PrismaClient } from '@prisma/client';
import { Purchase } from '../entities/purchase';

export class PurchaseModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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
      throw new Error('Failed to create product');
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
}
