import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Set an alert for a specific price' })
  async setAlert(
    @Body() alertData: { chain: string; targetPrice: number; email: string },
  ) {
    return this.alertService.setAlert(
      alertData.chain,
      alertData.targetPrice,
      alertData.email,
    );
  }
}
