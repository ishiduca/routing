var xtend = require('xtend')
module.exports = find

function find (tree, paths) {
  var pathname = paths.shift() || '/'
  var childNode = tree[pathname]
  if (childNode != null) {
    if (Array.isArray(childNode)) {
      if (paths.length === 0) {
        return {values: childNode, params: {}}
      } else {
        return null
      }
    } else { // has child
      return find(childNode, paths)
    }
  } else {
    var wildcard = getWildcard(tree)
    if (wildcard == null) return null
    if (tree[wildcard] == null) throw new Error('Something wrong')
    var child = tree[wildcard]
    var params = {}; params[wildcard.slice(1)] = pathname
    if (Array.isArray(child)) {
      if (paths.length === 0) {
        return {values: child, params: params}
      } else {
        return null
      }
    } else {
      var a = find(child, paths)
      if (a != null) {
        params = mergeParams(params, a.params)
        return xtend(a, {params: params})
      } else {
        return null
      }
    }
  }
}

function mergeParams (a, b) {
  if (b == null) return xtend(a)
  return Object.keys(b).reduce(function (c, key) {
    c[key] = c[key] == null ? b[key] : [].concat(c[key]).concat(b[key])
    return c
  }, xtend(a))
}

function getWildcard (hash) {
  var keys = Object.keys(hash)
  var index = keys.map(function (s) { return s.slice(0, 1) }).indexOf(':')
  return (index !== -1) ? keys[index] : null
}
