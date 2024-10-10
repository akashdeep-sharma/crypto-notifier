import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Set an alert for a specific price' })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'ethereum' },
        targetPrice: { type: 'number', example: 2000 },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
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
