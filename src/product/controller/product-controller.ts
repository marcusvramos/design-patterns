import { Request, Response } from "express";
import { Product } from "../entities/product";
import { ProductModel } from "../model/product-model";

export class ProductController {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, price, stock } = req.body as Product;

    try {
      if (!name || !price || !stock) {
        throw new Error("Missing parameters to create product");
      }

      const newProduct = await this.productModel.createProduct({
        name,
        price,
        stock,
      } as Product);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.productModel.getAllProducts();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    const { productId, quantity } = req.body as { productId: number; quantity: number };

    try {
      if (!productId || !quantity) {
        throw new Error("Missing parameters to update stock");
      }

      await this.productModel.updateStock(productId, quantity);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
