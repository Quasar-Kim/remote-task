import test from 'ava'
import EchoMessageChannel from '../util/EchoMessageChannel.js'
import SumMessageChannel from '../util/SumMessageChannel.js'
import FailingMessageChannel from '../util/FailingMessageChannel.js'
import { TaskClient } from '../build/index.js'

test.cb('send a task request without parameter', t => {
  const msgChannel = new EchoMessageChannel()
  const client = new TaskClient(msgChannel)

  msgChannel.addEventListener('message', ev => {
    t.is(ev.data.task, 'myFunc')
    t.end()
  })
  client.run('myFunc')
})

test.cb('send a task request with parameter', t => {
  const msgChannel = new EchoMessageChannel()
  const client = new TaskClient(msgChannel)
  const args = [1, 'string']

  msgChannel.addEventListener('message', ev => {
    t.deepEqual(ev.data.result, args)
    t.end()
  })
  client.run('myFunc', ...args)
})

test('resolve return value as a promise', async t => {
  const msgChannel = new SumMessageChannel()
  const client = new TaskClient(msgChannel)

  const result = await client.run('sum', 1, 2)
  t.is(result, 3)
})

test('reject error occured while executing task', async t => {
  const msgChannel = new FailingMessageChannel()
  const client = new TaskClient(msgChannel)

  const errorMsg = 'something useful message'
  const error = await t.throwsAsync(client.run('', new Error(errorMsg)))
  t.is(error.message, errorMsg)
})