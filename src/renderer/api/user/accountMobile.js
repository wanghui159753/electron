import request from '@/utils/request'
// 注册修改手机号码短信验证码
export function sendCode(data) {
    return request({
        url: "/user-sys/user/account/mobile/sms/code",
        method: "post",
        data: data
    })
}
// 用户注册 手机号码注册
export function registerMobile(data) {
    return request({
        url: "/user-sys/user/account/mobile/register",
        method: "post",
        data: data
    })
}
// 用户分类
export function userType() {
    return request({
        url: "/merchant/identity/tree",
        method: "get"
    })
}
// 手机号码验证登录---发送短信验证码
export function loginSendCode(data) {
    return request({
        url: "/user-sys/user/mobile/login/send/code",
        method: "post",
        data: data
    })
}
// 获取验证码登录接口
export function loginCode(data) {
    return request({
        url: "/user-sys/user/mobile/login/code",
        method: "post",
        data: data
    })
}
// 修改密码--发送验证码接口
export function retrieveSendCode(data) {
    return request({
        url: "/user-sys/user/pwd/reset/send/code",
        method: "post",
        data: data
    })
}
// 修改密码--提交新密码接口
export function subNewPsw(data) {
    return request({
        url: "/user-sys/user/pwd/reset",
        method: "post",
        data: data
    })
}
//拉取主要地区、
export function area() {
    return request({
        url: "/vehicle/base/area/all/three",
        method: "get"
    })
}