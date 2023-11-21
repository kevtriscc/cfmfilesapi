import { Module } from '@nestjs/common';
import { MfilesController } from './mfiles.controller';
import { MfilesService } from './mfiles.service';

@Module({
  controllers: [MfilesController],
  providers: [MfilesService]
})
export class MfilesModule {}
