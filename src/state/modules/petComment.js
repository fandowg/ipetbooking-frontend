import request from '@utils/request'

export const state = {
  // cached: [],
}

export const getters = {}

export const mutations = {
  // CACHE_STAFFS(state, currentStaffs) {
  //   state.cached = currentStaffs
  // },
}

export const actions = {
  store({ commit }, storeData) {
    return request.post('/admin/comment/store', storeData)
  },
  fetchList({ commit },query ) {
    return request.post('/admin/comment/search',query).then((response) => {
      return response.items
      // commit('CACHE_STAFFS', staffs)

    })
  },
  sendComment({ commit },{ uuid } ) {
    return request.post('/admin/comment/send',{ uuid })
  },
  getLink({ commit },{ uuid } ) {
    return request.get(`/admin/comment/${uuid}/shortUrl`).then((response) => {
      // console.log(response)
      return response
      // commit('CACHE_STAFFS', staffs)

    })
  },
  
}
