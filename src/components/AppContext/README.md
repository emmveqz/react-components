
### AppContext

A Context Provider that can be consumed with a `useAppContext()` hook, updating its props (thus re-rendering) independently.

For a more thorough example: [./example/index.tsx](./example/index.tsx)

### Usage:

```typescript
import { useMemo } from 'react'
import {
  AppProvider,
  useAppContext,
} from '@emmveqz/react-components/components/AppProvider'

// This is a sample context.
type IAppContext = {
  app: {
    language: number
  },
  theme: {
    color: string,
  },
}

export const Root = () => {
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
    <AppProvider props={props}>
      <App />
    </AppProvider>
  )
}

export const App = () => {
  return (
    <div>
      <UpdateProps />
      <SomeOtherComponent />
    </div>
  )
}

export const UpdateProps = () => {
  const appContext = useAppContext<IAppContext>()

  const [
    app,
    setApp,
  ] = appContext.app()

  const updateProps = () => {
    setApp({
      language: app.language + 1,
    })
  }

  return (
    <div>
      <div>app.language: {app.language}</div>

      <div>
        <button type="button" onClick={updateProps}>
          update app.language
        </button>
      </div>
    </div>
  )
}
```
