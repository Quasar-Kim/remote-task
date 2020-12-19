import EventTarget from '@ungap/event-target'

export default class SumMessageChannel extends EventTarget {
  postMessage(message) {
    this.lastMessage = message
  }
}