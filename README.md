# @ishiduca/routing

The underlying router for implementing your own router.

- its goal is only to `define` and `match` URLs.
- its does not handle methods, heaeders, controllers, views, etc., in anyway.


```js
const routing = require('@ishiduca/routing')
const router = routing()

const dashboard = {dashboard: true}
router.define('/dashboard(/:x/(:x))', dashboard)

const node = router.match('/dashboard/xyz/abc')
assert.deepEqual(node.values, [{dashboard: true}])
assert.deepEqual(node.params, {x: ['xyz', 'abc']})
```

## api

### const node = router.define(route[, ...args])

```js
const node = router.define('/user(/:user_id/(profile))/(page)', 1, 2, -1)
// {
//   values: [1, 2, -1]
// }
```

- `node` is a package that stored the defined route pattern and optional data.
- `route` is a definition of a route. this type is `string`.
- `...args` are optional datas. stored as an array in `node.values`.


### const matched = router.match(uriStr)

```js
router.define('/user(/:user_id/(profile))/(page)', 'GET', (req, res) => {...})
const matched = router.match('/user/Tony/profile')
// {
//   values: ['GET', (req, res) => {...}],
//   params: {user_id: 'Tony'}
// }

const unMatched = router.match('/product')
// unMatched === null
```

- `matched` if `uriStr` is matched pattern, then return __object__.
            if `uriStr` is not matched, then return __null__.


## an example of building a Router.

```js
const url = require('url')
const bl = require('bl')
const xtend = require('xtend')

function dispatch (req, res) {
  const u = url.parse(req.url, true)
  const match = router.match(u.pathname)
  if (match == null) return notFound(req, res)

  const methods = match.values[0]
  const hander = methods[req.methed]
  if (handler == null) return methodNotAllow(req, res)

  handler(req, res, match.params, u.query)
}

function post (f) {
  return (req, res, params, query) => {
    req.pipe(bl((err, raw) => {
      var str = String(raw)
      var data; try {
        data = JSON.parse(str)
      } catch (e) {
        ...
      }
      f(req, res, params, query, data)
    })
  }
}
```

```js
router.define('/user/:user_id(/:category)', {
  GET: (req, res, params, query) => {
    ...
  },
  POST: post((req, res, params, query, data) => {
    ...
  })
})
```


## license

The Apache License

Copyright &copy; 2018 ishiduca

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
