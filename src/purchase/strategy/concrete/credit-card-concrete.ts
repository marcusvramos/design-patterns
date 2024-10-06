import { PaymentStrategy } from '../interface/payment-interface';

export class CreditCardPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<void> {
    console.log(
      `Processando pagamento via cartão de crédito de R$${amount.toFixed(2)}`
    );
  }
}
