var xtend = require('xtend')

module.exports = tree
module.exports.buildTree = buildTree
module.exports.merge = merge

function tree (hash, rules, values) {
  return rules
    .map(function (rule) { return buildTree({}, rule, values) })
    .reduce(merge, hash)
}

function buildTree (hash, rule, values) {
  var a = rule.shift() || '/'
  if (rule.length === 0) hash[a] = values
  else hash[a] = buildTree({}, rule, values)
  return hash
}

function merge (a, b) {
  a || (a = {})
  b || (b = {})
  return Object.keys(a).concat(Object.keys(b)).reduce(function (c, key) {
    if (isarray(a[key]) && isarray(b[key])) {
      c[key] = a[key]
    } else if (isarray(a[key])) {
      c[key] = (b[key] == null) ? a[key] : xtend(b[key], {'/': a[key]})
    } else if (isarray(b[key])) {
      c[key] = (a[key] == null) ? b[key] : xtend(a[key], {'/': b[key]})
    } else {
      c[key] = merge(a[key], b[key])
    }

    return c
  }, {})
}

function isarray (a) { return Array.isArray(a) }
