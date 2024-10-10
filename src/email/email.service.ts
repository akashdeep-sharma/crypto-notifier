import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.pass'),
      },
    });
  }

  async sendAlert(chain: string, priceChange: number, currentPrice: number) {
    await this.transporter.sendMail({
      from: this.configService.get('email.from'),
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert: ${chain} increased by ${priceChange.toFixed(2)}%`,
      text: `The price of ${chain} has increased by ${priceChange.toFixed(2)}% in the last hour. Current price: $${currentPrice.toFixed(2)}`,
    });
  }
}
