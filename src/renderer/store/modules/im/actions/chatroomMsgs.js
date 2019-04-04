import store from '@/store'
import config from '@/configs'
// import util from '@/utils'
import { formatMsg } from './msgs'
import { onCreateTeam } from './team'

//创建群聊
export function newChatRoom({ state }, objs) {
  const nim = state.nim
  nim.createTeam({
    type: objs.type,
    name: objs.name,
    avatar: 'https://cdn.xindongpeixun.com/oss/20181214/d0a3e0fd19a64fa196acad5a491e40f0.png',
    accounts: objs.accounts,
    joinMode: 'noVerify',
    inviteMode: 'all',
    updateCustomMode: 'manager',
    updateTeamMode: 'manager',
    beInviteMode: 'noVerify',
    ps: '我建了一个普通群',
    done: createTeamDone
  });

    function createTeamDone(error, obj) {
        console.log('创建' + obj.team.type + '群' + (!error ? '成功' : '失败'), error, obj);
        if (!error) {
            onCreateTeam(obj.team, obj.owner);
            objs.done(obj.team)
        }
    }
}
//群成员拉人入群
export function teamAdd({ state }, obj) {
  console.error(obj)
  nim.addTeamMembers({
    teamId: obj.id,
    accounts: obj.accounts,
    ps: '加入我们的群吧',
    done: addTeamMembersDone
  });
}

function addTeamMembersDone(error, obj) {
  store.dispatch('getChatGroup', { id: store.state.im.currReceiptQueryTeamId, teamId: obj.teamId })
  console.log('入群邀请发送' + (!error ? '成功' : '失败'), error, obj);
}

//退出群聊

export function leaveTeam({ state }, obj) {
  nim.leaveTeam({
    teamId: obj.id,
    done: leaveTeamDone
  });
  function leaveTeamDone(error, obj) {
        store.dispatch(
            "deleteSession",
            'team-' + obj.teamId
        );
        if(obj.done){
            obj.done()
        }
        console.log('主动退群' + (!error ? '成功' : '失败'), error, obj);
    }
}



//转让群聊
export function transferTeam({ state }, obj) {
  nim.transferTeam({
    teamId: obj.id,
    account: obj.accounts[0],
    leave: false,
    done: transferOwnerDone
  });
}

function transferOwnerDone(error, obj) {
  store.dispatch('getChatGroup', { id: obj.teamId, teamId: obj.teamId })
  console.log('转让群' + (!error ? '成功' : '失败'), error);
}

//解散群
export function dismissTeam({ state },obj) {
    nim.dismissTeam({
        teamId: obj.id,
        done: dismissTeamDone
    });
    function dismissTeamDone(error, objs) {
        console.log('解散群' + (!error?'成功':'失败'), error, objs);
        store.dispatch(
            "deleteSession",
            'team-' + objs.teamId
        );
        if(obj.done){
          obj.done(objs)
        }
    }
}



//踢人出群
export function removeTeamMembers({ state }, obj) {
  nim.removeTeamMembers({
    teamId: obj.id,
    accounts: obj.accounts,
    done: removeTeamMembersDone
  });
}

function removeTeamMembersDone(error, obj) {
  console.log('踢人出群' + (!error ? '成功' : '失败'), error, obj);
  store.dispatch('getChatGroup', { id: store.state.im.currReceiptQueryTeamId, teamId: obj.teamId })
}
//修改群信息
export function upinfo({ state }, obj) {
  nim.updateTeam({
    teamId: obj.id,
    name: obj.name,
    announcement: obj.announcement,
    done: updateTeamDone
  });
}
function updateTeamDone(error, team) {
  store.dispatch('getChatGroup', { id: store.state.im.currReceiptQueryTeamId, teamId: team.teamId })
  console.log('更新群' + (!error ? '成功' : '失败'), error, team);
  if (team.teamId == store.state.im.currSessionInfo.to) {
    store.commit('setCurrSessionInfo', team)
  }
}
//修改群昵称及消息免打扰
export function setNick({ state }, obj) {
  console.log(obj,'----------')
  nim.updateInfoInTeam({
    teamId: obj.id,
    // 此参数为可选参数
    nickInTeam: obj.name,
    // 静音群, 此参数为可选参数
    muteTeam: obj.mute,
    // 第三方扩展字段
    // custom: '{}'
    done: updateInfoInTeamDone
  });
}
function updateInfoInTeamDone(error, obj) {
  if (obj.muteTeam !== undefined || obj.nickInTeam !== undefined) {
    let Obj = store.state.im.currChatroomInfo;
    Obj.mute = obj.muteTeam;
    Obj.teamId = obj.teamId;
    store.commit('updateChatroomInfo', Obj)
  }

  store.dispatch('getChatGroup', { id: store.state.im.currReceiptQueryTeamId, teamId: obj.teamId })
  console.log('修改自己的群属性' + (!error ? '成功' : '失败'), error );
}

//查询是否消息免打扰
export function isMute({ state }, obj) {
  if (obj.id && Array.isArray(obj.id)&& obj.id.length>0) {
    nim.notifyForNewTeamMsg({
      teamIds: obj.id,
      done: notifyForNewTeamMsgDone
    })
  }

}
function notifyForNewTeamMsgDone(error, map) {
  if (error) return false
  store.commit('setGroupMuteList', map)
  console.log('查询是否需要群消息通知' + (!error ? '成功' : '失败'));
}


export function onChatroomMsgs(msgs) {

  if (!Array.isArray(msgs)) {
    msgs = [msgs]
  }
  msgs = msgs.map(msg => {
    return formatMsg(msg)
  })
  if (store.state.currChatroomId) {
    store.commit('updateCurrChatroomMsgs', {
      type: 'put',
      msgs
    })
  }
}
// 消息发送完成
function onSendMsgDone(error, msg) {
  store.dispatch('hideLoading')
  if (error) {
    alert(error.message)
    return
  }
  onChatroomMsgs([msg])
}
// 发送聊天室消息
export function sendChatroomMsg({ state, commit }, obj) {
  const chatroom = state.currChatroom
  obj = obj || {}
  let type = obj.type || ''
  store.dispatch('showLoading')
  switch (type) {
    case 'text':
      chatroom.sendText({
        text: obj.text,
        done: onSendMsgDone
      })
      break
    case 'custom':
      chatroom.sendCustomMsg({
        content: JSON.stringify(obj.content),
        pushContent: obj.pushContent,
        done: onSendMsgDone
      })
  }
}
// 发送聊天室机器人消息
export function sendChatroomRobotMsg({ state, commit }, obj) {
  const chatroom = state.currChatroom
  let { type, robotAccid, content, params, target, body } = obj
  if (type === 'text') {
    chatroom.sendRobotMsg({
      robotAccid,
      content: {
        type: 'text',
        content,
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'welcome') {
    chatroom.sendRobotMsg({
      robotAccid,
      content: {
        type: 'welcome',
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'link') {
    chatroom.sendRobotMsg({
      robotAccid,
      content: {
        type: 'link',
        params,
        target
      },
      body,
      done: onSendMsgDone
    })
  }
}

export function sendChatroomFileMsg({ state, commit }, obj) {
  const chatroom = state.currChatroom
  let { fileInput } = Object.assign({}, obj)
  let type = 'file'
  if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
    type = 'image'
  } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
    type = 'video'
  }
  store.dispatch('showLoading')
  chatroom.sendFile({
    type,
    fileInput,
    uploadprogress: function (data) {
      // console.log(data.percentageText)
    },
    uploaderror: function () {
      console && console.log('上传失败')
    },
    uploaddone: function (error, file) {
      // console.log(error);
      // console.log(file);
    },
    beforesend: function (msg) {
      // console && console.log('正在发送消息, id=', msg);
    },
    done: function (error, msg) {
      onSendMsgDone(error, msg)
    }
  })
}


export function getChatroomHistoryMsgs({ state, commit }, obj) {
  const chatroom = state.currChatroom
  if (chatroom) {
    let { timetag } = Object.assign({}, obj)
    let options = {
      timetag,
      limit: config.localMsglimit || 20,
      done: function getChatroomHistoryMsgsDone(error, obj) {
        if (obj.msgs) {
          if (obj.msgs.length === 0) {
            commit('setNoMoreHistoryMsgs')
          } else {
            let msgs = obj.msgs.map(msg => {
              return formatMsg(msg)
            })
            commit('updateCurrChatroomMsgs', {
              type: 'concat',
              msgs
            })
          }
        }
        store.dispatch('hideLoading')
      }
    }
    store.dispatch('showLoading')
    nim.getHistoryMsgs(options)
  }
}
