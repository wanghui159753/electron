import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import widget from "./modules/widget"
import im from "./modules/im"
import autoUpdate from "./modules/autoUpdated"
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    widget,
    im,
    autoUpdate,
    formable:{}
  },
  getters,
})

export default store
