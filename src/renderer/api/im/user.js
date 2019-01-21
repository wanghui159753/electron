import request from '@/utils/request'

/**
 * 分页查询用户列表
 * @param  params 
 */
export function loadUserPage(params) {
    return request({
        url: "/im/netease/user/page",
        method: "get",
        params: params 
    })
}

/**
 * 更新用户信息
 * @param  data 
 */
export function updateUserInfo(data) {
    return request({
        url: "/im/netease/user/update",
        method: "post",
        params:  data 
    })
}