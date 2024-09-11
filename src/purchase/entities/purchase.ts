import { PaymentMethod } from "@prisma/client";
import { PurchaseItem } from "./purchase-item";

export class Purchase {
    public constructor(
      public readonly userId: number,
      public readonly totalPrice: number,
      public readonly paymentMethod: PaymentMethod,
      public readonly items: PurchaseItem[]
    ) {}
  }
  
 
  

  