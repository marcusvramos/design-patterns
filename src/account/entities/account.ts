import { PrismaClient } from "@prisma/client";

export class Account {
  private readonly prisma: PrismaClient;
  private id: number;
  private name: string;
  private balance: number;
  
  public constructor(
    data: { id: number; name: string; balance: number }
  ) {
    this.id = data.id;
    this.name = data.name;
    this.balance = data.balance;
    this.prisma = new PrismaClient();
  }

  public static async getAccount(name: string): Promise<Account | null> {
    const prisma = new PrismaClient();
    const result = await prisma.bankAccount.findFirst({
      where: { name }
    })
    if (!result) return null;
    return new Account({...result});
  }

  public static async createDefaultAccounts(): Promise<Account[]> {
    const prisma = new PrismaClient();
    const bankAccount = await prisma.bankAccount.create({
      data: { name: "banco", balance: 1000 }
    });

    const enterpriseAccount = await prisma.bankAccount.create({
      data: { name: "empresa", balance: 1000 }
    });

    return [new Account({...bankAccount}), new Account({...enterpriseAccount})];
  }

  public validateBalance(amount: number): boolean {
    return this.balance > amount;
  }

  public async increaseBalance(amount: number) {
    return this.prisma.bankAccount.update({
      where: { id: this.id },
      data: {
        balance: this.balance + amount
      }
    })
  }

  public async decreaseBalance(amount: number) {
    return this.prisma.bankAccount.update({
      where: { id: this.id },
      data: {
        balance: this.balance - amount
      }
    })
  }
}