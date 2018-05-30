'use strict'
const test = require('tape')
const rule = require('../rule')

test('rule: patterns = rule(parsedArray)', t => {
  t.test('simple pattern', tt => {
    const parsed = [['profile']]
    const expected = [
      ['profile'], []
    ]
    tt.deepEqual(rule(parsed), expected, `rule(${JSON.stringify(parsed)})`)
    tt.end()
  })

  t.test('a little difficult pattern', tt => {
    const parsed = [':user_id', ['profile']]
    const expected = [
      [':user_id', 'profile'],
      [':user_id']
    ]
    tt.deepEqual(rule(parsed), expected, `rule(${JSON.stringify(parsed)})`)
    tt.end()
  })

  t.test('a pattern contains plural optional grammer', tt => {
    const parsed = ['user', [':user_id', ['profile']], ['page']]
    const expected = [
      ['user', ':user_id', 'profile', 'page'],
      ['user', ':user_id', 'profile'],
      ['user', ':user_id', 'page'],
      ['user', ':user_id'],
      ['user', 'page'],
      ['user']
    ]
    tt.deepEqual(rule(parsed), expected, `rule(${JSON.stringify(parsed)})`)
    tt.end()
  })
  t.end()
})
