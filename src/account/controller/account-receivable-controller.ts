import { Account } from "../entities/account";
import { AccountController } from "./account-controller";
import { Request, Response } from "express";

export class AccountReceivableController extends AccountController {
  public constructor() {
    super();
    this.initializeAccounts()
  }



  public async processPayment(req: Request): Promise<void> {
    const amount = req.body.amount;
    await this.bankAccount?.decreaseBalance(amount);
    await this.enterpriseAccount?.increaseBalance(amount);
  }

  public sendConfirmation(res: Response): Response {
    return res.status(200).send("Conta recebida com sucesso");
  }
}
