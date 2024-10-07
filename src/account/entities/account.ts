import { PrismaClient } from "@prisma/client";

export class Account {
  private readonly prisma: PrismaClient;
  public constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly balance: number
  ) {
    this.prisma = new PrismaClient();
  }

  public static async getAccount(name: string): Promise<Account | null> {
    const prisma = new PrismaClient();
    const result = await prisma.bankAccount.findFirst({
      where: { name }
    })
    if (!result) return null;
    return new Account(result?.id, result?.name, result?.balance);
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