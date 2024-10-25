//for i in `seq 1 100`; do node -e "process.stdout.write('$i-hello world\n')" >> Text.txt; done

import { readFile } from 'fs/promises'

const data = (await readFile('./Text.txt')).toString().split('\n')
const LINES_PER_INTERACTION = 10
const interactions = data.length / LINES_PER_INTERACTION
let page = 0

for (let index = 1; index < interactions; index++) {
  const chunk = data.slice(page, page += LINES_PER_INTERACTION).join('\n')

  const buffer = Buffer.from(chunk)

  const amountOfBytes = buffer.byteOffset
  const bufferData = buffer.toString().split('\n')
  const amountOfLines = bufferData.length

  console.log('processing', bufferData, `lines: ${amountOfLines}, bytes: ${amountOfBytes}`)

}


