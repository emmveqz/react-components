//

import type {
  Dispatch,
  SetStateAction,
} from 'react'

//

/**

export type IKeys = Extract<keyof IAppProviderProps, string>
*/

export type IDispatcher<T> = Dispatch<SetStateAction<T>>

export type IAppContextProvider<T> = {
  [key in (keyof T)]:
    /**
     * This is a react-hook function. Call it accordingly.
     */
    () => [
      T[key],
      IDispatcher<T[key]>,
    ]
}

export type IStateRef<T> = {
  [key in (keyof T)]: {
    dispatchers: IDispatcher<T[key]>[],
    lastVal: T[key],
  }
}
