import { PrismaClient, User } from '@prisma/client';
import { Subject } from '../observer/observer';

export class UserModel {
  private prisma: PrismaClient;
  private userSubject: Subject;

  constructor(userSubject: Subject) {
    this.prisma = new PrismaClient();
    this.userSubject = userSubject;
  }

  async createUser(user: User) {
    try {
      const newUser = await this.prisma.user.create({
        data: { ...user },
      });

      this.userSubject.notify('userCreated', newUser);

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
