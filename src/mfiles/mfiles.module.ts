import { Module } from '@nestjs/common';
import { MfilesController } from './mfiles.controller';
import { MfilesService } from './mfiles.service';
import { ConfigModule } from '@nestjs/config';
import mfilesConfig from 'src/config/mfiles.config';

@Module({
  controllers: [MfilesController],
  providers: [MfilesService],
  imports: [
    ConfigModule.forFeature(mfilesConfig)
  ]
})
export class MfilesModule {}
