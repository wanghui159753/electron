import request from '../../utils/request';

//删除订单，仅取消或已过期订单
export function delOrder(data) {
    return request({
        method:'post',
        url:'/order/order/custom/delete',
        data
    })
}
export function refundDetail(params) {
    return request({
        url:'/order/order/custom/refund/detail',
        method:'get',
        params
    })
}
//订单生成及修改
export function setOrder(data) {
    return request({
        method: 'post',
        url: '/order/order/custom/build',
        data
    })
}
//生成虚拟订单
export function quoteOrder(data) {
    return request({
        method: 'post',
        url: '/order/quoted/save',
        data
    })
}
//虚拟的查询
export function quoteOrderDel(params) {
    return request({
        method: 'get',
        url: '/order/quoted/detail',
        params
    })
}

//立即付款
export function direct(data) {
    return request({
        method:'post',
        url:'/order/order/create/build/direct/pay',
        data
    })
}
//生成订单单个
export function single(data) {
    return request({
        method: 'post',
        url: '/order/order/create/build/single',
        data
    })
}
//卖家退所有
export function refundAll(data) {
    return request({
        method: 'post',
        url: '/order/order/custom/refund/all',
        data
    })
}
//订单完成
export function finishOrder(data) {
    return request({
        method: 'post',
        url: '/order/order/custom/finish',
        data
    })
}
//订单发货
export function setLogistics(data) {
    return request({
        method: 'post',
        url: '/order/order/custom/send',
        data
    })
}
//根据订单号查询详情
export function findDetailByOrderId(data) {
    return request({
        url: '/order/order/custom/detail',
        method: 'get',
        params: data
    })
}
//分页查询订单列表
export function orderList(data) {
    return request({
        url: "/order/order/custom/page",
        method: 'get',
        params: data
    })
}
//买家订单支付单个
export  function pay(data) {
    return request({
        url:'/order/order/pay/pay',
        method:'post',
        data
    })
}
//买家订单支付多个
export  function payMore(data) {
    return request({
        url:'/order/order/pay/multi/pay',
        method:'post',
        data
    })
}
//买家订单取消退货/退款申请
export  function cancleReturned (data) {
    return request({
        url:'/order/order/custom/refund/cancel',
        method:'post',
        data
    })
}
//买家订单申请退货
export  function returned (data) {
    return request({
        url:'/order/order/custom/refund/add',
        method:'post',
        data
    })
}

//卖家拒绝退货/退款
export  function reject (data) {
    return request({
        url:'/order/order/custom/refund/reject',
        method:'post',
        data
    })
}
//同意退款仅退款（卖家）
export function orderCompleRefund(data) {
    return request({
        url:'/order/order/custom/refund/confirm/refund',
        method:'post',
        data
    })
}
//退货退款，确认发货（买家）
export function shipmentsRefund(data) {
    return request({
        url:'/order/order/custom/refund/confirm/refund/return/ship',
        method:'post',
        data
    })
}
//确认收货退款,订单已完成 (卖家)
export function completeRefund(data) {
    return request({
        url:'/order/order/custom/refund/take/finish',
        method:'post',
        data
    })
}
//修改订单退货(买家)
export function resetRefund(data) {
    return request({
        url:'/order/order/custom/refund/update',
        method:'post',
        data
    })
}
//确认收货退款,订单未完成 (卖家)
export function undoneRefund(data) {
    return request({
        url:'/order/order/custom/refund/take/undone',
        method:'post',
        data
    })
}
//取消订单
export function cancleOrder(data){
    return request({
        url:'/order/order/custom/cancel',
        method:'post',
        data
    })
}
//卖家同意退货退款
export  function sellerAgreeAll(data) {
    return request({
        url:'/order/order/custom/refund/confirm/refund/return',
        method:'post',
        data
    })
}
//售后记录
export  function refundHistory(data) {
    return request({
        url:'/order/order/custom/refund/list',
        method:'get',
        params:data
    })
}
//分页查询售后订单
export  function afterSale(data) {
    return request({
        url:'/order/order/custom/refund/return/page',
        method:'get',
        params:data
    })
}
//物流列表
export function loisticList() {
    return request({
        url:'/order/common/logistics/advise/list',
        method:'get'
    })
}
//轮询订单状态
export function training(params) {
    return request({
        url:'/order/order/custom/training',
        method:'get',
        params
    })
}
export function bindingPasswordCode() {
    return request({
        url:'/order/burse/account/bind/password/send/code',
        method:'post'
    })
}
export function orderTotal(params) {
    return request({
        url:'/order/order/count/status',
        method:'get',
        params
    })
}
export function customerService(data) {
    return request({
        url:'/order/order/appeal/commit',
        method:'post',
        data
    })
}
export function bindingPassword(data) {
    return request({
        url:'/order/burse/account/bind/password',
        method:'post',data
    })
}


//钱包相关
export function burseMain() {
    return request({
        url: "/order/burse/account",
        method: 'get',
    })
}

export function billPage(data) {
    return request({
        url: "/order/burse/bill/trade/record/page",
        method: 'get',
        params:data
    })
}

export function applyBurse(data) {
    return request({
        url: "/order/burse/draw/record/apply",
        method: 'post',
        data
    })
}
//绑定支付宝
export function bindingAlipy(data) {
    return request({
        url: "/order/burse/account/bind/alipay",
        method: 'post',
        data
    })
}
//提现记录
export function drawList(data) {
    return request({
        url: "/order/burse/draw/record/page",
        method: 'get',
        params:data
    })
}
//钱包充值
export function recharge(data) {
    return request({
        url:'/order/burse/balance/trade/pay',
        method:'post',
        data
    })
}
//钱包充值轮询
export function rechargeL(params) {
    return request({
        url:'/order/burse/balance/trade/training',
        method:'get',
        params
    })
}
//钱包充值记录
export function rechargeHistory(params) {
    return request({
        url:'/order/burse/balance/trade/record/page',
        method:'get',
        params
    })
}
//查询钱包余额
export function balance() {
    return request({
        url:'/order/burse/balance/trade/total',
        method:'get'
    })
}