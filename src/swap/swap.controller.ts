import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SwapService } from './swap.service';

@ApiTags('swap')
@Controller('swap')
export class SwapController {
  constructor(private swapService: SwapService) {}

  @Get('eth-to-btc')
  @ApiOperation({ summary: 'Get swap rate from ETH to BTC' })
  @ApiQuery({
    name: 'ethAmount',
    type: 'number',
    description: 'Amount of ETH to swap',
  })
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    return this.swapService.getSwapRate(ethAmount);
  }
}
