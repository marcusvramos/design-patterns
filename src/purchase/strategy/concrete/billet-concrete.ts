import { PaymentStrategy } from '../interface/payment-interface';

export class BilletPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<void> {
    console.log(`Processando pagamento via boleto de R$${amount.toFixed(2)}`);
  }
}
