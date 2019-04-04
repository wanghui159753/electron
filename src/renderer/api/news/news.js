import request from '@/utils/request'

export function getNews(params) {
  return request({
    url: `tool/news/detail/${params.id}`,
    method: 'get',
    params:params
  })
}