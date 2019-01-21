import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import axios from 'axios'
import 'normalize.css/normalize.css'
import App from './App'
import router from './router'
import store from './store'
import "../../theme/index.css"
import '@/icons'
import "@/styles/common.css"
import '@/permission'
import moment from "vue-moment"
// 导入vue右键菜单
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "./sdk/NIM_Web_SDK_v5.4.0.js"
Vue.use(VueQuillEditor)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.use(moment)
Vue.use(contentmenu)
Vue.prototype.axios = axios
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')