// src/observers/email-observer.ts
import { Observer } from "./observer";
import { EmailService } from "../common/email-service";
import { PrismaClient } from "@prisma/client";
import { PurchaseModel } from "../purchase/model/purchase-model";

export class EmailObserver implements Observer {
  private emailService: EmailService;
  private purchaseModel: PurchaseModel;

  constructor() {
    this.emailService = new EmailService();
    this.purchaseModel = new PurchaseModel();
  }

  async update(productId: number, message: string): Promise<void> {
    try {
      const purchases = await this.purchaseModel.getPurchasesByProductId(productId);

      const usersToNotify = new Set(purchases.map(purchase => purchase.purchase.user));

      for (const user of usersToNotify) {
        await this.emailService.send({
          email: user.email,
          name: user.name,
          subject: `Notificação de Produto ${productId}`,
          message: message,
        });
      }

      console.log(`Notificações enviadas para os usuários que compraram o produto ${productId}`);
    } catch (error) {
      console.error("Erro ao enviar notificações:", error);
    }
  }
}
