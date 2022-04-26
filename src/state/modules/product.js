import request from '@utils/request'
import { groupById } from '@utils/normalize-data'

export const state = {
  cached: [],
  byId: {},
  byPriceId: {},
}

export const getters = {}

export const mutations = {
  CACHE_PRODUCTS(state, currentProducts) {
    state.cached = currentProducts
    state.byId = groupById(currentProducts, 'products')
  },
  CACHE_PRICES(state, currentPrices) {
    state.byPriceId = groupById(currentPrices, 'products')
  },
}

export const actions = {
  fetchPrices({ commit }, { productId, query }) {
    return request
      .post(`/admin/product/${productId}/price/search`, {
        paginate: 0,
        ...query,
      })
      .then((response) => response.items)
  },
  storePrices({ commit }, { productId, storeData, inventoryId = undefined }) {
    return request.post(`/admin/product/${productId}/price/store`, {
      inventoryId,
      params: storeData,
    })
  },
  inventoryCalendar({ commit }, { productId, submitData }) {
    return request.post(`/admin/product/${productId}/calendar`, submitData)
  },
  store({ commit }, storeData) {
    // console.log(storeData)
    return request.post('/admin/product/store', storeData).then((response) => response && response.items)
  },
  updateState({ commit }, { ids, state } = {}) {
    return request.post('/admin/product/state', { ids, state })
  },
  remove({ commit }, { ids }) {
    return request.post('/admin/product/remove', { ids })
  },
  fetchSingle({ commit }, productId) {
    return request.get(`/admin/product/${productId}`).then((response) => response.items)
  },
  fetchList({ commit }, query) {
    return request.post('/admin/product/search', query).then(({ items, modulesLimit, modulesUsed, pagination: { total } }) => {
      commit('CACHE_PRODUCTS', items)
      return {
        items,
        modulesLimit,
        modulesUsed,
        total,
      }
    })
  },
  updateExtraField({ commit }, submitData) {
    return request.post(`/admin/product/order/extrafield/store`, submitData).then((response) => response.items)
  },
  fetchExtraField({ commit }, query) {
    return request.post('/admin/product/order/extrafield/search', query).then((response) => response.items)
  },
  // 服務項目
  fetchServicePrices({ commit }, query) {
    return request.post(`/admin/product/price/search`, query).then(({ items, pagination: { total, current_page } }) => {
      commit('CACHE_PRICES', items)
      return {
        items,
        total,
        current_page,
      }
    })
  },
  fetchServicePriceGroup({ commit }, query) {
    return request.post(`/admin/product/price/search`, query).then((items) => {
      // commit('CACHE_PRICES', items)
      return items
    })
  },
  // 樹狀
  // fetchServicePricesByGroup({ commit }) {
  //   return request.post(`/admin/product/price/search`, { groupByPetSize: 1 }).then((response) => response)
  // },
  fetchServicePricesByGroup({ commit }) {
    return request.post(`/admin/product/price/search`, { groupByPetSize: 1 }).then((response) => {
      response.forEach((store) => {
        store.children.forEach((price)=>{
          price.children.forEach((item)=>{
            item.maxTimes=0
          })
        })
      })
      return response 
    })
  },
  storeServicePrice({ commit }, submitData) {
    return request.post(`/admin/product/${submitData.productId}/price/store`, submitData)
  },
  storeServicePriceGroup({ commit }, submitData) {
    let data = {
      ...submitData,
      images: submitData.images.map((image, index) => {
        return {
          ...image,
          default: index === 0 ? 1 : 0,
          }
      })
    }
    data.params = [...submitData.prices]
    delete data.prices
    // const { images, categoryIds } = this.submitData
    //   const { images } = this.submitData
    //   return {
    //     ...this.submitData,
    //     images: images.map((image, index) => {
    //       return {
    //         ...image,
    //         default: index === 0 ? 1 : 0,
    //       }
    //     }),
    return request.post(`/admin/product/price/store`, data)
  },
  removeServicePrice({ commit }, submitData) {
    return request.post(`/admin/product/${submitData.productId}/price/remove`, submitData)
  },
  fetchSingleServicePrice({ commit }, priceId) {
    return request.get(`/admin/product/price/${priceId}`).then((response) => response.items)
  },
  fetchSingleServicePriceGroup({ commit }, groupOrdering) {
    // console.log(groupOrdering)
    return request.post(`/admin/product/price`,{
      groupOrdering:groupOrdering
    }).then((response) => response.items)
  },

  orderingServicePrice({ commit }, {productId,orderingData}) {
    return request.post(`/admin/product/${productId}/price/ordering`,orderingData)
  },
  orderingServicePriceGroup({ commit }, {orderingData}) {
    return request.post(`/admin/product/price/groupOrdering`,orderingData)
  },
  serviceUpdateState({
      commit
  },{
      ids,
      state
    } = {}) {
      return request.post('/admin/product/price/state', {
          ids,
          state
      })
  },

  // 服務分類
  fetchServiceCategory({ commit }) {
    return request.post(`/admin/service/category/search`, { state: 1 }).then((response) => response.items)
  },
  storeServiceCategory({ commit }, submitData) {
    return request.post(`/admin/service/category/store`, submitData)
  },
  removeServiceCategory({ commit }, ids) {
    return request.post(`/admin/service/category/remove`, ids)
  },

  // 加購項目
  fetchAdditionalPrices({ commit }, query) {
    return request.post(`/admin/service/additional/search`, query).then(({ items, pagination: { total, current_page } }) => {
      return {
        items,
        total,
        current_page,
      }
    })
  },

  fetchAdditionalPriceGroup({ commit }, query) {
    return request.post(`/admin/service/additional/search`, query).then((items) => {
      return items
    })
  },

  storeAdditionalPrice({ commit }, submitData) {
    return request.post(`/admin/service/additional/store`, submitData)
  },
  storeAdditionalPriceGroup({ commit }, submitData) {
    let data = {
      ...submitData,
      images: submitData.images.map((image, index) => {
        return {
          ...image,
          default: index === 0 ? 1 : 0,
          }
      })
    }
    data.params = [...submitData.prices]
    delete data.prices
    // const { images, categoryIds } = this.submitData
    //   const { images } = this.submitData
    //   return {
    //     ...this.submitData,
    //     images: images.map((image, index) => {
    //       return {
    //         ...image,
    //         default: index === 0 ? 1 : 0,
    //       }
    //     }),
    return request.post(`/admin/service/additional/store`, data)
  },
  removeAdditionalPrice({ commit }, submitData) {
    return request.post(`/admin/service/additional/remove`, submitData)
  },
  fetchSingleAdditionalPrice({ commit }, priceId) {
    return request.get(`/admin/service/additional/${priceId}`).then((response) => response.items)
  },

  fetchSingleAdditionalPriceGroup({ commit }, groupOrdering) {
    // console.log(groupOrdering)
    return request.post(`/admin/service/additional`,{
      groupOrdering:groupOrdering
    }).then((response) => response.items)
  },
  orderingAdditionalPriceGroup({ commit }, {orderingData}) {
    return request.post(`/admin/service/additional/groupOrdering`,orderingData)
  },
  additionUpdateState({
    commit
}, {
    ids,
    state
} = {}) {
    return request.post('/admin/service/additional/state', {
        ids,
        state
    })
},
}
