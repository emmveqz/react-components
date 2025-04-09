//

/* eslint-disable no-console */

import React, {
  type FC,
} from 'react'
import {
  useAppContext,
} from '..'
import DisplayPropApp from './DisplayPropApp'
import DisplayPropTheme from './DisplayPropTheme'

//

export const UpdateProps: FC = () => {
  console.log('UpdateProps', Date.now())
  const appContext = useAppContext()

  const [
    app,
    setApp,
  ] = appContext.app()

  const [
    ,
    setTheme,
  ] = appContext.theme()

  const updateProps = () => {
    if (app.language < 3) {
      setApp({
        language: app.language + 1,
      })
    } else {
      setTheme({
        color: `blue ${Date.now()}`,
      })
    }
  }

  return (
    <div>
      {app.language < 3 && <DisplayPropApp />}
      <br />
      <div>
        <button type="button" onClick={updateProps}>
          app.language:
          {app.language}
        </button>
      </div>
      <br />
      {app.language > 2 && <DisplayPropTheme />}
    </div>
  )
}

export default UpdateProps
