import { PrismaClient } from '@prisma/client';
import { Product } from '../entities/product';
import { Subject } from '../../observers/subject';
import { Observer } from '../../observers/observer';


export class ProductModel implements Subject {
  private prisma: PrismaClient;
  private observers: Observer[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(productId: number, message: string): void {
    for (const observer of this.observers) {
      observer.update(productId, message);
    }
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
        this.notifyObservers(productId, `O produto ${product.name} foi reabastecido!`);
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
