module.exports = parse

function parse (pathStr) {
  return help(tokenize(pathStr))

  function help (tokens) {
    var a = []
    var t
    while ((t = tokens.shift()) !== undefined) {
      if (t === '(') {
        a.push(help(tokens))
      } else if (t === ')') {
        return a
      } else {
        a.push(t)
      }
    }
    return a
  }
}

function tokenize (pathStr) {
  return pathStr
    .split('/')
    .filter(Boolean)
    .map(map('('))
    .reduce(concat, [])
    .map(map(')'))
    .reduce(concat, [])
    .filter(Boolean)

  function map (c) {
    return function (s) {
      return s.split(c).map(function (s) {
        return s === '' ? c : s
      })
    }
  }

  function concat (a, b) { return a.concat(b) }
}
