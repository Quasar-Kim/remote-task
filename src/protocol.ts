export interface TaskMsg {
  sender: 'remote-task'
  id: number
  task: string
}

export interface TaskRequest extends TaskMsg {
  args: any[]
}

export interface TaskResult extends TaskMsg {
  type: 'result'
  result: any
}

export interface TaskError extends TaskMsg {
  type: 'error'
  error: Error
}

export type TaskResponse = TaskResult | TaskError
