import request from "@/utils/request.js";
//排序列表
export function getAutosellerPage(data) {
    return request({
        url: 'merchant/auto/seller/page',
        method: 'get',
        params: data
    })
}
//关键词查询列表
export function keyWord(data) {
    return request({
        url: 'merchant/auto/seller/keyword/page',
        method: 'get',
        params: data
    })

}
//收藏与取消
export function collect(data) {
    return request({
        url: '/merchant/auto/seller/push/collect/call',
        method: 'post',
        data
    })
}
//刷新活跃度
export function refreshActive() {
    return request({
        url: '/merchant/merchant/refresh/active',
        method: 'post'
    })
}
export function getScopetype() {
    return request({
        url: '/merchant/merchant/quote/manage/scope',
        method: 'get'
    })
}
//查询详情
export function detail(data) {
    return request({
        url: '/merchant/auto/seller/detail',
        method: 'get',
        params: data
    })
}
//查询评论
export function comment(data) {
    return request({
        url: '/merchant/auto/seller/comment/' + data,
        method: 'get'
    })
}
//查询二维码
export function qrcode(data) {
    return request({
        url: '/merchant/auto/seller/qrcode',
        method: 'get',
        params: data
    })
}