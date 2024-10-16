export interface Observer {
  update(product: string, message: string): Promise<void>;
}
