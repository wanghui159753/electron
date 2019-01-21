import request from '@/utils/request'
// 登录
export function imLogin() {
    return request({
        url: "/im/netease/user/login",
        method: "post",
    })
}
