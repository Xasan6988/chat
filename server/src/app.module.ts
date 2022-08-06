import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppService,
    PrismaService,
    AppGateway
  ],
})
export class AppModule {}
