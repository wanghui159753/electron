import request from "@/utils/request.js";
//获取验码
export function sendCode(data) {
    return request({
        url: "merchant/i/auto/seller/sms/verif/code",
        data: data,
        method: "post"
    })
}
//验证票据
export function getPaper(data) {
    return request({
        url: "merchant/i/auto/seller/back/paper",
        data: data,
        method: "post"
    })
}
//地区数据
export function getarea() {
    console.log("智障")
    return request({
        url: "/vehicle/base/area/all/three",
        method: "get"
    })
}
//汽车列表
export function getcalList() {
    return request({
        url: "vehicle/seller/manage/scope/all/tree",
        method: "get"
    })
}
//审核提交
export function upinFo(data) {
    return request({
        url: "/merchant/i/auto/seller/apply",
        data: data,
        method: "post"
    })
}
//修改提交
export function revise(data) {
    return request({
        url: "merchant/i/auto/seller/modify/commit",
        data: data,
        method: "post"
    })
}
//店铺详情
export function getdetails() {
    return request({
        url: "/merchant/i/auto/seller/details",
        method: "get"
    })
}
//商铺信息
export function getMyShop() {
    return request({
        url: "/merchant/i/auto/seller/details",
        method: "get"
    })
}