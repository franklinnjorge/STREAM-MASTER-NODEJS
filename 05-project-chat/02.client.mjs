import net from 'node:net'
import readline from 'node:readline'
import { PassThrough, Writable } from 'node:stream'

function log(message) {
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(message)
}

const resetChatAfterSend = PassThrough()
resetChatAfterSend.on('data', _ => {
  log(`type: `)
})

const output = Writable({
  write(chunk, enc, callback) {
    const {
      id,
      message
    } = JSON.parse(chunk)

    if (message) {
      log(`reply from ${id}: ${message}`)
    }
    else {
      console.log(`my username: ${id}\n`)
    }

    log(`type: `)
    callback(null, chunk)
  }
})

process.stdin
.pipe(resetChatAfterSend)
.pipe(net.connect(3000))
.pipe(output)