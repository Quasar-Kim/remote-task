import { TaskClient } from '../build/index.js'
// expect is a cjs module, therefore it can't be used directly on browser
// jspm.dev transform it into es module
import expect from 'https://jspm.dev/expect'

function createWorker() {
  // web-test-runner doesn't support relative url in manual debug mode :(
  return new Worker('http://localhost:9719/test/integration/worker.js', {
    type: 'module'
  })
}

describe('worker to window', () => {
  it('should run synchronous task', async () => {
    const worker = createWorker()
    const client = new TaskClient(worker)
    // sum() is defined in worker.js
    const result = await client.run('sum', 1, 2)

    expect(result).toBe(3)
  })

  it('should run async task', async () => {
    const worker = createWorker()
    const client = new TaskClient(worker)
    // wait() is defined in worker.js
    const result = await client.run('wait', 10)

    expect(result).toBe('beep beep beep:10')
  })

  it('should report error as promise reject', async () => {
    const worker = createWorker()
    const client = new TaskClient(worker)
    // purge() is undefined
    const runPromise = client.run('purge')
    await expect(runPromise).rejects.toThrow()
  })
})