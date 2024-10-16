import { Request, Response } from "express";
import { Account } from "../entities/account";

export abstract class AccountController { 
  protected bankAccount: Account | undefined;
  protected enterpriseAccount: Account | undefined;
  protected type?: "receivable" | "toPay";

  public async settleAccount(req: Request, res: Response): Promise<Response> {
    try {
      await this.initializeAccounts();
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
    let [enterpriseAccount, bankAccount] = await Promise.all([
      Account.getAccount("empresa"),
      Account.getAccount("banco")
    ]);
  
    if (!enterpriseAccount || !bankAccount) {
      [enterpriseAccount, bankAccount] = await Account.createDefaultAccounts();
    }

    this.enterpriseAccount = enterpriseAccount;
    this.bankAccount = bankAccount;
  }

  protected validateAccount(req: Request): boolean{
    const amount = req.body.amount;
    if(this.type === "receivable"){
      return !!this.bankAccount?.validateBalance(amount);
    }

    if(this.type === "toPay"){
      return !!this.enterpriseAccount?.validateBalance(amount);
    }

    return false;
  };

  abstract processPayment(req: Request): Promise<void>;

  abstract sendConfirmation(res: Response): Response; 
}