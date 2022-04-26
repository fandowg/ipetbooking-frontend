import request from '@utils/request'

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
  updateState({ commit }, { productId, groupId, ids = [], state }) {
    return request.post(
      `/admin/product/${productId}/group/${groupId}/inventory/state`,
      {
        ids,
        state,
      }
    )
  },
  remove({ commit }, { productId, groupId, ids = [] }) {
    return request.post(
      `/admin/product/${productId}/group/${groupId}/inventory/remove`,
      {
        ids,
      }
    )
  },
  store({ commit }, { productId, groupId, storeData }) {
    return request.post(
      `/admin/product/${productId}/group/${groupId}/inventory/store`,
      storeData
    )
  },
  fetchList({ commit }, { productId, groupId, query }) {
    return request
      .post(
        `/admin/product/${productId}/group/${groupId}/inventory/search`,
        query
      )
      .then(({ items, pagination: { total } }) => {
        return {
          items,
          total,
        }
      })
  },
  updateGroupState({ commit }, { productId, ids = [], state }) {
    return request.post(`/admin/product/${productId}/group/stateInventories`, {
      ids,
      state,
    })
  },
  removeGroups({ commit }, { productId, ids = [] }) {
    return request.post(`/admin/product/${productId}/group/remove`, {
      ids,
    })
  },
  storeGroups({ commit }, { productId, submitData }) {
    return request.post(`/admin/product/${productId}/group/store`, {
      groups: submitData,
    })
  },
  fetchGroups({ commit }, { productId, query }) {
    return request
      .post(`/admin/product/${productId}/group/search`, query)
      .then(({ items, pagination: { total } }) => {
        return {
          items,
          total,
        }
      })
  },
}
