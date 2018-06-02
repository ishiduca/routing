'use strict'
const test = require('tape')
const find = require('../find')

test('find: values | null = find(tree, paths)', t => {
  t.test('/', tt => {
    const paths = []
    const values = ['root']
    const tree = {'/': values}
    tt.deepEqual(find(tree, paths).values, values)
    tt.end()
  })

  t.test('/profile', tt => {
    const paths = ['profile']
    const values = ['profile']
    const tree = {'profile': values}
    tt.deepEqual(find(tree, paths).values, values)
    tt.end()
  })

  t.test('/(profile)', tt => {
    tt.test('/profile', t3 => {
      const paths = ['profile']
      const values = ['profile']
      const tree = {'profile': values, '/': values}
      t3.deepEqual(find(tree, paths).values, values)
      t3.end()
    })
    tt.test('/', t3 => {
      const paths = []
      const values = ['root']
      const tree = {'profile': values, '/': values}
      t3.deepEqual(find(tree, paths).values, values)
      t3.end()
    })
    tt.end()
  })

  t.test('/profile/page', tt => {
    tt.test('パスの深さとツリーの深さが一致', t3 => {
      const paths = ['profile', 'page']
      const values = ['profile_page']
      const tree = {profile: {page: values}}
      t3.deepEqual(find(tree, paths).values, values)
      t3.end()
    })
    tt.test('パスの深さの方がツリーの深さより深い', t3 => {
      const paths = ['profile', 'page', 'hoge']
      const tree = {profile: {page: ['dummy_values']}}
      t3.deepEqual(find(tree, paths), null, 'null')
      t3.end()
    })
    tt.end()
  })

  t.test('/profile/page/hoge', tt => {
    tt.test('パスの深さとツリーの深さが一致', t3 => {
      const paths = ['profile', 'page', 'hoge']
      const values = ['profile_page_hoge']
      const tree = {profile: {page: {hoge: values}}}
      t3.deepEqual(find(tree, paths).values, values)
      t3.end()
    })
    tt.test('パスの深さの方がツリーの深さより浅い', t3 => {
      const paths = ['profile', 'page']
      const values = ['profile_page']
      const tree = {profile: {page: {hoge: values}}}
      t3.deepEqual(find(tree, paths), null, 'null')
      t3.end()
    })
    tt.end()
  })

  t.test('/:user', tt => {
    const paths = ['nina']
    const values = ['nina simone']
    const tree = {':user': values}
    const expected = {values, params: {user: 'nina'}}
    tt.deepEqual(find(tree, paths), expected)
    tt.end()
  })

  t.test('/(:user)', tt => {
    const paths = ['nina']
    const values = ['nina simone']
    const tree = {'/': values, ':user': values}
    const expected = {values, params: {user: 'nina'}}
    tt.deepEqual(find(tree, paths), expected)
    tt.end()
  })

  t.test('/:user/:sub(/:sub)', tt => {
    const paths = ['nina', 'singer']
    const values = ['nina simone']
    const tree = {':user': {':sub': {'/': values, ':sub': values}}}
    const expected = {values, params: {user: 'nina', sub: 'singer'}}
    tt.deepEqual(find(tree, paths), expected)
    tt.end()
  })
  t.test('/:user/:sub(/:sub)', tt => {
    const paths = ['nina', 'singer', 'songer']
    const values = ['nina simone']
    const tree = {':user': {':sub': {'/': values, ':sub': values}}}
    const expected = {values, params: {user: 'nina', sub: ['singer', 'songer']}}
    tt.deepEqual(find(tree, paths), expected)
    tt.end()
  })

  t.test('/user(/:user_id/(profile))/(page)', tt => {
//    const rules = [
//      ['user', ':user_id', 'profile', 'page'],
//      ['user', ':user_id', 'profile'],
//      ['user', ':user_id', 'page'],
//      ['user', ':user_id'],
//      ['user', 'page'],
//      ['user']
//    ]
   const tree = {
    user: {
      page: ['page'],
      '/': ['root'],
      ':user_id': {
        profile: {
          page: ['Smith', 'profile', 'page'],
          '/': ['Smith', 'profile']
        },
        page: ['Smith', 'page'],
        '/': ['Smith']
      }
    }
   }

    tt.test('/user/Smith/profile/page', t3 => {
      const paths = ['user', 'Smith', 'profile', 'page']
      const expected = {
        values: ['Smith', 'profile', 'page'],
        params: {user_id: 'Smith'}
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user/Smith/profile', t3 => {
      const paths = ['user', 'Smith', 'profile']
      const expected = {
        values: ['Smith', 'profile'],
        params: {user_id: 'Smith'}
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user/Smith/page', t3 => {
      const paths = ['user', 'Smith', 'page']
      const expected = {
        values: ['Smith', 'page'],
        params: {user_id: 'Smith'}
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user/Smith', t3 => {
      const paths = ['user', 'Smith']
      const expected = {
        values: ['Smith'],
        params: {user_id: 'Smith'}
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user/page', t3 => {
      const paths = ['user', 'page']
      const expected = {
        values: ['page'],
        params: {}
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user', t3 => {
      const paths = ['user']
      const expected = {
        params: {},
        values: ['root']
      }
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/user/John/profile/page/hoge', t3 => {
      const paths = ['user', 'John', 'profile', 'page', 'hoge']
      const expected = null
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.test('/404NotFound', t3 => {
      const paths = ['404NotFound']
      const expected = null
      t3.deepEqual(find(tree, paths), expected)
      t3.end()
    })

    tt.end()
  })

  t.end()
})
