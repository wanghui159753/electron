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

//建群权限查询
export function AddChatroomAuthority() {
    return request({
        url: "/im/im/user/create/group/query",
        method: "get"
    })
}
//客服列表
export function loadSupport() {
    return request({
        url: "/im/netease/user/support/get/user/support",
        method: "get"
    })
}
//切换客服
export function changeSupport(data) {
    return request({
        url: "/im/netease/user/support/change/user/support",
        method: "post",
        data: data
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
        data: data
    })
}
/**
 * 分页查询自定义通知列表
 * @param  params 
 */
export function loadSysPage(params) {
    return request({
        url: "/im/admin/im/attach/msg/Log/simplification/page",
        method: "get",
        params: params
    })
}

export function getSysUnred(params) {
    return request({
        url: "/im/im/attach/msg/Log/unread/count",
        method: "get"
    })
}

export function setSysUnread(data) {
    return request({
        url: "/im/im/attach/msg/Log/update/read",
        method: "post",
        data:data
    })
}

export function setSysAllUnread() {
    return request({
        url: "/im/im/attach/msg/Log/update/all/read",
        method: "post"
    })
}
