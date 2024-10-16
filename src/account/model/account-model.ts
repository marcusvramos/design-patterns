import { AccountType, PrismaClient, Accounts } from "@prisma/client";

export class AccountModel {
  protected prisma: PrismaClient;

  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllAccounts(type: AccountType): Promise<Accounts[]> {
    return this.prisma.accounts.findMany({
      where: {
        type
      },
      include: {
        createdBy: true,
        closedBy: true
      }
    })
  };

  async createAccount(account: Accounts): Promise<void>{
    await this.prisma.accounts.create({
      data: account
    });
  };

  getAccountById(accountId: number): Promise<Accounts | null>{
     return this.prisma.accounts.findUnique({
      where: {
        id: accountId
      },
      include: {
        createdBy: true,
        closedBy: true
      }
    });
  };

  async updateAccount(accountId: number, account: Accounts): Promise<void>{
    await this.prisma.accounts.update({
      where: {
        id: accountId
      },
      data: account
    });
  };

  async deleteAccount(accountId: number): Promise<void>{
    await this.prisma.accounts.delete({
      where: {
        id: accountId
      }
    });
  };
}