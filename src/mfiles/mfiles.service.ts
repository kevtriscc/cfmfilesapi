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

  async getPDFBuffer(): Promise<Buffer> {
    try {
      const token = await this.authenticate()
      const testWithoutKeyResponse = await this.testWithoutKey()
      const testWithKeyResponse = await this.testWithKey(token)
      return await this.downloadPDF(token)
    } catch (error) {
      console.error(error)
      throw new HttpException(
        'Fehler beim Abrufen der PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async testWithKey(token: string) {
    try {
      const config: AxiosRequestConfig = {
        ...this.axiosConfig,
        headers: {
          ...this.axiosConfig.headers,
          'X-Authentication': token,
        },
      }
      const url = `${this.destination.url}/m-files/REST/server/authenticationprotocols`

      const response = await axios.get(url, config)
      return response.data
    } catch (error) {
      console.error(error)
      throw new HttpException(
        'Fehler beim Abrufen der PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async testWithoutKey() {
    try {
      const config: AxiosRequestConfig = {
        ...this.axiosConfig,
        headers: {
          ...this.axiosConfig.headers,
        },
      }
      const url = `${this.destination.url}/m-files/REST/server/authenticationprotocols`

      const response = await axios.get(url, config)
      return response.data
    } catch (error) {
      console.error(error)
      throw new HttpException(
        'Fehler beim Abrufen der PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

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

  private async downloadPDF(token: string): Promise<Buffer> {
    const config: AxiosRequestConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        'X-Authentication': token,
      },
      responseType: 'arraybuffer',
    }
    const fileUrl = `${this.destination.url}/m-files/REST/objects/0/41591/7/files/46873/content`

    const response = await axios.get(fileUrl, config)
    return response.data
  }
}
