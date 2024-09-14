export interface Observer {
  update(productId: number, message: string): void;
}
