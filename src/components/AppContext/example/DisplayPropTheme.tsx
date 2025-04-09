//

/* eslint-disable no-console */

import React, {
  type FC,
} from 'react'
import {
  useAppContext,
} from '..'

//

export const DisplayPropTheme: FC = () => {
  console.log('DisplayPropTheme', Date.now())
  const appContext = useAppContext()

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
