// import request from '@utils/request'

export const state = {
  title:'' 
}
export const mutations = {
  SET_TITLE(state, newValue) {
    state.title = newValue
  }}

  export const getters = {
    pageTitle(state){
      return state.title
    }
  }