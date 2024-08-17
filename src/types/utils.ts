//

export type IFuncArgs<T> = T extends (...args: infer A) => unknown ? A : never

export type OmitProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
