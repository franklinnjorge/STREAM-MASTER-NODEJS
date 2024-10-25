import {
  expect,
  describe,
  it,
  jest
 } from '@jest/globals'

import CSVToNDJSON from '../../src/streamComponents/csvtondjson.js'
 
 describe('CSV to NDJSON test suite', () => {
  it('given a csv string it should return a ndjson string', () => {
    const csvString = `id,name,address\nid01,franklin,36whitleyAve\n`
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id','name','address']
    })

    const expected = JSON.stringify({
      id: 'id01',
      name: 'franklin',
      address: '36whitleyAve'
    })

    const fn = jest.fn()

    csvToJson.on('data', fn)
    csvToJson.write(csvString)
    csvToJson.end()
    
    const [current] = fn.mock.lastCall
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected))
  })
  it('it should work with strings that doesnt contains breaklines at the end', () => {
    const csvString = `id,name,address\nid01,franklin,36whitleyAve`
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id','name','address']
    })

    const expected = JSON.stringify({
      id: 'id01',
      name: 'franklin',
      address: '36whitleyAve'
    })

    const fn = jest.fn()

    csvToJson.on('data', fn)
    csvToJson.write(csvString)
    csvToJson.end()
    
    const [current] = fn.mock.lastCall
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected))
  }) 
  it('it should work with files that has breaklines in the begging in of the string', () => { 
    const csvString = `\n\n\n\nid,name,address\n\n\n\n\nid01,franklin,36whitleyAve\n\n\n\n\nid02,jorge,129Malamir`
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id','name','address']
    })

    const expected = [JSON.stringify({
      id: 'id01',
      name: 'franklin',
      address: '36whitleyAve'
    }),
    JSON.stringify({
      id: 'id02',
      name: 'jorge',
      address: '129Malamir'
    })]

    const fn = jest.fn()

    csvToJson.on('data', fn)
    csvToJson.write(csvString)
    csvToJson.end()
    
    const [firstCall] = fn.mock.calls[0]
    const [secondCall] = fn.mock.calls[1]
    expect(JSON.parse(firstCall)).toStrictEqual(JSON.parse(expected[0]))
    expect(JSON.parse(secondCall)).toStrictEqual(JSON.parse(expected[1]))
  })
 })