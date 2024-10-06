import { PaymentStrategy } from '../interface/payment-interface';

export class CashPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<void> {
    console.log(`Processando pagamento via dinheiro de R$${amount.toFixed(2)}`);
  }
}
