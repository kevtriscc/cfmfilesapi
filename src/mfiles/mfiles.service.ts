import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import {
  Destination,
  getDestinationFromDestinationService,
} from '@sap-cloud-sdk/connectivity'
import axios, { AxiosRequestConfig } from 'axios'

@Injectable()
export class MfilesService {
  async getPDFBuffer(q: string, p39: string, p1408: string): Promise<Buffer> {
    try {
      const { destination, axiosConfig } = await this.getDestinationAndConfig()
      const token = await this.authenticate(destination, axiosConfig)
      return await this.downloadPDF(
        token,
        q,
        p39,
        p1408,
        destination,
        axiosConfig,
      )
    } catch (error) {
      throw new HttpException(
        `Error fetching PDF: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async getDestinationAndConfig(): Promise<{
    destination: Destination
    axiosConfig: AxiosRequestConfig
  }> {
    const destination = await getDestinationFromDestinationService({
      destinationName: 'DestinationToMFilesPROD_API',
    })

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        ...destination.proxyConfiguration.headers,
        'SAP-Connectivity-SCC-Location_ID':
          destination.cloudConnectorLocationId,
      },
      proxy: {
        host: destination.proxyConfiguration.host,
        port: destination.proxyConfiguration.port,
      },
    }

    return { destination, axiosConfig }
  }

  private async authenticate(
    destination: Destination,
    axiosConfig: AxiosRequestConfig,
  ): Promise<string> {
    const path = `${destination.url}/m-files/REST/server/authenticationtokens`
    const body = {
      Username: 'dmc-test-user',
      Password: 'Init_cent12345',
      VaultGuid: 'A508E2D0-1A44-4D33-B7B7-92BEC9D85D70',
    }

    const response = await axios.post(path, body, axiosConfig)
    return response.data.Value
  }

  private async downloadPDF(
    token: string,
    q: string,
    p39: string,
    p1408: string,
    destination: Destination,
    axiosConfig: AxiosRequestConfig,
  ): Promise<Buffer> {
    const documentObject = await this.getObject(
      token,
      q,
      p39,
      p1408,
      destination,
      axiosConfig,
    )
    const documentObjectJson = JSON.parse(documentObject.toString('utf-8'))

    if (documentObjectJson.Items.length !== 1) {
      throw new HttpException(
        `${documentObjectJson.Items.length} documents found. Change workinstruction search parameter to find exactly one document.`,
        HttpStatus.BAD_REQUEST,
      )
    }
    const firstItem = documentObjectJson.Items[0]
    const version = firstItem.ObjVer.Version
    const objVerId = firstItem.ObjVer.ID
    const fileId = firstItem.Files.length > 0 ? firstItem.Files[0].ID : null

    const config: AxiosRequestConfig = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'X-Authentication': token,
      },
      responseType: 'arraybuffer',
    }
    const fileUrl = `${destination.url}/m-files/REST/objects/0/${objVerId}/${version}/files/${fileId}/content`
    const response = await axios.get(fileUrl, config)
    return response.data
  }

  private async getObject(
    token: string,
    q: string,
    p39: string,
    p1408: string,
    destination: Destination,
    axiosConfig: AxiosRequestConfig,
  ): Promise<Buffer> {
    const config: AxiosRequestConfig = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'X-Authentication': token,
      },
      params: {
        q: q,
        p39: p39,
        p1408: p1408,
      },
      responseType: 'arraybuffer',
    }
    var searchUrl = `${destination.url}/m-files/REST/objects`
    try {
      const response = await axios.get(searchUrl, config)
      return response.data
    } catch (error) {
      console.error(error)
      throw new HttpException(
        `Error in document search: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
