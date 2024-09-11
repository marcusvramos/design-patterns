import { PrismaClient, User } from '@prisma/client';

export class UserModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(user: User) {
    try {
      const newUser = await this.prisma.user.create({
        data: { ...user },
      });

      return newUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async getAllUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new Error('Failed to get users');
    }
  }
}
