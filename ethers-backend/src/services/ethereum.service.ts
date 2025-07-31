import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { AbstractProvider } from 'ethers';

@Injectable()
export class EthereumService {
  private readonly provider: AbstractProvider;

  constructor() {
    this.provider = ethers.getDefaultProvider('mainnet', {
      infura: {
        projectId: 'b704286137144e42ba079b2b90cad659',
        projectSecret: 'DQxTQsMUrFcIeJwoaan40VpD1BbRDW4+bq+1yWEaeXkGttRwnarKPw'
      }
    });
  }

  async getEthBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    const balance = await contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, 18); 
  }
}