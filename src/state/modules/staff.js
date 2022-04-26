import request from '@utils/request'

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {
  CACHE_STAFFS(state, currentStaffs) {
    state.cached = currentStaffs
  },
}

export const actions = {
  store({ commit }, storeData) {
    return request.post('/admin/staff/store', storeData)
  },
  fetchList({ commit }) {
    return request.post('/admin/staff/search').then((response) => {
      const staffs = response.items
      commit('CACHE_STAFFS', staffs)
      return staffs
    })
  },
}
