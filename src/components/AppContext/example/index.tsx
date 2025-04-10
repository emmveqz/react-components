//

import React, {
  FC,
  useMemo,
} from 'react'
import {
  AppProvider,
} from '..'
import UpdateProps from './UpdateProps'
import type {
  IAppContext,
} from './types'

//

export const Example: FC = () => {
  const props = useMemo<IAppContext>(() => ({
    app: {
      language: 1,
    },
    theme: {
      color: `blue ${Date.now()}`,
    },
  }), [
  ])

  return (
    <AppProvider
      debug
      props={props}
    >
      <UpdateProps />
    </AppProvider>
  )
}

export default Example
