import { TaskServer } from '../build/index.js'

const server = new TaskServer(self)
server.define('sum', (x, y) => x + y)
server.define('wait', timeout => new Promise(resolve => {
  setTimeout(() => {
    resolve(`beep beep beep:${timeout}`)
  }, timeout);
}))

server.listen()