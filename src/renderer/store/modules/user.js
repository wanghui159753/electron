import { login, logout, getInfo } from '@/api/user/login'
import { loginCode } from '@/api/user/accountMobile'
import { RefreshToken } from '@/api/user/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resolve } from 'path';
import { reject } from 'bluebird-lst';
import { imLogin } from "@/api/im/login"
import { removeLocal } from "@/utils/localstorage.js"
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    /**
     * 初始化Nim状态
     */
    // 正在加载中
    isLoading: true,
    // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
    isRefresh: true,
    // 全屏显示的原图
    isFullscreenImgShow: false,
    fullscreenImgSrc: '',
    // 切页动画 forward，backward
    transitionName: 'forward',

    // IM相关
    // NIM SDK 实例
    nim: null,
    // 登录账户ID
    userUID: null,
    // 用户名片
    // myInfo: {},
    // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
    userInfos: {},
    // // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
    // userSubscribes: {},
    imtoken: "",
  },

  mutations: {
    // 设置token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 设置name
    SET_NAME: (state, name) => {
      state.name = name
    },
    // 设置图像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    // 设置角色
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    // 设置登录IM用户
    SET_USERINFOS: (state, userInfos) => {
      state.userInfos = userInfos
    },
    SET_UID: (state, userUID) => {
      state.userUID = userUID
    },
    SET_IMTOKEN: (state, token) => {
      state.imtoken = token
    }
  },

  actions: {
    // 用户登录的action 
    /*
      通过userInfo.username userInfo.password提交用户信息
      服务器端返回token信息，加入本地缓存，并提交Vuex
    */
    Login({ commit }, userInfo) {
      let data = {
        mobile: userInfo.mobile,
        password: userInfo.password
      };
      return new Promise((resolve, reject) => {
        login(data).then(response => {
          // console.log(response)
          const data = response.data
          setToken(data.jwtToken.token)
          commit('SET_TOKEN', data.jwtToken.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 手机验证码登录
    MobileLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginCode(userInfo).then(response => {
          const data = response.data
          setToken(data.jwtToken.token)
          commit('SET_TOKEN', data.jwtToken.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: 角色必须是一个非空数组 !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出登录，把token信息提交为空
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeLocal("imuid")
          removeLocal("imtoken")
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // im登录
    ImLogin({ commit }) {
      return new Promise((resolve, reject) => {
        imLogin().then(res => {
          if (res.code == 200) {
            commit("SET_USERINFOS", res.data)
            commit("SET_UID", res.data.accid)
            commit("SET_IMTOKEN", res.data.token)
          }
          resolve(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_TOKEN', '')
        resolve()
      })
    },
    refreshToken({ commit }) {
      return new Promise((resolve, reject) => {
        RefreshToken().then(res => {
          if (res.code == 200) {
            setToken(res.data.jwtToken.token)
            commit('SET_TOKEN', res.data.jwtToken.token)
          }
          resolve(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
