//

/* eslint-disable no-console */

import React, {
  type FC,
} from 'react'
import {
  useAppContext,
} from '..'

//

export const DisplayPropApp: FC = () => {
  console.log('DisplayPropApp', Date.now())
  const appContext = useAppContext()

  const [
    app,
  ] = appContext.app()

  return (
    <div>
      <div>
        app.language:
        {app.language}
      </div>
    </div>
  )
}

export default DisplayPropApp
