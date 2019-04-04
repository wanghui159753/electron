import request from '@/utils/request'
// 获取用户收货地址
export function getAddress(params) {
  return request({
    url: '/merchant/merchant/consignee/address',
    method: 'get',
    params: params
  })
}
// 查询用户默认收货地址
export function getDefaultAddress() {
    return request({
      url: '/merchant/merchant/consignee/address',
      method: 'get'
    })
  }
  //根据ID删除
  export function deleteAddress(data) {
    return request({
      url: '/merchant/merchant/consignee/address/delete',
      method: 'post',
      data: data
    })
  }
  
  //新增或修改收货地址 
  export function addAddress(data) {
    return request({
        url: '/merchant/merchant/consignee/address/save',
        method: 'post',
        data: data
      })
    }
   
//根据ID查询收货地址列表
export function getAddresslist() {
    return request({
        url: '/merchant/merchant/consignee/address/list',
        method: 'get'
      })
    }
    //获取默认地址
    export function getDefault() {
        return request({
            url:'/merchant/merchant/consignee/address/default',
            method:'get'
        })
    }