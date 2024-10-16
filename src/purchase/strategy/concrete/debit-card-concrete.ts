import { PaymentStrategy } from '../interface/payment-interface';

export class DebitCardPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<void> {
    console.log(
      `Processando pagamento via cartão de débito de R$${amount.toFixed(2)}`
    );
  }
}
