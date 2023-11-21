import { Injectable } from '@nestjs/common';
import { getDestinationFromDestinationService } from '@sap-cloud-sdk/connectivity';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async testMFiles() {
    const destToMFiles = await getDestinationFromDestinationService({
      destinationName: 'DestinationToMFilesAPI',
    });

    const config = {
      headers: {
        ...destToMFiles.proxyConfiguration.headers,
      },
      proxy: {
        host: destToMFiles.proxyConfiguration.host,
        port: destToMFiles.proxyConfiguration.port,
      },
    };

    const { url: targetUrl } = destToMFiles;
    const path = `${targetUrl}/m-files/REST/server/authenticationtokens`;
    const body = {
      Username: 'DMC_ReadOnly_User',
      Password: 'Init_cent12345',
      VaultGuid: 'C774160-B0F3-4EFF-879D-451A8934377E',
    };

    axios
      .post(path, body, config)
      .then((response) => {
        console.log('Worked _callOnPrem');
        return response.data;
      })
      .catch(() => {
        console.error('Failed: _callOnPrem');
        debugger;
      });
  }
}
