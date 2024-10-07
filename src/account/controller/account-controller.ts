import { Request, Response } from "express";

export abstract class AccountController { 
  public async settleAccount(req: Request, res: Response): Promise<Response> {
    try {
      this.validateAccount(req);    
      await this.processPayment(req);
      return this.sendConfirmation(res);
    }
    catch(error){
      return res.status(400).send(error);
    }
  }

  abstract validateAccount(req: Request): void;

  abstract processPayment(req: Request): Promise<void>;

  abstract sendConfirmation(res: Response): Response; 
}