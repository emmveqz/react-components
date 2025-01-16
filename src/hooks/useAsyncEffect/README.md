# useAsyncEffect

Use React's `useEffect` hook asynchronously (safely).

### Usage:

```typescript
import React, {
  FC,
  useCallback,
  useState,
} from 'react'
import useAsyncEffect from '@/hooks/useAsyncEffect'
import type {
  IAsyncEffectGetter,
} from '@/hooks/useAsyncEffect/useAsyncEffect.types'

//

const Sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

const TestAsyncEffect: FC = () => {
  const [
    dependentState,
    setDependentState,
  ] = useState('')

  const [
    testCounter,
    setTestCounter,
  ] = useState(0)

  const dependencies = [
    testCounter,
  ]

  const asyncEffectGetter = useCallback<IAsyncEffectGetter>(() => {
    return {
      cleanup: () => {
        // Reset some settings.
      },
      onUpdate: async (signal) => {
        await Sleep(3000)

        try {
          const response = await globalThis.fetch('http://localhost:8000', {
            signal,
          })

          console.info('fetch', testCounter, 'fullfilled')
        }
        catch (ex) {
          console.info('fetch', testCounter, 'exception', (ex as Error).message)
        }

        if (signal.aborted) {
          console.error('testCounter', testCounter, 'aborted')

          // Just exit here.
          return
        }

        console.info('testCounter', testCounter, 'fullfilled')
        setDependentState(new Date().toLocaleTimeString())
      },
    }
  }, dependencies)

  useAsyncEffect(
    asyncEffectGetter,
    dependencies,
  )

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setTestCounter((prev) => (prev + 1))
          }}
        >
          Test Counter:&nbsp;
          {
            testCounter
          }
        </button>
      </div>

      <div>
        Dependent state:&nbsp;
        {
          dependentState
        }
      </div>
    </div>
  )
}
```

![useAsyncEffect](./screenshot.gif)