import { PrismaClient } from "@prisma/client";
import { Product } from "../entities/product";

export class ProductModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(product: Product): Promise<Product> {
    try {
      const newProduct = await this.prisma.product.create({
        data: { ...product },
      });

      return newProduct;
    } catch (error) {
      throw new Error("Failed to create product");
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new Error("Failed to get products");
    }
  }
}
