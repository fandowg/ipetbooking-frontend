import request from '@utils/request'

export const state = {}

export const getters = {}

export const mutations = {}

export const actions = {
    export ({
        commit
    }, exportParams) {
        return request
            .post('/admin/order/export', exportParams)
            .then((response) => response.items)
    },
    simpleExport({
        commit
    }, exportParams) {
        return request
            .post('/admin/order/export/simple', exportParams)
            .then((response) => response.items)
    },
    verifyCodes({
        commit
    }, storeData) {
        return request.post('/admin/qrcode/verify', {
            ids: [...storeData]
        })
    },
    verifyCode({
        commit
    }, {
        codeId,
        verifyRule
    }) {
        return request.post(`admin/qrcode/${codeId}/verify`, verifyRule, {
            errorHandle: false,
        })
    },
    fetchSingleCode({
        commit
    }, codeId) {
        return request
            .get(`admin/qrcode/${codeId}`, {
                errorHandle: false
            })
            .then((response) => response.items)
    },
    
    verifySingleCode({
        commit
    }, {
        codeId,
        orderId
    }) {
        return request.post(`/admin/qrcode/${codeId}/verify`, {orderId})
    },
    sendLink({
        commit
    }, {
        orderId,
        router
    }) {
        return request.post(`admin/order/${orderId}/sendLink`, {
            router
        })
    },
    getLink({
        commit
    }, orderId) {
        return request.get(`admin/order/${orderId}/shortUrl`)
    },
    cancel({
        commit
    }, {
        orderId,
        cancelData
    }) {
        // orderId, note, refundValue
        return request.post(`admin/order/${orderId}/cancel`, cancelData)
    },
    store({
        commit
    }, storeData) {
        return request.post('/admin/order/store', storeData, {errorHandle: storeData.errorHandle || true, hideErrorMessage: !storeData.errorHandle || false,})
    },
    fetchSingle({
        commit
    }, orderId) {
        return request
            .get(`admin/order/${orderId}`)
            .then((response) => response.items)
    },
    fetchList({
        commit
    }, query) {
        return request
            .post('admin/order/search', query)
            .then(({
                items,
                productName,
                pagination: {
                    total
                }
            }) => {
                return {
                    items,
                    productName,
                    total
                }
            })
    },
    fetchInventoryList({
        commit
    }, query) {
        return request
            .post('admin/order/search', query)
            .then(({
                items,
                productName,
            }) => {
                return {
                    items,
                    productName,
                }
            })
    },
    fetchAvailablePeriod({ commit }, submitData) {
        return request.post('/admin/schedule/calendar/search/availablePeriod', submitData)
    },
    storeModifyOrder({ commit }, storeData) {
        return request.post('/admin/order/modify', storeData)
    },
    fetchMerchantNote({ commit }, id) {
        return request.post('/admin/order/merchantNote', {id}).then(({items:{contents}})=> contents)
    },
    storeMerchantNote({ commit }, {id, note}) {
        return request.post(`/admin/order/${id}/addMemberNote`, {note})
    },
    
    storeAdditionalOrder({ commit }, storeData) {
        return request.post('/admin/order/additional/store', storeData)
    },
    fetchSingleAdditional({ commit }, orderId) {
        return request.get(`/admin/order/additional/${orderId}`).then((response) => response.items)
    },
    fetchHelperList({ commit }, id) {
      return request.post('admin/order/searchHelpers', {orderId:id})
    },
    storeAssignHelper({ commit }, {id, itemId}) {
      return request.post('admin/order/assignHelper', {id, itemId})
    },
    refundOrder({ commit }, {id, refundData}){
      return request.post(`admin/order/${id}/refund`, refundData)
    },
    storeOrderItem({ commit }, storeData){
      return request.post(`admin/order/item/modify`, storeData)
    }
}
