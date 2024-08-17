//

import type {
  CSSProperties,
  ReactNode,
  RefObject,
} from 'react'
import type {
  IFuncArgs,
} from './utils'

//

type IHandleChangeEvent = {
  persist(): void,
  target: {
    checked?: boolean,
    fieldError?: string,
    name?: string,
    type?: string,
    value: unknown,
  },
}

type IChangeHandler = (ev: IHandleChangeEvent) => void

//

export type ICommonField<T extends Record<string, unknown> = Record<string, unknown>> = {
  name: Extract<keyof T, string>,
  className?: string,
  tabIndex: number,
  fullWidth: boolean,
  label: string,
  disabled?: boolean,
  inputRef?: RefObject<
    | HTMLInputElement
    | HTMLSelectElement
  >,
  margin: 'dense',
  onChange?: (ev: IFuncArgs<IChangeHandler>[0], extraArg?: ReactNode) => void,
  size?:
    | 'medium'
    | 'small'
  ,
  style?: CSSProperties,
}
