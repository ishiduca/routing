'use strict'
const test = require('tape')
const tree = require('../tree')

test('newHash = tree(orgHash, rulesArray, values)', t => {
  t.test('/', tt => {
    const rules = [
      []
    ]
    const values = ['root']
    const expected = {'/': values}
    tt.deepEqual(tree({}, rules, values), expected, '{"/": ["root"]}')
    tt.end()
  })

  t.test('/profile', tt => {
    const rules = [
      ['profile']
    ]
    const values = ['/profile']
    const expected = {profile: values}
    tt.deepEqual(tree({}, rules, values), expected, '{profile: ["/profile"]')
    tt.end()
  })

  t.test('/profile or /', tt => {
    const rules = [
      ['profile'],
      []
    ]
    const values = ['/profile']
    const expected = {'/': values, profile: values}
    tt.deepEqual(tree({}, rules, values), expected, '{profile: ["/profile"], "/": ["/profile"]}')
    tt.end()
  })

  t.test('/profile/page', tt => {
    const rules = [
      ['profile', 'page']
    ]
    const values = ['/profile/page']
    const expected = {
      profile: {page: values}
    }
    tt.deepEqual(tree({}, rules, values), expected, '{profile: {page: ["/profile/page"]}}')
    tt.end()
  })

  t.test('/user(/:user_id)/(page)', tt => {
    const rules = [
      ['user', ':user_id', 'page'],
      ['user', ':user_id'],
      ['user', 'page'],
      ['user']
    ]
    const values = ['user', [':user_id'], ['page']]
    const expected = {
      user: {
        page: values,
        ':user_id': {
          page: values,
          '/': values
        },
        '/': values
      }
    }
    tt.deepEqual(tree({}, rules, values), expected, 'ok')
    tt.end()
  })

  t.test('override', tt => {
    const rules = [
      ['user', ':user_id', 'page'],
      ['user', ':user_id'],
      ['user', 'page'],
      ['user']
    ]
    const values = [
      ['user_user_id_page'],
      ['user_user_id'],
      ['user_page'],
      ['user']
    ]
    const expected = {
      user: {
        page: values[2],
        ':user_id': {
          page: values[0],
          '/': values[1]
        },
        '/': values[3]
      }
    }
    const result = rules.reduce((hash, rule, i) => tree(hash, [rule], values[i]), {})
    tt.deepEqual(result, expected, JSON.stringify(result))
    tt.end()
  })

  t.end()
})
