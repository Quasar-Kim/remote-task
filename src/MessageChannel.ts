export type MsgCallback = (event: MessageEvent | ErrorEvent) => void

export interface MessageChannel extends EventTarget {
  postMessage: (msg: any, transferList?: Transferable[]) => void
}
