export default [
  {
    method: 'post',
    url: '/admin/product/search',
    functionName: 'search',
  },
  {
    method: 'get',
    url: '/admin/product/*',
    functionName: 'get',
  },
  {
    method: 'post',
    url: '/admin/product/state',
    functionName: 'updateState',
  },
  {
    method: 'post',
    url: '/admin/product/store',
    functionName: 'save',
  },
]
