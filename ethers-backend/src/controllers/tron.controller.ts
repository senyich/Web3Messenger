import { Controller, Get, Param, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { TronService } from '../services/tron.service';

@Controller('trx')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  private validateAddress(address: string): void {
    if (!this.tronService.validateAddress(address)) {
      throw new BadRequestException('Invalid TRON address');
    }
  }

  @Get('balance/:address')
  async getTrxBalance(@Param('address') address: string) {
    this.validateAddress(address);
    try {
      return {
        status: HttpStatus.OK,
        asset: 'TRX',
        balance: await this.tronService.getTrxBalance(address)
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching TRX balance',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('usdt/balance/:address')
  async getUsdtBalance(@Param('address') address: string) {
    this.validateAddress(address);
    try {
      return {
        status: HttpStatus.OK,
        asset: 'USDT',
        balance: await this.tronService.getUsdtBalance(address)
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('usdt/info')
  async getUsdtContractInfo() {
    try {
      return {
        status: HttpStatus.OK,
        asset: 'USDT',
        contractInfo: await this.tronService.getUsdtContractInfo()
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching USDT contract info '+error,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('balances/:address')
  async getAllBalances(@Param('address') address: string) {
    this.validateAddress(address);
    try {
      const [trxBalance, usdtBalance] = await Promise.all([
        this.tronService.getTrxBalance(address),
        this.tronService.getUsdtBalance(address)
      ]);

      return {
        status: HttpStatus.OK,
        address,
        balances: [
          { asset: 'TRX', balance: trxBalance },
          { asset: 'USDT', balance: usdtBalance }
        ]
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching balances',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}