import { Controller, Get } from '@nestjs/common';
import { MfilesService } from './mfiles.service';

@Controller('mfiles')
export class MfilesController {
  constructor(private readonly mfilesService: MfilesService) {}

  @Get('auth')
  async auth(): Promise<string> {
    return this.mfilesService.auth();
  }

  @Get('auth-test')
  async authTest(): Promise<string> {
    return this.mfilesService.authTest();
  }
}
