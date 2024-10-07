import { AccountStatus, AccountType } from "@prisma/client";
import { User } from "../../user/entities/user";

export class Account {
  protected readonly id?: number;
  protected readonly descriptions!: string;
  protected readonly value!: number;
  protected readonly institution!: string;
  protected readonly createdBy!: User;
  protected readonly createdAt!: Date;
  protected readonly updatedAt!: Date;
  protected readonly status!: AccountStatus;
  protected readonly type!: AccountType;
  protected readonly closedBy?: User;
}