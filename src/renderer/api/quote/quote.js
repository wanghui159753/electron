import request from "@/utils/request.js";

//列表,城市，品牌查询
export function getList(data) {
    return request({
        url: "quote/enquiry/pc/page",
        method: "get",
        params: data
    })
}

//查询询价单详情
export function getDetail(data) {
    return request({
        url: "quote/enquiry/detail",
        method: "get",
        params: data
    })
}

//查询询价单清单包含ID，是否报价
export function getInfo(data) {
    return request({
        url: "quote/enquiry/detail/checklist",
        method: "get",
        params: data
    })
}

//分页查询与我相关询价列表
export function getRelated(data) {
    return request({
        url: "quote/enquiry/related/page",
        method: "get",
        params: data
    })
}

//查询匹配商家和个人ID
export function getMatching(data) {
    return request({
        url: "quote/test/enquiry/matching",
        method: "get",
        params: data
    })
}

//提交报价
export function fastCommit(data) {
    return request({
        url: "quote/my/quote/fast/commit",
        method: "post",
        data: data
    })
}

export function preciseCommit(data) {
    return request({
        url: "quote/my/quote/precise/commit",
        method: "post",
        data: data
    })
}

//我的报价单详情
export function getMyDetail(data) {
    return request({
        url: "/quote/my/quote/detail",
        method: "get",
        params: data
    })
}

//我的报价单分页查询
export function getMyQuote(data) {
    return request({
        url: "/quote/my/quote/page",
        method: "get",
        params: data
    })
}

//查询报价配件类型列表
export function getPartType() {
    return request({
        url: "quote/my/quote/part/classify/type",
        method: "get"
    })
}

//我的询价单详情
export function getMyEnquiryDetail(data) {
    return request({
        url: "/quote/my/enquiry/detail",
        method: "get",
        params: data
    })
}

//采购完成
export function finish(data) {
    return request({
        url: "quote/my/enquiry/finish",
        method: "post",
        data: data
    })
}

//提交发布
export function publish(data) {
    return request({
        url: "quote/my/enquiry/inquiry",
        method: "post",
        data: data
    })
}

//我的询价单分页查询
export function getMyEnquiryPage(data) {
    return request({
        url: "quote/my/enquiry/page",
        method: "get",
        params: data
    })
}

//查询商户报价详情(下单选择)
export function order(data) {
    return request({
        url: "quote/my/enquiry/quote/detail",
        method: "get",
        params: data
    })
}

//查询所有配件及子集（发布）
export function accessory() {
    return request({
        url: "vehicle/part/enquiry/all/children",
        method: "get"
    })
}

//商家分类 查询配件及子集
export function partSeller() {
    return request({
        url: "vehicle/partSeller/all/children",
        method: "get"
    })
}

//查询所有品牌
export function brand() {
    return request({
        url: "vehicle/base/car/brand/app",
        mothod: "get"
    })
}

//查询所有品牌和车型
export function brandType() {
    return request({
        url: "vehicle/base/car/brand/serie/app",
        mothod: "get"
    })
}

//条件查询品牌下车系及车型
export function model(data) {
    return request({
        url: "vehicle/base/car/page/app",
        mothod: "get",
        params: data
    })
}

//查询报价商圈开发省市
export function getCity() {
    return request({
        url: "vehicle/base/area/open/city/buyer/tree",
        mothod: "get"
    })
}

//筛选配件 配件分类
export function filters() {
    return request({
        url: "vehicle/part/enquiry/all",
        mothod: "get"
    })
}

//vin查询
export function vin(data) {
    return request({
        url: "vehicle/vin/car/info/vin",
        mothod: "get",
        params: data
    })
}

//查询经营范围 店铺
export function operation() {
    return request({
        url: "/merchant/i/auto/seller/manage/scope/list",
        method: "get"
    })
}

//查询经营范围 个人
export function manageOperation() {
    return request({
        url: "/merchant/merchant/manage/scope",
        method: "get"
    })
}

export function inventory(params) {
    return request({
        url:'/quote/enquiry/detail/checklist',
        method:'get',
        params
    })
}
//im清单
export function imCreatedInventory(data) {
    return request({
        url:'/quote/my/enquiry/im/inquiry',
        method:'post',
        data
    })
}

