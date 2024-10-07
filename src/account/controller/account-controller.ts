import { Response } from "express";

export abstract class AccountController { 
  public settleAccount(res: Response): Response {
    this.validateAccount(); 
    this.processPayment();   
    this.sendConfirmation();

    return res.status(200).send("Conta paga/recebida com sucesso.");
  }

  protected validateAccount(): void {
    console.log("Conta validada.");
  }

  protected abstract processPayment(): void;

  protected sendConfirmation(): void {
    console.log("Confirmação enviada.");
  }
}