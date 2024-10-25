import { Duplex, PassThrough, Writable } from 'stream'
import { createReadStream, createWriteStream} from 'node:fs'

import { randomUUID } from 'crypto'

const consumers = [randomUUID(), randomUUID()]
.map(id => {
  return Writable({
    write(chunk, enc, callback){
      console.log(`${id} bytes: ${chunk.length} | receiving a message at: ${new Date().toISOString()}`)
      callback(null, chunk)
    }
  })
})

const onData = (chunk) => {
  consumers.forEach((consumer, index) => {

    // check if the consumer is still alive
    if (consumer.writableEnd) {
      delete consumers[index]
      return
    }

    consumer.write(chunk)
  })
}

const broadCast = PassThrough()
broadCast.on('data', onData)

const stream = Duplex.from({
  readable: createReadStream('./big.file'),
  writable: createWriteStream('./output.txt'),
})

stream
  .pipe(broadCast)
  .pipe(stream)