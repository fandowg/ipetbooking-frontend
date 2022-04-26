import request from '@utils/request'

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
  getOrders({ commit }, couponId) {
    return request.get(`/admin/coupon/${couponId}/orders`)
  },
  validCode({ commit }, codeParams) {
    return request.get('/admin/coupon', {
      params: codeParams,
      errorHandle: false,
    })
  },
  checkCode({ commit }, {code, id}) {
    return request.get(`/admin/coupon/checkCode/${id ? `${code}?id=${id}`: code}`, {
      errorHandle: false,
    })
  },
  updateState({ commit }, { ids, state } = {}) {
    return request.post('/admin/coupon/state', { ids, state })
  },
  remove({ commit }, { ids }) {
    return request.post('/admin/coupon/remove', { ids })
  },
  store({ commit }, storeData) {
    return request.post('/admin/coupon/store', storeData)
  },
  fetchSingle({ commit }, couponId) {
    return request
      .get(`/admin/coupon/${couponId}`)
      .then((response) => response.items)
  },
  fetchList({ commit }, query) {
    return request
      .post('/admin/coupon/search', query)
      .then(({ items, pagination: { total } }) => {
        return {
          items,
          total,
        }
      })
  },
  sendCoupon({ commit }, query) {
    return request.post('/admin/coupon/send', query)
  }
}
