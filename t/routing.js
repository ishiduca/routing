'use strict'
const test = require('tape')
const Routing = require('../routing')

test('Routing', t => {
  t.test('constructor', tt => {
    tt.ok(new Routing(), 'route = new Routing()')
    tt.end()
  })
  t.test('function', tt => {
    tt.ok(Routing(), 'route = Routing()')
    tt.end()
  })
  t.end()
})

test('routing', t => {
  const r = Routing()
  r.define('/', 'root')
  r.define('/users/:user_name/articles', 'someone\'s', 'articles')
  r.define('/users/:user_name/profile', 'someone\'s profile')
  r.define('/users/own(/profile)', 'my profile')

  t.deepEqual(
    r.match('/users/own'),
    {params: {}, values: ['my profile']}
  )
  t.deepEqual(
    r.match('/users/ishiduca/profile'),
    {params: {user_name: 'ishiduca'}, values: ['someone\'s profile']}
  )
  t.deepEqual(
    r.match('/users/ishiduca/articles'),
    {params: {user_name: 'ishiduca'}, values: ['someone\'s', 'articles']}
  )
  t.deepEqual(
    r.match('/'),
    {params: {}, values: ['root']}
  )
  t.deepEqual(
    r.match('/unknown/route'),
    null
  )
  t.end()
})
