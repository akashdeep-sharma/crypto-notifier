import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SwapService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getSwapRate(ethAmount: number): Promise<{
    btcAmount: number;
    feesEth: number;
    feesUsd: number;
  }> {
    const apiKey = this.configService.get<string>('moralis.apiKey');

    // Fetch ETH/USD price
    const ethUsdResponse = await firstValueFrom(
      this.httpService.get(
        'https://deep-index.moralis.io/api/v2/erc20/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/price',
        {
          headers: { 'X-API-Key': apiKey },
        },
      ),
    );
    const ethUsdPrice = ethUsdResponse.data.usdPrice;

    // Fetch BTC/USD price
    const btcUsdResponse = await firstValueFrom(
      this.httpService.get(
        'https://deep-index.moralis.io/api/v2/erc20/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/price',
        {
          headers: { 'X-API-Key': apiKey },
        },
      ),
    );
    const btcUsdPrice = btcUsdResponse.data.usdPrice;

    // Calculate swap rate
    const ethValue = ethAmount * ethUsdPrice;
    const btcAmount = ethValue / btcUsdPrice;

    // Calculate fees (0.03%)
    const feePercentage = 0.0003;
    const feesEth = ethAmount * feePercentage;
    const feesUsd = feesEth * ethUsdPrice;

    return {
      btcAmount,
      feesEth,
      feesUsd,
    };
  }
}
