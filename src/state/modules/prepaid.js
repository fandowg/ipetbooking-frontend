import request from '@utils/request'

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
  simpleExport({
      commit
    }, exportParams) {
    return request
      .post('/admin/prepaid/order/export/simple', exportParams)
      .then((response) => response.items)
  },
    cancelOrder({
        commit
    }, {
        orderId,
        cancelData
    }) {
        // orderId, note, refundValue
        return request.post(`admin/prepaid/order/${orderId}/cancel`, cancelData)
    },
    storeOrder({
        commit
    }, storeData) {
        return request.post('/admin/prepaid/order/store', storeData)
    },
    fetchOrderSingle({
        commit
    }, orderId) {
        return request
            .get(`/admin/prepaid/order/${orderId}`)
            .then((response) => response.items)
    },
    fetchOrders({
        commit
    }, query) {
        return request
            .post('/admin/prepaid/order/search', query)
            .then(({
                items,
                pagination: {
                    total
                }
            }) => {
                return {
                    items,
                    total,
                }
            })
    },
    updateState({
        commit
    }, {
        ids,
        state
    } = {}) {
        return request.post('/admin/prepaid/state', {
            ids,
            state
        })
    },
    remove({
        commit
    }, {
        ids
    }) {
        return request.post('/admin/prepaid/remove', {
            ids
        })
    },
    removeGroup({
        commit
    }, {
        groupOrderings
    }) {
        return request.post('/admin/prepaid/group/remove', {
          groupOrderings
        })
    },

    store({
        commit
    }, storeData) {
        return request.post('/admin/prepaid/store', storeData)
    },
    storeGroup({
        commit
    }, storeData) {
        return request.post('/admin/prepaid/group/store', storeData)
    },
    fetchSingle({
        commit
    }, prepaidId) {
        return request
            .get(`/admin/prepaid/${prepaidId}`)
            .then((response) => response.items)
    },
    fetchSingleGroup({
        commit
    }, groupOrdering) {
        return request
            .post(`/admin/prepaid/group`,{groupOrdering:groupOrdering})
            .then((response) => response.items)
    },
    fetchList({
        commit
    }, query) {
        return request
            .post('/admin/prepaid/search', query)
            .then(({
                items,
                pagination: {
                    total
                }
            }) => {
                return {
                    items,
                    total,
                }
            })
    },
    fetchListAll({
        commit
    }, query) {
        return request
            .post('/admin/prepaid/group/search', query)
            .then(({
                items
            }) => {
                return {
                    items
                 
                }
            })
    },
    fetchListGroup({
        commit
    }, query) {
        return request
            .post('/admin/prepaid/group/search', query)
            .then(({
                items,
                pagination: {
                    total
                }
            }) => {
                return {
                    items,
                    total,
                }
            })
    },
   /*  fetchListGroupAll({
        commit
    }, query) {
        return request
            .post('/admin/prepaid/group/search', query)
            .then(({
                items
           
            }) => {
                return {
                    items
              
                }
            })
    }, */
    sendLink({
        commit
    }, {
        orderId,
        router
    }) {
        return request.post(`admin/prepaid/order/${orderId}/sendLink`, {
            router
        })
    },
    orderingPrepaid({ commit }, orderingData) {
      return request.post(`/admin/prepaid/ordering`,orderingData)
    },
}
