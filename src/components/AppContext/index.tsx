//

/* eslint-disable no-console */

import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  IAppContextProvider,
  IAppProviderProps,
  IDispatcher,
  IKeys,
  IStateRef,
} from './AppContext.types'

export * from './example'

//

const AppContext = createContext<IAppContextProvider>(undefined as unknown as IAppContextProvider)

//

export const AppProvider = ({
  children,
  ...props
}: PropsWithChildren<IAppProviderProps>) => {
  console.log('AppProvider', Date.now())

  const states = useRef((Object.keys(props) as IKeys[])
    .reduce((result, key) => ({
      ...result,
      [key]: {
        dispatchers: [],
        lastVal: props[key],
      } as IStateRef[IKeys],
    }), {} as IStateRef))

  const providerValue = (Object.keys(props) as IKeys[])
    .reduce((result, key) => ({
      ...result,
      [key]: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [state, setState] = useState(states.current[key].lastVal)

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const setState2 = useCallback<IDispatcher<IKeys>>((newState) => {
          if (states.current[key].lastVal === newState) {
            return
          }

          /*
          states.current[key].dispatchers.forEach((dispatcher) => dispatcher(newState))
          */

          const isNewStateCallback = typeof newState === typeof (() => {})

          states.current[key].dispatchers.forEach((dispatcher) => {
            if (isNewStateCallback) {
              dispatcher((prevVal) => {
                const newVal = (newState as (v: IAppProviderProps[IKeys])
                  => IAppProviderProps[IKeys])(prevVal)

                states.current[key].lastVal = newVal

                return newVal
              })
            } else {
              states.current[key].lastVal = newState as IAppProviderProps[IKeys]
              dispatcher(newState)
            }
          })
        }, [
        ])

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          console.log('useEffect | stateKey:', key)
          states.current[key].dispatchers.push(setState)

          return () => {
            console.log('unUseEffect | stateKey:', key)

            const idx = states.current[key].dispatchers
              .findIndex((dispatcher) => dispatcher === setState);

            if (idx > -1) {
              states.current[key].dispatchers.splice(idx, 1)
            }

            console.log(
              'stateKey:',
              key,
              'dispatchers.length:',
              states.current[key].dispatchers.length,
            )
          }
        }, [
        ])

        return [state, setState2]
      },
    }), {} as IAppContextProvider)

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): IAppContextProvider => {
  const context = useContext(AppContext)

  return context
}
