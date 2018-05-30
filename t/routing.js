'use strict'
const test = require('tape')
const Routing = require('../index')

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

test('routing.define: node = routing.define(patternStr, ...args)', t => {
  const r = Routing()

  t.test('routing.define("/", {dashboard: true}, true)', tt => {
    const node = r.define('/', {dashboard: true}, true)
    const patterns = []
    const values = [{dashboard: true}, true]
    const expected = {patterns, values}
    tt.deepEqual(node, expected, '{patterns: [], values: [{dashboard: true}, true]}')
    tt.end()
  })

  t.test('routing.define("/a(/b/(c))", ["foo"])', tt => {
    const node = r.define('/a(/b/(c))', ['foo'])
    const expectedPatterns = [
      ['a', 'b', 'c'],
      ['a', 'b'],
      ['a']
    ]
    const expectedValues = [['foo']]
    t.deepEqual(node.patterns, expectedPatterns, 'node.patterns')
    t.deepEqual(node.values, expectedValues, 'node.values')
    tt.end()
  })
  t.end()
})

test('routing.match: (node | null) = routing.match(pathStr)', t => {
  const r = Routing()
  const dashboard = {dashboard: true}
  const hoge = {unHoge: false}
  const foo1 = {foo: 'Foo'}
  const foo2 = {foo: 'BAR'}

  r.define('/', dashboard)
  r.define('/hoge(/:double/(:double))', hoge)
  r.define('/:foo', foo1, foo2)

  t.test('routing.match("/")', tt => {
    const expectedValues = [dashboard]
    const node = r.match('/')
    tt.deepEqual(node, {patterns: [], values: expectedValues, params: {}})
    tt.end()
  })

  t.test('routing.match("/hoge...")', tt => {
    const expectedPatterns = [
      ['hoge', ':double', ':double'],
      ['hoge', ':double'],
      ['hoge']
    ]
    const expectedValues = [hoge]

    tt.test('routing.match("/hoge")', tst => {
      const node = r.match('/hoge')
      const expectedParam = {}
      tst.deepEqual(node, {patterns: expectedPatterns, values: expectedValues, params: expectedParam})
      tst.end()
    })

    tt.test('routing.match(/hoge/one/two)', tst => {
      const node = r.match('/hoge/one/two')
      const expectedParam = {double: ['one', 'two']}
      tst.deepEqual(node, {patterns: expectedPatterns, values: expectedValues, params: expectedParam})
      tst.end()
    })

    tt.end()
  })

  t.test('routing.match("/isFoo")', tt => {
    const expectedValues = [foo1, foo2]
    const node = r.match('/isFoo')
    tt.deepEqual(node, {patterns: [[':foo']], values: expectedValues, params: {foo: 'isFoo'}})
    tt.end()
  })

  t.test('routing.match("/foo/bar")', tt => {
    const node = r.match('/foo/bar')
    tt.deepEqual(node, null)
    tt.end()
  })

  t.end()
})
