export class PurchaseItem {
    public constructor(
      public readonly productId: number,
      public readonly quantity: number,
      public readonly price: number
    ) {}
  }