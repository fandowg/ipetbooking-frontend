export const state = {
  packageVersion: process.env.VUE_APP_VERSION || '%7Bversion%3A0%7D',
}

export const getters = {
  appVersion(state) {
    return state.packageVersion
  },
}

export const mutations = {}

export const actions = {}
