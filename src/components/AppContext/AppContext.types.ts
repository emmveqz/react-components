//

import type {
  Dispatch,
  SetStateAction,
} from 'react'

//

/**
 * @ToDo Define your global variables here.
 */
export type IAppProviderProps = {
  app: {
    language: number
  },
  theme: {
    color: string,
  },
}

export type IKeys = Extract<keyof IAppProviderProps, string>

export type IDispatcher<T extends IKeys> = Dispatch<SetStateAction<IAppProviderProps[T]>>

export type IAppContextProvider = {
  [key in IKeys]: () => [
    IAppProviderProps[key],
    IDispatcher<key>,
  ]
}

export type IStateRef = {
  [key in IKeys]: {
    dispatchers: IDispatcher<IKeys>[],
    lastVal: IAppProviderProps[IKeys],
  }
}
