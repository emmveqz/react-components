//

/* eslint-disable no-plusplus */

import {
  useEffect,
  useRef,
} from 'react'
import type {
  IAsyncEffect,
  IAsyncEffectGetter,
} from './useAsyncEffect.types'

//

const useAsyncEffect = (
  asyncEffectGetter: IAsyncEffectGetter,
  dependencies: Array<unknown>,
): void => {
  const updates = useRef<Array<{
    controller: AbortController,
    func: IAsyncEffect['onUpdate'],
  }>>([])

  useEffect(() => {
    const {
      cleanup,
      onUpdate,
    } = asyncEffectGetter()

    updates.current.push({
      controller: new AbortController(),
      func: onUpdate,
    })

    const runUpdates = () => {
      updates.current[0]?.func(updates.current[0].controller.signal).then(() => {
        updates.current.shift()
        runUpdates()
      })
    }

    if (updates.current.length === 1) {
      runUpdates()
    }

    return () => {
      const count = updates.current.length - 1

      for (let i = 0; i < count; i++) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        updates.current[i].controller.abort()
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      updates.current.splice(0, count)

      cleanup?.()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useAsyncEffect
