//

export type IAsyncEffect = {
  cleanup?: () => void,
  onUpdate: (signal: AbortSignal) => PromiseLike<void>,
}

export type IAsyncEffectGetter = () => IAsyncEffect
