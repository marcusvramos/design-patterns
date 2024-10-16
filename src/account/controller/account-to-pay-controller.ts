import { AccountController } from "./account-controller";
import { Request, Response } from "express";

export class AccountToPayController extends AccountController {
  constructor() {
    super();
    this.type = "toPay";
  }

  public async processPayment(req: Request): Promise<void> {
    const amount = req.body.amount;
    await this.enterpriseAccount?.decreaseBalance(amount);
    await this.bankAccount?.increaseBalance(amount);
  }


  public sendConfirmation(res: Response): Response {
    return res.status(200).send("Pagamento realizado com sucesso");
  }
}
