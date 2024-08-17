//

import type ITextField from '../TextField/TextField.types'

//

export type IFileProps = {
  Data?: Uint8Array,
  hasChanged?: boolean,
  Id: number,
  MimeSubtype: string,
  MimeType: string,
  Name: string,
  /**
   * In bytes.
   */
  Size: number,
}

export type INotification = {
  message: string,
  type:
    | 'error'
    | 'info'
    | 'warning'
  ,
}

export type IFileField = {
  acceptedMimeType?:
    | 'application'
    | 'audio'
    | 'font'
    | 'image'
    | 'text'
    | 'video'
  ,

  file?: IFileProps,

  getFileUrl?: (fileId: IFileProps['Id']) => Promise<string>,

  onNotification?: (notification: INotification) => void,

  /**
   * In bytes.
   */
  sizeLimit: number,
}
  & ITextField

export default IFileField
