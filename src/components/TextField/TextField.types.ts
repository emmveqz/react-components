//

import type {
  FC,
  HTMLAttributes,
  ReactNode,
  RefCallback,
} from 'react'
import type {
  TextFieldProps,
} from '@mui/material/TextField'
import type {
  ICommonField,
} from '@/types/ICommonField'
import type {
  OmitProp,
} from '@/types/utils'

//

export interface IInputComponentProps<T = HTMLElement> extends HTMLAttributes<
  | HTMLInputElement
  | HTMLTextAreaElement
> {
  inputRef?: RefCallback<T>,
}

export type ITextField<T = HTMLElement> = {
  endAdornment?: ReactNode,
  inputComponent?: FC<IInputComponentProps<T>>,
  startAdornment?: ReactNode,
}
  & OmitProp<TextFieldProps, keyof ICommonField>
  & ICommonField

export default ITextField
