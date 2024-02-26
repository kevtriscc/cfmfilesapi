export interface MFilesUserInformation {
  Items: Array<{
    DisplayID: string
    ObjVer: {
      VersionType: string
      ID: string
      Version: string
      Type: string
    }
  }>
}

export interface DocumentObject {
  Items: Array<{
    DisplayID: string
    ObjVer: {
      VersionType: string
      ID: string
      Version: string
      Type: string
    }
  }>
}

export interface MFilesArrayType {
  [key: string]: string
}

export interface MFilesObjectType {
  data: {
    Items: MFilesArrayType[]
  }
}
