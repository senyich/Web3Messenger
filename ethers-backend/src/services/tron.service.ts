import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BigNumber } from 'tronweb';
import { TronWeb } from 'tronweb';

@Injectable()
export class TronService {
  private readonly tronWeb: TronWeb;
  private readonly USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  private readonly TRONGRID_API = 'https://api.trongrid.io';
  private readonly API_KEY = 'c9c1d3cf-4783-4018-bc97-538b8e53d95f';

  constructor(private readonly httpService: HttpService) {
    this.tronWeb = new TronWeb({
      fullHost: this.TRONGRID_API,
      headers: { 'TRON-PRO-API-KEY': this.API_KEY }
    });
  }

  validateAddress(address: string): boolean {
    return this.tronWeb.isAddress(address);
  }

  async getTrxBalance(address: string): Promise<string> {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return this.tronWeb.fromSun(balance).toString();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch TRX balance');
    }
  }

  async getUsdtBalance(address: string): Promise<string> {
    try {
      if (!this.validateAddress(address)) {
        throw new BadRequestException('Invalid TRON address');
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.TRONGRID_API}/v1/accounts/${address}/transactions/trc20?contract_address=${this.USDT_CONTRACT}&only_confirmed=true&limit=1`,
          { headers: { 'TRON-PRO-API-KEY': this.API_KEY } }
        )
      );

      if (!response.data.success || !response.data.data.length) {
        return '0'; 
      }

      // Последняя транзакция показывает текущий баланс получателя
      const latestTx = response.data.data[0];
      if (latestTx.to === address) {
        const value = new BigNumber(latestTx.value);
        return value.div(1e6).toString(); // USDT имеет 6 decimal places
      }

      return '0';
    } catch (error) {
      console.error('USDT Balance Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to fetch USDT balance via API');
    }
  }

  async getUsdtContractInfo() {
    try {
      // Получаем информацию о контракте через TronGrid API
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.TRONGRID_API}/v1/contracts/${this.USDT_CONTRACT}`,
          { headers: { 'TRON-PRO-API-KEY': this.API_KEY } }
        )
      );

      if (!response.data.data) {
        throw new Error('Contract data not found');
      }

      return {
        name: response.data.data.name,
        symbol: response.data.data.symbol,
        decimals: response.data.data.decimals,
        totalSupply: response.data.data.total_supply,
      };
    } catch (error) {
      console.error('Contract Info Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to fetch USDT contract info');
    }
  }
}