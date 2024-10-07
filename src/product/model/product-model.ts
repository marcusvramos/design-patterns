import { PrismaClient } from '@prisma/client';
import { Product } from '../entities/product';
import { Subject } from '../../observers/subject';
import { Observer } from '../../observers/observer';
import { User } from '../../user/entities/user';
import { PurchaseModel } from '../../purchase/model/purchase-model';


export class ProductModel implements Subject {
  private prisma: PrismaClient;
  private purchaseModel: PurchaseModel;
  private observers: Observer[] = [];

  constructor() {
    this.prisma = new PrismaClient();
    this.purchaseModel = new PurchaseModel();
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  async notifyObservers(productId: number, message: string): Promise<void> {
    const notifyPromises = this.observers.map(observer =>
      observer.update(productId, message).catch(error => {
        console.error(`Erro ao notificar observador: ${error}`);
      })
    );

    await Promise.all(notifyPromises);
  }

  async createProduct(product: Product): Promise<Product> {
    try {
      const newProduct = await this.prisma.product.create({
        data: { ...product },
      });

      return newProduct;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    try {
      const product = await this.prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
      });

      if (product) {
        const purchases = await this.purchaseModel.getPurchasesByProductId(productId);

        const usersToNotify = new Set(purchases.map(purchase => purchase.purchase.user));

        usersToNotify.forEach(user => {
          const observerUser = new User(user.id, user.name, user.document, user.email);
          this.addObserver(observerUser);
        });

        await this.notifyObservers(productId, `O produto ${product.name} foi reabastecido!`);
      }
    } catch (error) {
      throw new Error('Failed to update product stock');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new Error('Failed to get products');
    }
  }
}
