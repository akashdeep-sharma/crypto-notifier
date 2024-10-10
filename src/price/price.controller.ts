import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get(':chain/hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  async getHourlyPrices(@Param('chain') chain: string) {
    const prices = await this.priceService.getPricesLast24Hours(chain);
    return prices.reduce((acc, price) => {
      const hour = price.timestamp.getHours();
      if (!acc[hour] || price.timestamp > acc[hour].timestamp) {
        acc[hour] = price;
      }
      return acc;
    }, {});
  }
}
