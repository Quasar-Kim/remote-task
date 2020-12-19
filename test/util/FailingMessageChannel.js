import EventTarget from '@ungap/event-target'

// this class is only for testing and executed in node.js
// therefore EventTarget polyfill is used
export default class EchoMessageChannel extends EventTarget {
  postMessage(request) {
    const response = {
      type: 'error',
      id: request.id,
      task: request.task,
      error: request.args[0]
    }

    // TODO: write a reason
    setTimeout(() => {
      this.dispatchEvent({
        type: 'message',
        data: response
      })
    }, 0)
  }
}