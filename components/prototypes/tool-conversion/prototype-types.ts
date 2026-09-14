export type PrototypeState =
  | 'guest-ready'
  | 'login-open'
  | 'login-success'
  | 'submitting'
  | 'generating'
  | 'still-generating'
  | 'success'
  | 'failed-refunded'
  | 'insufficient-balance'

export type Variant = 'baseline' | 'optimized'
export type SourceStatus = 'carried' | 'empty' | 'replaced'

export type Scene = {
  id: string
  name: string
  description: string
  image: string
  result: string
  ratio: string
}

export type EventLog = { name: string; detail: string; time: string }
