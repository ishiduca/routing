var xtend = require('xtend')
var parse = require('./parse')
var rule = require('./rule')
var tree = require('./tree')
var find = require('./find')

module.exports = Routing

function Routing () {
  if (!(this instanceof Routing)) return new Routing()
  this.routes = {}
}

Routing.prototype.define = function (str) {
  var values = []
  for (var i = 1; i < arguments.length; i++) {
    values.push(arguments[i])
  }
  var node = {values: values}
  this.routes = tree(this.routes, rule(parse(str)), [node])
  return node
}

Routing.prototype.match = function (str) {
  var result = find(this.routes, str.split('/').filter(Boolean))
  return result == null
    ? null
    : xtend(result, {values: remap(result.values)})

  function remap (vs) {
    return vs.reduce(function (arry, m) { return arry.concat(m.values) }, [])
  }
}
