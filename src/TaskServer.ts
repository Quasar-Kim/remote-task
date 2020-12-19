import { MessageChannel } from './MessageChannel'
import { TaskRequest, TaskMsg, TaskResult, TaskError } from './protocol'

export default class TaskServer {
  public tasks: Map<string, Function> = new Map()

  constructor (readonly msgChannel: MessageChannel) {}

  define (taskName: string, fn: Function): void {
    this.tasks.set(taskName, fn)
  }

  listen (): void {
    // arrow function was utilized to keep 'this'
    this.msgChannel.addEventListener('message', (e: MessageEvent) => {
      if (e.data.sender !== 'remote-task') return
      const request: TaskRequest = e.data
      this.run(request)
    })
  }

  async run (request: TaskRequest): Promise<void> {
    const taskFn = this.tasks.get(request.task)
    const response: TaskMsg = {
      sender: 'remote-task',
      id: request.id,
      task: request.task
    }

    try {
      if (typeof taskFn === 'undefined') throw new Error(`Task function for task ${request.task} is not a function`)

      const taskResult: TaskResult = {
        ...response,
        type: 'result',
        result: await taskFn(...request.args)
      }
      this.msgChannel.postMessage(taskResult)
    } catch (err) {
      const taskError: TaskError = {
        ...response,
        type: 'error',
        error: err
      }
      this.msgChannel.postMessage(taskError)
    }
  }
}
