import { Controller, Get, Res, HttpStatus, Query } from '@nestjs/common'
import { Response } from 'express'
import { MfilesService } from './mfiles.service'

@Controller('mfiles')
export class MfilesController {
  constructor(private readonly mfilesService: MfilesService) {}

  @Get('pdf') 
  async getPDF(@Res() res: Response, @Query('p1119') p1119: string, @Query('p39') p39: string, @Query('p1408') p1408: string) {
    try {
      const pdfBuffer = await this.mfilesService.getPDFBuffer(p1119, p39, p1408)
      res.setHeader('Content-Type', 'application/pdf')
      res.status(HttpStatus.OK).send(pdfBuffer)
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(error.response)
    }
  }

  @Get('training') 
  async getUserTrainedInfo(@Res() res: Response, @Query('username') dmUser: string, @Query('p1119') p1119: string, @Query('p39') p39: string, @Query('p1408') p1408: string) {
    try {
      const userTrainingInfo = await this.mfilesService.getUserTrainingInfo(dmUser, p1119, p39, p1408)
      res.setHeader('Content-Type', 'application/json')
      res.status(HttpStatus.OK).send(userTrainingInfo)
    } catch (error) {
      res
        .status(error.status)
        .send(error)
    }
  }
}
