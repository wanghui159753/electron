import store from '@/store'
// 用于demo记录封面
export function initChatroomInfos ({state, commit}, obj) {
  commit('initChatroomInfos', obj)
}

export function getChatroomInfo ({state, commit, dispatch}) {
  const chatroom = state.currChatroom
  if (chatroom) {
    chatroom.getChatroom({
      done: function getChatroomDone (error, info) {
        if (error) {
          console.log(error.message)
          return
        }
        info = info.chatroom || {creator: ''}
        let creator = info.creator
        chatroom.getChatroomMembersInfo({
          accounts: [creator],
          done: function getChatroomMembersInfoDone (error, user) {
            if (error) {
              console.log(error.message)
              return
            }
            commit('getChatroomInfo', Object.assign(info,  {actor: user.members[0]}))
          }
        })
      }
    })
  }
}

export function getChatroomMembers ({state, commit, dispatch}) {
  // 先拉管理员
  getChatroomMembersLocal (false, function (obj) {
    commit('updateChatroomMembers', Object.assign(obj, {type: 'put'}))
    // 再拉成员列表
    getChatroomMembersLocal (true, function (obj) {
      commit('updateChatroomMembers', Object.assign(obj, {type: 'put'}))
    })
  })
}
// 获取管理员信息
function getChatroomMembersLocal (isGuest, callback) {
  const chatroom = store.state.currChatroom
  if (chatroom) {
    chatroom.getChatroomMembers({
      guest: isGuest,
      limit: 100,
      done: function getChatroomMembersDone (error, obj) {
        if (error) {
          console.log(error.message)
          return
        }
        callback(obj)
      }
    })
  }
}

export function clearChatroomMembers ({state, commit}) {
  commit('updateChatroomMembers', {type: 'destroy'})
}