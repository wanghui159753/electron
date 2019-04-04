import request from '@/utils/request'

/**
 * 分页查询好友邀请列表
 * @param  params 
 */
export function loadfriendPage(params) {
    return request({
        url: "/im/im/user/friend/invite/page",
        method: "get",
        params
    })
}

/**
 * 发送好友请求
 */
export function confirmfriend(data) {
    return request({
        url: "/im/im/user/friend/invite/confirm",
        method: "post",
        data
    })
}

export function sysfriend(data) {
    return request({
        url: "/im/im/user/friend/invite/friend",
        method: "post",
        data
    })
}

export function deletefriend(data) {
    return request({
        url: "/im/im/user/friend/invite/delete",
        method: "post",
        data
    })
}
