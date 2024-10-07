import { AccountController } from "./account-controller";

export class AccountToPayController extends AccountController{
  override processPayment(): void {
    console.log("Conta a pagar processada.");
  }  
}