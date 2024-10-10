import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Price } from './price.entity';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchAndSavePrices() {
    const chains = ['ethereum', 'polygon'];
    for (const chain of chains) {
      const price = await this.fetchPrice(chain);
      await this.savePrice(chain, price);
    }
  }

  private async fetchPrice(chain: string): Promise<number> {
    const apiKey = this.configService.get<string>('moralis.apiKey');
    const url = `https://deep-index.moralis.io/api/v2/erc20/${chain}/price`;
    const response = await axios.get(url, {
      headers: { 'X-API-Key': apiKey },
    });
    return response.data.usdPrice;
  }

  private async savePrice(chain: string, price: number) {
    const priceEntity = this.priceRepository.create({ chain, price });
    await this.priceRepository.save(priceEntity);
    this.logger.log(`Saved ${chain} price: ${price}`);
  }

  async getPricesLastHour(chain: string): Promise<Price[]> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.priceRepository.find({
      where: {
        chain,
        timestamp: MoreThanOrEqual(oneHourAgo),
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getPricesLast24Hours(chain: string): Promise<Price[]> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.priceRepository.find({
      where: {
        chain,
        timestamp: MoreThanOrEqual(oneDayAgo),
      },
      order: { timestamp: 'DESC' },
    });
  }
}
