//

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, {
  type Context,
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  IAppContextProvider,
  IDispatcher,
  IStateRef,
} from './AppContext.types'

export * from './example'

const whoIsMyDaddy = (): string|undefined => {
  try {
    throw new Error()
  } catch (e) {
    const allMatches = (e as Error)?.stack?.match(/(\w+)@|at (\w+) \(/g)
    const parentMatches = allMatches?.[1]?.match(/(\w+)@|at (\w+) \(/)

    return parentMatches?.[1] || parentMatches?.[2]
  }
}

//

const AppContext = createContext<IAppContextProvider<unknown>>(
  undefined as unknown as Record<string, unknown>,
)

//

export const AppProvider: <T extends Record<string, unknown>>(
  propsWithChildren: PropsWithChildren<{
    debug?: boolean,

    /**
     * Memoize this object.
     */
    props: T,
  }>,
) => JSX.Element = ({
  children,
  debug,
  props,
}) => {
  console.log('AppProvider', Date.now())
  type T = typeof props
  type IKeys = keyof T

  const states = useRef((Object.keys(props) as IKeys[])
    .reduce((result, key) => ({
      ...result,
      [key]: {
        dispatchers: [],
        lastVal: props[key],
      } as IStateRef<T>[IKeys],
    }), {} as IStateRef<T>))

  const providerValue = useMemo(() => (Object.keys(props) as IKeys[])
    .reduce((result, key) => ({
      ...result,
      [key]: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [state, setState] = useState(states.current[key].lastVal)
        const caller = debug && whoIsMyDaddy()

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const setState2 = useCallback<IDispatcher<T[IKeys]>>((newState) => {
          if (states.current[key].lastVal === newState) {
            return
          }

          let newValueReturned = false
          const isNewStateCallback = typeof newState === typeof (() => {})

          states.current[key].dispatchers.forEach((dispatcher) => {
            if (isNewStateCallback) {
              dispatcher((prevVal) => {
                if (newValueReturned) {
                  return states.current[key].lastVal
                }

                newValueReturned = true

                const newVal = (newState as (v: T[IKeys])
                  => T[IKeys])(prevVal)

                states.current[key].lastVal = newVal

                return newVal
              })
            } else {
              states.current[key].lastVal = newState as T[IKeys]
              dispatcher(newState)
            }
          })
        }, [
        ])

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          debug && console.log(`<${caller} />`, 'used stateKey:', key)
          states.current[key].dispatchers.push(setState)

          debug && console.log(
            'stateKey:',
            key,
            'dispatchers.length:',
            states.current[key].dispatchers.length,
          )

          return () => {
            debug && console.log(`<${caller} />`, 'unused stateKey:', key)

            const idx = states.current[key].dispatchers
              .findIndex((dispatcher) => dispatcher === setState);

            if (idx > -1) {
              states.current[key].dispatchers.splice(idx, 1)
            }

            debug && console.log(
              'stateKey:',
              key,
              'dispatchers.length:',
              states.current[key].dispatchers.length,
            )
          }

          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
        ])

        return [state, setState2]
      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), {} as IAppContextProvider<T>), [
    props,
  ])

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext<T>(): IAppContextProvider<T> {
  const context = useContext(AppContext as Context<IAppContextProvider<T>>)

  if (!context) {
    throw new Error('useAppContext() was used without an <AppProvider />')
  }

  return context
}
