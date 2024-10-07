import { AccountController } from "./account-controller";

export class AccountReceivableController extends AccountController{
  override processPayment(): void {
    console.log("Conta a receber processada.");
  }  
}