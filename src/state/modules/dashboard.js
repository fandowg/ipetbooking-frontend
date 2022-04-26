import request from '@utils/request'

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
    fetchSchedule({
        commit
    }, {
        productId = ''
    } = {}) {
        return request.post('/admin/dashboard/schedule', {
            productId
        }).then((response) => response.items)
    },
    fetchSMSInfo({
        commit
    }) {
        return request.get(`/admin/dashboard/smsInfo`).then((response) => response.items)
    },
    fetchRanking({
        commit
    }, query) {
        return request
            .post('/admin/dashboard/ranking', query)
            .then((response) => response.items)
    },
    fetchOrders({
        commit
    }) {
        return request.get(`/admin/dashboard/orders`).then((response) => response.items)
    },
    fetchUserActivity({
        commit
    }) {
        return request
            .get(`/admin/dashboard/activity`)
            .then((response) => response.items)
    },
}
