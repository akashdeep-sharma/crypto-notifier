import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert } from './alert.entity';
import { PriceService } from '../price/price.service';
import { EmailService } from '../email/email.service';
@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private priceService: PriceService,
    private emailService: EmailService,
  ) {}

  async setAlert(
    chain: string,
    targetPrice: number,
    email: string,
  ): Promise<Alert> {
    const alert = this.alertRepository.create({ chain, targetPrice, email });
    return this.alertRepository.save(alert);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAlerts() {
    const alerts = await this.alertRepository.find({
      where: { triggered: false },
    });
    for (const alert of alerts) {
      const latestPrice = (
        await this.priceService.getPricesLastHour(alert.chain)
      )[0].price;
      if (
        (alert.targetPrice > latestPrice && latestPrice >= alert.targetPrice) ||
        (alert.targetPrice < latestPrice && latestPrice <= alert.targetPrice)
      ) {
        await this.emailService.sendAlert(alert.chain, 0, latestPrice);
        alert.triggered = true;
        await this.alertRepository.save(alert);
        this.logger.log(
          `Triggered alert for ${alert.chain} at price ${latestPrice}`,
        );
      }
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkPriceChanges() {
    const chains = ['ethereum', 'polygon'];
    for (const chain of chains) {
      const pricesLastHour = await this.priceService.getPricesLastHour(chain);
      if (pricesLastHour.length < 2) return;

      const latestPrice = pricesLastHour[0].price;
      const oldestPrice = pricesLastHour[pricesLastHour.length - 1].price;
      const priceChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;

      if (priceChange > 3) {
        await this.emailService.sendAlert(chain, priceChange, latestPrice);
        this.logger.log(`Sent alert for ${chain}: ${priceChange}% increase`);
      }
    }
  }
}
