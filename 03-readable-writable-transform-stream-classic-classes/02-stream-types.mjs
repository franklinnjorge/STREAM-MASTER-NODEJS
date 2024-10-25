import { randomUUID } from 'node:crypto'
import {
  Readable,
  Writable,
  Transform
} from 'node:stream'

import { createWriteStream } from 'node:fs'

const readable = Readable({
  read() {

    for(let index = 0; index < 1e6; index++) {
      const person = {id: randomUUID(),name: `Franklin-${index}`,
      }
      const data = JSON.stringify(person)
      this.push(data)
    }
    this.push(null)
  }
})

const mapFields = Transform({
  transform(chunk, enc, cb){
    const data = JSON.parse(chunk)
    const result = `${data.id}, ${data.name.toUpperCase()}\n`
    cb(null, result)
  }
})

const mapHeaders = Transform({
  transform(chunk, enc, cb){
    this.counter = this.counter ?? 0;
    
    if (this.counter) {
      return cb(null, chunk)
    }
    this.counter += 1
    cb(null, 'id,name\n'.concat(chunk))
  }
})


const pipeline = readable
  .pipe(mapFields)
  .pipe(mapHeaders)
  .pipe(createWriteStream('my.csv'))

  pipeline
    .on('end', () => console.log('task finished...'))
  //.pipe(process.stdout)
