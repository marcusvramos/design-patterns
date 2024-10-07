import { EmailService } from "../../common/email-service";
import { Observer } from "../../observers/observer";


export class User implements Observer {
  public readonly id: number;

  public readonly name: string;
  
  public readonly document: string;
  
  public readonly email: string;
  
  private emailService: EmailService;

  constructor(id: number, name: string, document: string, email: string) {
    this.id = id;
    this.name = name;
    this.document = document;
    this.email = email;
    this.emailService = new EmailService();
  }

  async update(productId: number, message: string): Promise<void> {
    try {
      await this.emailService.send({
        email: this.email,
        name: this.name,
        subject: `Notificação de Produto ${productId}`,
        message: message,
      });
      console.log(`Notificação enviada para ${this.name} sobre o produto ${productId}`);
    } catch (error) {
      console.error(`Erro ao enviar notificação para ${this.name}:`, error);
    }
  }
}
