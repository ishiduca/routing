var xtend = require('xtend')
var parse = require('./parse')
var rule = require('./rule')

module.exports = Routing

function Routing () {
  if (!(this instanceof Routing)) return new Routing()
  this.routes = []
}

Routing.prototype.define = function (str) {
  var values = []
  for (var i = 1; i < arguments.length; i++) {
    values.push(arguments[i])
  }
  var node = {patterns: rule(parse(str)), values: values}
  this.routes.push(node)
  return node
}

Routing.prototype.match = function (str) {
  var paths = str.split('/').filter(Boolean)
  var result = null
  this.routes.some(function (node) {
    if (isEmpty(paths) && isEmpty(node.patterns)) {
      result = xtend(node, {params: {}})
      return true
    }

    return node.patterns.some(function (pattern) {
      if (paths.length !== pattern.length) return false

      var params = {}
      for (var i = 0; i < pattern.length; i++) {
        // if (paths[i] === undefined) return false
        if (pattern[i].slice(0, 1) === ':') {
          var key = pattern[i].slice(1)
          params[key] = (
            params[key] === undefined
              ? paths[i]
              : [].concat(params[key]).concat(paths[i])
          )
        } else if (pattern[i] !== paths[i]) {
          return false
        }
      }

      result = xtend(node, {params: params})
      return true
    })
  })
  return result == null ? null : result
}

function isEmpty (arry) {
  return Array.isArray(arry) && arry.length === 0
}
