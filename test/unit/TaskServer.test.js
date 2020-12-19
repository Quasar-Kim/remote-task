import test from 'ava'
import MockMessageChannel from '../util/MockMessageChannel.js'
import { TaskServer } from '../build/index.js'

test('define a task', t => {
  const msgChannel = new MockMessageChannel()
  const server = new TaskServer(msgChannel)
  const myFn = () => {}
  server.define('myTask', myFn)

  t.true(server.tasks.has('myTask'))
  t.is(server.tasks.get('myTask'), myFn)
})

test.cb('listen to a task request', t => {
  const msgChannel = new MockMessageChannel()
  const server = new TaskServer(msgChannel)
  server.run = () => t.end()

  server.listen()
  msgChannel.dispatchEvent({
    type: 'message',
    data: {
      sender: 'remote-task'
    }
  })
})

test('run sync task', async t => {
  t.plan(2)

  const msgChannel = new MockMessageChannel()
  const server = new TaskServer(msgChannel)
  server.define('myTask', x => {
    t.is(x, 1)
    return 2
  })
  await server.run({
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    args: [1]
  })
  
  t.deepEqual(msgChannel.lastMessage, {
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    type: 'result',
    result: 2
  })
})

test('run async task', async t => {
  t.plan(2)

  const msgChannel = new MockMessageChannel()
  const server = new TaskServer(msgChannel)
  server.define('myTask', x => {
    t.is(x, 1)
    return new Promise(resolve => {
      setTimeout(() => resolve(2), 0)
    })
  })
  await server.run({
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    args: [1]
  })
  
  t.deepEqual(msgChannel.lastMessage, {
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    type: 'result',
    result: 2
  })
})

test('report if error occures while executing task', async t => {
  const msgChannel = new MockMessageChannel()
  const server = new TaskServer(msgChannel)

  const err = new Error('totally intentional error')
  server.define('myTask', () => {
    throw err
  })
  await server.run({
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    args: [1]
  })
  
  t.deepEqual(msgChannel.lastMessage, {
    sender: 'remote-task',
    id: 0,
    task: 'myTask',
    type: 'error',
    error: err
  })
})
