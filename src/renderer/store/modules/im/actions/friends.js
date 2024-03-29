/*
 * 用户关系及好友关系托管
 */

import store from '@/store'
import { formatUserInfo } from './userInfo'

// 好友关系，回调
export function onFriends(friends) {
  friends = friends.map(item => {
    if (typeof item.isFriend !== 'boolean') {
      item.isFriend = true
    }
    return item
  })
  store.commit('updateFriends', friends)
  // 更新好友信息字典，诸如昵称
  store.commit('updateUserInfo', friends)
}

// 更新好友资料，添加好友成功
export function onUpdateFriend(error, friends) {
  if (error) {
    console.log(error)
    return
  }
  if (!Array.isArray(friends)) {
    friends = [friends]
  }

  friends = friends.map(item => {
    if (typeof item.isFriend !== 'boolean') {
      item.isFriend = true
    }
    return item
  })

  // 补充好友资料
  store.dispatch('searchUsers', {
    accounts: friends.map(item => {
      console.log(item)
      return item.account
    }),
    done: (users) => {
      const nim = store.state.im.nim //store.state.im.nim
      friends = nim.mergeFriends(friends, users).map(formatUserInfo)
      // 更新好友列表
      store.commit('updateFriends', friends)
      // 更新好友资料
      store.commit('updateUserInfo', friends)
    }
  })
}

// 删除好友，这里使用标记删除
export function onDeleteFriend(error, friends) {
  if (error) {
    console.log(error)
    return
  }
  if (!Array.isArray(friends)) {
    friends = [friends]
  }
  friends = friends.map(item => {
    item.isFriend = false
    return item
  })
  // 更新好友列表
  store.commit('updateFriends', [], friends)
  // 更新好友资料
  store.commit('updateUserInfo', friends)
}

export function onSyncFriendAction(obj) {
  switch (obj.type) {
    case 'addFriend':
      // console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
      onUpdateFriend(null, obj.friend);
      break;
    case 'applyFriend':
     console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
      break;
    case 'passFriendApply':
      console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
      onUpdateFriend(null, obj.friend);
      break;
    case 'rejectFriendApply':
    console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
      break;
    case 'deleteFriend':
      // console.log('你在其它端删了一个好友' + obj.account);
      onDeleteFriend(null, {
        account: obj.account
      });
      break;
    case 'updateFriend':
      // console.log('你在其它端更新了一个好友', obj.friend);
      onUpdateFriend(null, obj.friend);
      break;
  }
}

// 更新好友昵称
export function updateFriend({ state, commit }, friend) {
  const nim = state.nim
  nim.updateFriend({
    account: friend.account,
    alias: friend.alias,
    done: onUpdateFriend
  })
}


  // addFriend直接加好友
export function addFriend({ state, commit }, obj) {
  let { account, ps } = obj;
  let nim = state.nim
  nim.addFriend({
    account,
    ps,
    done: onUpdateFriend
  })
  console.log("发送好友信息完成.......................")
}
// applyFriend 申请加好友
export function applyFriend({ state, commit }, obj) {
  let { account, ps } = obj;
  let nim = state.nim
  nim.applyFriend({
    account,
    ps,
    done: applyFriendDone
  })
}

export function deleteFriend({ state, commit }, account) {
  const nim = state.nim
  nim.deleteFriend({
    account, 
    done: onDeleteFriend
  })
}


export function applyFriendDone(error, obj) {
  console.log('申请加为好友' + (!error?'成功':'失败'), error, obj);
}