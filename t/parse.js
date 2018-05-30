'use strict'
const test = require('tape')
const parse = require('../parse')

test('parse: parsedArray = parse(patternStr)', t => {
  const testStr = '/user(/:user_id/(profile))/(page)'

  t.test(`parse(${testStr})`, tt => {
    const expected = ['user', [':user_id', ['profile']], ['page']]
    tt.deepEqual(parse(testStr), expected, "['user', [':user_id', ['profile']], ['page']]")
    tt.end()
  })
  t.end()
})
