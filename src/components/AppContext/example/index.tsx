//

import React, {
  FC,
} from 'react'
import {
  AppProvider,
} from '..'
import UpdateProps from './UpdateProps'

//

export const Example: FC = () => {
  return (
    <AppProvider
      app={{
        language: 1,
      }}
      theme={{
        color: `blue ${Date.now()}`,
      }}
    >
      <UpdateProps />
    </AppProvider>
  )
}

export default Example
