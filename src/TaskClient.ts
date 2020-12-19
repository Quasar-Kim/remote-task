import { MessageChannel } from './MessageChannel'
import { TaskRequest, TaskResponse } from './protocol'

export default class TaskClient {
  private msgCount: number = 0

  constructor (readonly msgChannel: MessageChannel) {}

  private createID (): number {
    return this.msgCount++
  }

  run (task: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.createID()
      const request: TaskRequest = {
        sender: 'remote-task',
        id,
        args,
        task
      }

      const resolveResponse = (e: MessageEvent): void => {
        const response: TaskResponse = e.data
        if (request.id !== response.id) return

        this.msgChannel.removeEventListener('message', resolveResponse)

        if (response.type === 'result') {
          resolve(response.result)
        } else {
          reject(response.error)
        }
      }

      this.msgChannel.addEventListener('message', resolveResponse)
      this.msgChannel.postMessage(request)
    })
  }
}
