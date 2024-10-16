export interface PaymentStrategy {
  processPayment(amount: number): Promise<void>;
}
