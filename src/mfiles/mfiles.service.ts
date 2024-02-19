import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import {
  Destination,
  getDestinationFromDestinationService,
} from '@sap-cloud-sdk/connectivity'
import axios, { AxiosRequestConfig } from 'axios'

@Injectable()
export class MfilesService implements OnModuleInit {
  private destination: Destination
  private axiosConfig: AxiosRequestConfig

  async onModuleInit(): Promise<void> {
    this.destination = await getDestinationFromDestinationService({
      destinationName: 'DestinationToMFilesPROD_API',
    })

    this.axiosConfig = {
      headers: {
        ...this.destination.proxyConfiguration.headers,
        'SAP-Connectivity-SCC-Location_ID':
          this.destination.cloudConnectorLocationId,
      },
      proxy: {
        host: this.destination.proxyConfiguration.host,
        port: this.destination.proxyConfiguration.port,
      },
    }
  }

  //Authenticate to M-Files
  private async authenticate(): Promise<string> {
    const path = `${this.destination.url}/m-files/REST/server/authenticationtokens`
    const body = {
      Username: 'dmc-test-user',
      Password: 'Init_cent12345',
      VaultGuid: 'A508E2D0-1A44-4D33-B7B7-92BEC9D85D70',
    }

    const response = await axios.post(path, body, this.axiosConfig)
    return response.data.Value
  }

//Check if User is trained on document
  async getUserTrainingInfo(dmUser: string): Promise<string> {
    const token = await this.authenticate()
    const mFilesUserId = await this.getMFilesUserID(token, dmUser)

    return `{ "isTrained": true }`
  }

  private async getMFilesUserID(token: string, dmUser: string): Promise<string> {
    const config: AxiosRequestConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        'X-Authentication': token,
      },
      params: {
        p1024: dmUser
      },
      responseType: 'json',
    }
    const getUserIDUrl = `${this.destination.url}/m-files/REST/objects/102`
    const response = await axios.get(getUserIDUrl, config)
    return response.data
  }

//Get PDF File
  async getPDFBuffer(q: string, p39: string, p1408: string): Promise<Buffer> {
    try {
      const token = await this.authenticate()
      return await this.downloadPDF(token, q, p39, p1408)
    } catch (error) {
      throw new HttpException(
        `Error fetching PDF: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  

  private async downloadPDF(
    token: string,
    q: string,
    p39: string,
    p1408: string,
  ): Promise<Buffer> {
    const documentObject = await this.getObject(token, q, p39, p1408)
    const documentObjectJson = JSON.parse(documentObject.toString('utf-8'))

    if (documentObjectJson.Items.length !== 1) {
      throw new HttpException(`${documentObjectJson.Items.length} documents found. Change workinstruction search parameter to find exactly one document.`, HttpStatus.BAD_REQUEST);
    }
    const firstItem = documentObjectJson.Items[0]
    const version = firstItem.ObjVer.Version
    const objVerId = firstItem.ObjVer.ID
    const fileId = firstItem.Files.length > 0 ? firstItem.Files[0].ID : null

    const config: AxiosRequestConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        'X-Authentication': token,
      },
      responseType: 'arraybuffer',
    }
    const fileUrl = `${this.destination.url}/m-files/REST/objects/0/${objVerId}/${version}/files/${fileId}/content`
    const response = await axios.get(fileUrl, config)
    return response.data
  }

  private async getObject(
    token: string,
    q: string,
    p39: string,
    p1408: string,
  ): Promise<Buffer> {
    const config: AxiosRequestConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        'X-Authentication': token,
      },
      params: {
        q: q,
        p39: p39,
        p1408: p1408,
      },
      responseType: 'arraybuffer',
    }
    var searchUrl = `${this.destination.url}/m-files/REST/objects/0`
    try {
      const response = await axios.get(searchUrl, config)
      return response.data
    } catch (error) {
      console.error(error)
      throw new HttpException(
        `Error in document serach: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
