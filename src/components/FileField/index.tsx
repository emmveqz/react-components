//

import React, {
  FC,
  useCallback,
  useRef,
  useState,
} from 'react'
import FolderOpenIcon from '@mui/icons-material/FolderOpenRounded'
import GetAppIcon from '@mui/icons-material/GetAppRounded'
import HighlightOffIcon from '@mui/icons-material/HighlightOffRounded'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import type IProps from './FileField.types'
import TextField from '../TextField'

//

const FileField: FC<IProps> = ({
  acceptedMimeType,
  defaultValue,
  disabled,
  file: fileProp,
  getFileUrl,
  InputLabelProps,
  name,
  onChange,
  onNotification,
  sizeLimit,
  type,
  ...props
}) => {
  const textFieldRef = useRef<HTMLInputElement>(null)

  const [
    file,
    setFile,
  ] = useState<IProps['file']>(fileProp)

  const removeFileClickHandler = useCallback(() => {
    if (textFieldRef.current) {
      textFieldRef.current.value = ''
    }

    onNotification?.({
      message: 'Change will take effect after saving',
      type: 'info',
    })

    onChange?.({
      persist: () => {},
      target: {
        name,
        type,
        value: undefined,
      },
    })

    setFile(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onChange,
    onNotification,
  ])

  const downloadClickHandler = useCallback(async () => {
    const fileId = defaultValue as number || file?.Id

    if (!fileId || !getFileUrl) {
      return
    }

    const fullUrl = await getFileUrl(fileId)
    const link = globalThis.document.createElement('a')

    link.href = fullUrl
    link.rel = 'noopener'
    link.target = '_blank'
    link.click()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getFileUrl,
    file?.Id,
    defaultValue,
  ])

  const selectClickHandler = useCallback(() => {
    if (!sizeLimit) {
      onNotification?.({
        message: 'Undefined Size Limit',
        type: 'error',
      })

      return
    }

    const input = globalThis.document.createElement('input')
    input.type = 'file'

    if (acceptedMimeType) {
      input.accept = `${acceptedMimeType}/*`
    }

    let MimeSubtype: string
    let MimeType: string
    let Name: string
    const reader = new globalThis.FileReader()

    reader.addEventListener('loadend', (ev) => {
      const Data = ev.target?.result
        ? new Uint8Array(ev.target.result as ArrayBuffer)
        : undefined

      if (!Data) {
        return
      }

      if (textFieldRef.current) {
        textFieldRef.current.value = Name
      }

      const file2: NonNullable<IProps['file']> = {
        ...(file || {
          Id: defaultValue as number,
        }),
        hasChanged: true,
        Data,
        MimeSubtype,
        MimeType,
        Name,
        Size: Data.byteLength,
      }

      onNotification?.({
        message: 'Change will take effect after saving',
        type: 'info',
      })

      onChange?.({
        persist: () => {},
        target: {
          name,
          type,
          value: file2,
        },
      })

      setFile(file2)
    })

    input.addEventListener('change', (ev) => {
      const fileInput = (ev.target as HTMLInputElement|undefined)?.files?.item(0)

      if (!fileInput) {
        return
      }

      // eslint-disable-next-line prefer-destructuring
      MimeType = fileInput.type.split('/')[0]
      MimeSubtype = fileInput.type.split('/')[1] || ''
      Name = fileInput.name

      if (acceptedMimeType && acceptedMimeType !== MimeType) {
        onNotification?.({
          message: 'File type is not accepted',
          type: 'warning',
        })

        return
      }

      if (fileInput.size > sizeLimit) {
        const sizeLimitStr = sizeLimit < 1048576
          ? `${parseInt(sizeLimit / 1024 as unknown as string, 10)} KB`
          : `${parseInt(sizeLimit / 1024 / 1024 as unknown as string, 10)} MB`

        onNotification?.({
          message: `Size limit is: ${sizeLimitStr}`,
          type: 'warning',
        })

        return
      }

      reader.readAsArrayBuffer(fileInput)
    })

    input.click()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onChange,
    onNotification,
    defaultValue,
    file,
  ])

  return (
    <TextField
      {...props}
      defaultValue={file?.Name}
      disabled
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      inputRef={textFieldRef}
      name={name}
      type="text"
      endAdornment={(
        <>
          {!disabled && (!!defaultValue || !!file?.Id) && (
            <InputAdornment position="end">
              <Tooltip
                arrow
                placement="left"
                title="Remove File"
              >
                <IconButton
                  edge="end"
                  onClick={removeFileClickHandler}
                >
                  <HighlightOffIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )}

          <InputAdornment position="end">
            <Tooltip
              arrow
              placement="left"
              title="Download File"
            >
              <IconButton
                disabled={!defaultValue && !file?.Id}
                edge="end"
                onClick={downloadClickHandler}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>

          {!disabled && (
            <InputAdornment position="end">
              <Tooltip
                arrow
                placement="left"
                title="Select File"
              >
                <IconButton
                  edge="end"
                  onClick={selectClickHandler}
                >
                  <FolderOpenIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )}
        </>
      )}
    />
  )
}

export default FileField
