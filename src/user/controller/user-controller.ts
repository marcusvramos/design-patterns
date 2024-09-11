import { Request, Response } from "express";
import { UserModel } from "../model/user-model";
import { Subject } from "../observer/observer";
import { LogService } from "../services/log-service";
import { EmailService } from "../services/email-service";
import { User } from "@prisma/client";

export class UserController {
  private userModel: UserModel;

  constructor() {
    const userSubject = new Subject();

    userSubject.addObserver(new LogService());
    userSubject.addObserver(new EmailService());

    this.userModel = new UserModel(userSubject);
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, document, email } = req.body;

    try {
      if (!name || !document) {
        res.status(400).json({ error: "Name and Document are required" });
        return;
      }

      const newUser = await this.userModel.createUser({
        name,
        document,
        email,
      } as User);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };
}
