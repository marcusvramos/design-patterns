import { Request, Response } from "express";
import { Account } from "../entities/account";
import { AccountReceivableController } from "./account-receivable-controller";
import { AccountToPayController } from "./account-to-pay-controller";

export abstract class AccountController { 
  protected bankAccount: Account | undefined;
  protected enterpriseAccount: Account | undefined;

  public async settleAccount(req: Request, res: Response): Promise<Response> {
    try {
      const isValid = this.validateAccount(req); 
      if(!isValid){
        return res.status(400).send("Insuficient balance")
      }   
      await this.processPayment(req);
      return this.sendConfirmation(res);
    }
    catch(error){
      return res.status(400).send(error);
    }
  }

  protected async initializeAccounts(): Promise<void> {
    const [enterpriseAccount, bankAccount] = await Promise.all([
      Account.getAccount("empresa"),
      Account.getAccount("banco")
    ]);
  
    if (!enterpriseAccount || !bankAccount) {
      throw new Error("Banco de dados incompleto!");
    }

    this.enterpriseAccount = enterpriseAccount;
    this.bankAccount = bankAccount;
  }

  protected validateAccount(req: Request): boolean{
    const amount = req.body.amount;
    if(this instanceof AccountReceivableController){
      return !!this.bankAccount?.validateBalance(amount);
    }

    if(this instanceof AccountToPayController){
      return !!this.enterpriseAccount?.validateBalance(amount);
    }

    return false;
  };

  abstract processPayment(req: Request): Promise<void>;

  abstract sendConfirmation(res: Response): Response; 
}