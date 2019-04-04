import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from "@/utils/auth"
import {getLocal} from "@/utils/localstorage.js"
// 创建axios实例
let oldError = null;
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 20000 // 请求超时时间
})
// request请求拦截器
service.interceptors.request.use(config => {
    if (getLocal('loginToken')||store.state.user.token) {
        config.headers['xdpx-token'] = store.state.user.token||getLocal('loginToken') // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers['Access-Control-Allow-Origin'] = '*'
        config.headers['Access-Control-Allow-Methods'] = "GET,POST"
        config.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)

})

// respone响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            // 未登录
            if (res.code === 401) {
                console.log(res,'数据返回',response)
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()
                        // 为了重新实例化vue-router对象 避免bug
                    })
                })
                // 没有相关权限
            } else if (res.code === 403) {
                if (res.timestamp - 3000 > oldError) {
                    oldError = res.timestamp;
                    Message({
                        message: res.msg,
                        type: 'waring',
                        duration: 3 * 1000
                    })
                }
                // 业务错误
            } else if (res.code === 501) {
                if (res.timestamp - 3000 > oldError) {
                    oldError = res.timestamp;
                    Message({
                        message: res.msg,
                        type: 'waring',
                        duration: 1.5 * 1000
                    })
                }
            }else if (res.code === 503) {
                if (res.timestamp - 3000 > oldError) {
                    oldError = res.timestamp;
                    Message({
                        message: res.msg,
                        type: 'waring',
                        duration: 1.5 * 1000
                    })
                }
            }
            store.commit('setLoading',false)
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err:--------------' + error)// for debug
        let time=new Date().getTime()
        if (time- 5000 > oldError) {
            oldError=time;
            Message({
                message: '请求超时，请稍后重试',
                type: 'error',
                duration: 2 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export default service
