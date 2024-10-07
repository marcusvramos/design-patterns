import { Account } from "../entities/account";
import { AccountController } from "./account-controller";
import { Request, Response } from "express";

export class AccountToPayController extends AccountController {
  private destinationAccount: Account | undefined;
  private originAccount: Account | undefined;

  public constructor() {
    super();
    this.initializeAccounts()
      .catch(error => {
        throw new Error("Failed to initialize accounts.");
      });
  }

  private async initializeAccounts(): Promise<void> {
    const [debtor, creditor] = await Promise.all([
      Account.getAccount("empresa"),
      Account.getAccount("banco")
    ]);

    if (!debtor || !creditor) {
      throw new Error("Banco de dados incompleto!");
    }

    this.originAccount = debtor;
    this.destinationAccount = creditor;
  }

  public async processPayment(req: Request): Promise<void> {
    const amount = req.body.amount;
    await this.originAccount?.decreaseBalance(amount);
    await this.destinationAccount?.increaseBalance(amount);
  }

  public validateAccount(req: Request): void {
    const amount = req.body.amount;
    if (!amount) {
      throw new Error("Amount não informado");
    }
    if (!this.originAccount?.validateBalance(amount)) {
      throw new Error("Saldo insuficiente!");
    }
  }

  public sendConfirmation(res: Response): Response {
    return res.status(200).send("Pagamento realizado com sucesso");
  }
}
