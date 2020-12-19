# remote-task
Use functions in remote environment easily. Intended to be used for web worker.

## Installation
```
npm i @quasar-kim/remote-task
```

## Example
The following example demonstrates calling funtion inside web worker in main thread.
```javascript
// main thread
import { TaskClient } from '@quasar-kim/remote-task'

const worker = new Worker('/path/to/worker')
const client = new TaskClient(worker)

const result = await client.run('sum', 1, 2)
console.log(result) // -> 3

// worker thread
import { TaskServer } from '@quasar-kim/remote-task'

const server = new TaskServer(self)
server.define('sum', (x, y) => x + y)
server.listen()
```

## API
This package mainly exports two classes: `TaskClient` and `TaskServer`.

Both classes accepts a `MessageChannel` interface(TODO: this name conflicts with native one) as a first parameter of a constructor. This can be `window`, `self`(worker), `Worker` or any object that impelments the interface.

`TaskClient` sends a message that requests task execution via provided message channel. When the task returns, it resolves the return value through `Promise`. If an error occurs, it rejects.

`TaskServer` listens for incoming task request and executes defined task, returning its return value or an error.

### `TaskClient`
#### `TaskClient(msgChannel: MessageChannel)`
Constructs a new TaskClient instance

#### `run(taskName: string, ...args: any[]): Promise<any>`
Run a given task and resolve(or reject) its return value as a promise.

### `TaskServer`
#### `define(taskName: string, taskFn: Function)`
Define a task.

#### `run(taskName, ...args: any[]): void`
Run a task with given args, then message `TaskResult` via a message channel. This function is rarely required.

#### `listen()`
Add a 'message' listener at a message channel object. This gets done using following code: `msgChannel.addEvnetListener('message', e => /* ... */)` 

