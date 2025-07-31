import { Module } from '@nestjs/common';
import { EthereumController } from './controllers/ethereum.controller';
import { EthereumService } from './services/ethereum.service';
import { TronController } from './controllers/tron.controller';
import { TronService } from './services/tron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EthereumController, TronController],
  providers: [EthereumService, TronService],
})
export class AppModule {}
