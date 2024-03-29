import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MfilesModule } from './mfiles/mfiles.module';

@Module({
  imports: [MfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
