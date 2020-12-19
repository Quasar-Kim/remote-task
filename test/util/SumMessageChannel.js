import EventTarget from '@ungap/event-target'

function sum(x, y) {
  return x + y
}

// this class is only for testing and executed in node.js
// therefore EventTarget polyfill is used
export default class SumMessageChannel extends EventTarget {
  postMessage(request) {
    const response = {
      type: 'result',
      id: request.id,
      task: request.task,
    }

    switch (request.task) {
      case 'sum': {
        response.result = sum(...request.args)
      }
      default: {
        // throw here
      }
    }

    this.dispatchEvent({
      type: 'message',
      data: response
    })
  }
}