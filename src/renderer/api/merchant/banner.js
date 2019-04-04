import request from '@/utils/request'
// 获取banner
export function getBannerlist() {
  return request({
    url: '/merchant/i/auto/seller/banner/list',
    method: 'get',
  })
}
export function modifyBanner(data) {
    return request({
      url: '/merchant/i/auto/seller/banner/modify',
      method: 'post',
      data:data
    })
  }