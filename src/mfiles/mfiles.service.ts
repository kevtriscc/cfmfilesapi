import { Injectable } from '@nestjs/common';
import { getDestinationFromDestinationService } from '@sap-cloud-sdk/connectivity';
import axios from 'axios';

@Injectable()
export class MfilesService {
  async authTest(): Promise<string> {
    const destToMFiles = await getDestinationFromDestinationService({
      destinationName: 'DestinationToMFilesAPI',
    });

    // const config = {
    //   headers: {
    //     ...destToMFiles.proxyConfiguration.headers,
    //   },
    //   proxy: {
    //     host: destToMFiles.proxyConfiguration.host,
    //     port: destToMFiles.proxyConfiguration.port,
    //   },
    // };

    const { url: targetUrl } = destToMFiles;
    // const vaultGuid = `C774160-B0F3-4EFF-879D-451A8934377E`;
    // let path = `${targetUrl}/WebServiceSSO.aspx?popup=1&vault=${vaultGuid}`;

    try {
      const config = {
        headers: {
          ...destToMFiles.proxyConfiguration.headers,
        },
        proxy: {
          host: destToMFiles.proxyConfiguration.host,
          port: destToMFiles.proxyConfiguration.port,
        },
      };

      await axios.get(
        `${targetUrl}/REST/server/authenticationprotocols.aspx`,
        config,
      );

      // const response = await axios.post(path, null, config);
      // // handle response
      // console.log(response.data);
      // path = '';
      debugger;
    } catch (error) {
      // handle error
      debugger;
      console.error(error);
    }

    return '';

    // return axios
    //   .post(path, null, config)
    //   .then((response) => {
    //     console.log('Worked _callOnPrem');
    //     path = '';
    //     return response.data;
    //   })
    //   .catch((error) => {
    //     console.error('Failed: _callOnPrem');
    //     console.error(error);
    //     debugger;
    //   });
  }

  async auth(): Promise<string> {
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

    return axios
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
