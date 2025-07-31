import { Controller, Get, Param } from '@nestjs/common';
import { EthereumService } from '../services/ethereum.service';

@Controller('eth')
export class EthereumController {
  constructor(private readonly ethersService: EthereumService) {}

  @Get('balance/:address')
  async getEthBalance(@Param('address') address: string) {
    return {
      asset: 'ETH',
      balance: await this.ethersService.getEthBalance(address)
    };
  }

  @Get('balance/token/:tokenAddress/:userAddress')
  async getTokenBalance(
    @Param('tokenAddress') tokenAddress: string,
    @Param('userAddress') userAddress: string
  ) {
    return {
      token: tokenAddress,
      balance: await this.ethersService.getTokenBalance(tokenAddress, userAddress)
    };
  }
}