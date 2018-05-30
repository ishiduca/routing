'use strict'
const url = require('url')
const http = require('http')
const bl = require('bl')
const router = require('../index')()

router.define('/user/:user_id(/:category)', {
  GET: (req, res, params, query) => {
    res.end(JSON.stringify(params))
  },
  POST: post((req, res, params, query, data) => {
    res.end(JSON.stringify(data))
  })
})

const app = http.createServer((req, res) => {
  const u = url.parse(req.url, true)
  const m = router.match(u.pathname)
  if (m == null) return notFound()

  const handler = m.values[0][req.method]
  if (handler == null) return methodNotAllowed()

  handler(req, res, m.params, u.query)

  function notFound () {
    res.statusCode = 400
    res.end(`not found "${u.pathname}"`)
  }

  function methodNotAllowed () {
    res.statusCode = 405
    res.end(`method not allowed "${req.method}"`)
  }
})

const PORT = process.env.PORT || 3939

app.listen(PORT, () => console.log(`start to listen on port - "${PORT}"`))

function post (onPost) {
  return (req, res, params, query) => {
    req.pipe(bl((err, raw) => {
      if (err) {
        res.statusCode = 500
        return res.end(String(err))
      }

      var str = String(raw)
      var data; try {
        data = JSON.parse(str)
      } catch (e) {
        res.statusCode = 400
        return res.end(JSON.stringify({
          error: {
            name: 'JSONParseError',
            message: 'can not JSON.parse',
            data: str
          }
        }))
      }
      onPost(req, res, params, query, data)
    }))
  }
}
