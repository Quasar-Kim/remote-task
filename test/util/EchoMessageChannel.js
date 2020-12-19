import EventTarget from '@ungap/event-target'

// this class is only for testing and executed in node.js
// therefore EventTarget polyfill is used
export default class EchoMessageChannel extends EventTarget {
  postMessage(request) {
    const result = {
      type: 'result',
      id: request.id,
      task: request.task,
      result: request.args
    }

    // TODO: write a reason
    setTimeout(() => {
      this.dispatchEvent({
        type: 'message',
        data: result
      })
    }, 0)
  }
}