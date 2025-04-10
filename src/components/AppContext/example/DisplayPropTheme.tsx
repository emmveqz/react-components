//

/* eslint-disable no-console */

import React, {
  type FC,
} from 'react'
import {
  useAppContext,
} from '..'
import type {
  IAppContext,
} from './types'

//

export const DisplayPropTheme: FC = () => {
  console.log('DisplayPropTheme', Date.now())
  const appContext = useAppContext<IAppContext>()

  const [
    theme,
  ] = appContext.theme()

  return (
    <div>
      <div>
        theme.color:
        {theme.color}
      </div>
    </div>
  )
}

export default DisplayPropTheme
