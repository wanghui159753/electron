import request from '@/utils/request'
// 获取用户信息
export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params: params
  })
}
// 用户进行账号密码登录
export function login(data) {
  // return Promise.resolve({
  //   data: {
  //     jwtToken: {
  //       token: 'e10adc3949ba59abbe56e057f20f883e',
  //     }
  //   }
  // })
  return request({
    url: "/user-sys/user/pwd/login",
    method: "post",
    data: data
  })
}
// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 刷新token
export function RefreshToken() {
  return request({
    url: "/user-sys/user/token/refresh",
    method: "post"
  })
}
//获取二维码
export function getCodeLogin() {
  return request({
    url: "user-sys/scan/code/login/get/qrcode",
    method: "get"
  })
}
//轮询获取令牌
export function polling(data) {
  // return Promise.resolve({
  //   data: {
  //     status: ''
  //   }
  // })
  return request({
    url: "user-sys/scan/code/login/polling/confirm",
    method: "get",
    params: {
      str: data
    }
  })
}