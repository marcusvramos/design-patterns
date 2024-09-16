import { Observer } from "./observer";

export interface Subject {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(productId: number, message: string): Promise<void>;
}
