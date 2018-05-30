module.exports = rule

function rule (parsed) {
  if (Array.isArray(parsed) && parsed.length === 0) return []

  return combine(parsed.map(function (v) {
    return Array.isArray(v) ? rule(v).concat([[]]) : [[v]]
  }), function (a, b) { return a.concat(b) })
}

function combine (list, f) {
  var a = list.shift()
  var b = list.shift()
  if (b === undefined) return a
  var c = a.map(function (a) {
    return b.map(function (b) {
      return f(a, b)
    })
  })
    .reduce(function (a, b) { return a.concat(b) })

  return (list.length === 0 ? c : combine([c].concat(list), f))
}
