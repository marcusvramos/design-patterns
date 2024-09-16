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
      subject: `Atualização de Estoque - Produto ${data.productId}`,
      text: `Olá, ${data.name}! Tenho boas notícias! ${data.message}`,
      html: `<p>Olá, <b>${data.name}</b>! Tenho boas notícias sobre o produto <b>${data.productId}</b>!<br/>${data.message}</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
    }
  }
}
