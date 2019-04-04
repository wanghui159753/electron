import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/base.css';
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
import "./sdk/NIM_Web_SDK_v5.8.0.js"
import {parseTime} from "./utils/index";
//事件绑定默认最大值
// require('events').EventEmitter.defaultMaxListeners = 40;
Vue.use(VueQuillEditor)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.use(moment)
Vue.use(contentmenu)
/* eslint-disable no-new */
Vue.filter('exNum',function (val) {
    return (val/100).toFixed(2)
})
Vue.filter('parseTime',parseTime)
const app = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
});

app.$mount('#app')
let routerList = [];
app.$nextTick(() => {
  router.beforeEach((to, from, next) => {
    if (
      routerList.length &&
      routerList.indexOf(to.name) === routerList.length - 1
    ) {
      // 后退
      // console.log(';',to, from,routerList.length, routerList.indexOf(to.name) === (routerList.length - 1))
      console.error("后退");
      console.log(document.querySelector(".scrollbar"));
      setTimeout(() => {
        if (document.querySelector(".scrollbar")){
          document.querySelector(".scrollbar").scrollTop = to.meta.scollTopPosition;
          console.log(document.querySelector(".scrollbar").scrollTop);
          routerList.splice(routerList.length - 1, 1);
          to.meta.isBack = true;
        }
      }, 0)
    } else {
      // 前进
      if (document.querySelector(".scrollbar")) {
        from.meta.scollTopPosition = document.querySelector(
          ".scrollbar"
        ).scrollTop;
        console.log(document.querySelector(".scrollbar").scrollTop);
        routerList.push(from.name || "/");
        to.meta.isBack = false;
      }
    }
    next();
  });
})
