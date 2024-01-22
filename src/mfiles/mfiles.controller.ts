import { Controller, Get, Res, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { MfilesService } from './mfiles.service'

@Controller('mfiles')
export class MfilesController {
  constructor(private readonly mfilesService: MfilesService) {}

  @Get('pdf')
  async getPDF(@Res() res: Response) {
    try {
      const pdfBuffer = await this.mfilesService.getPDFBuffer()
      res.setHeader('Content-Type', 'application/pdf')
      res.status(HttpStatus.OK).send(pdfBuffer)
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Fehler beim Abrufen der PDF')
    }
  }
}
