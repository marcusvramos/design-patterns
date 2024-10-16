import { PaymentStrategy } from '../interface/payment-interface';

export class PixPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<void> {
    console.log(`Processando pagamento via pix de R$${amount.toFixed(2)}`);
  }
}
