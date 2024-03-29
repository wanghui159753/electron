
import store from '@/store'
import config from '@/configs'
import util from '@/utils'

export function formatUserInfo(obj) {
  // const nim = store.state.nim
  const nim = store.state.im.nim
  let gender = ''
  switch (obj.gender) {
    case 'male':
      gender = '男'
      break
    case 'female':
      gender = '女'
      break
    case 'unknown':
      gender = ''
      break
  }

  let custom = obj.custom || ''
  try {
    custom = JSON.parse(custom)
  } catch (e) {
    custom = {
      data: custom
    }
  }

  if (obj.avatar) {
    obj.avatar = nim.viewImageSync({
      url: obj.avatar, // 必填
    })
  } else {
    obj.avatar = config.defaultUserIcon
  }

  let result = Object.assign(obj, {
    account: obj.account,
    nick: obj.nick || '',
    avatar: obj.avatar || config.defaultUserIcon,
    birth: obj.birth || '',
    email: obj.email || '',
    tel: obj.tel || '',
    gender,
    sign: obj.sign || '',
    custom,
    createTime: obj.createTime || (new Date()).getTime(),
    updateTime: obj.updateTime || (new Date()).getTime()
  })
  return result
}

export function onMyInfo(obj) {
  obj = util.mergeObject(store.state.myInfo, obj);
  let myInfo = formatUserInfo(obj)
  store.commit('updateMyInfo', myInfo)
}

export function onUserInfo(users) {
  if (!Array.isArray(users)) {
    users = [users]
  }
  users = users.map(formatUserInfo)
  store.commit('updateUserInfo', users)
}