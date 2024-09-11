import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(data: any): Promise<void> {
    const mailOptions = {
      from: '"Engenharia 3" <noreplay@engenharia.com>',
      to: data.email,
      subject: "Bem-vindo ao nosso serviço!",
      text: `Olá, ${data.name}! Bem-vindo ao nosso serviço!`,
      html: `<p>Olá, <b>${data.name}</b>! Bem-vindo ao nosso serviço!</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
    }
  }
}
