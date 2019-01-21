import store from '@/store'
import config from '@/configs'
import util from '@/utils'
import Bus from "@/utils/bus.js";
// store.state.im.nim 
export function formatMsg(msg) {
  const nim = store.state.im.nim
  if (msg.type === 'robot') {
    if (msg.content && msg.content.flag === 'bot') {
      if (msg.content.message) {
        msg.content.message = msg.content.message.map(item => {
          switch (item.type) {
            case 'template':
              item.content = nim.parseRobotTemplate(item.content)
              break
            case 'text':
            case 'image':
            case 'answer':
              break
          }
          return item
        })
      }
    }
  }
  return msg
}

export function onRoamingMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg)
  })
  store.commit('updateMsgs', msgs)
}

export function onOfflineMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg)
  })
  store.commit('updateMsgs', msgs)
}

export function onMsg(msg) {
  msg = formatMsg(msg)
  store.commit('putMsg', msg)
  if (msg.sessionId === store.state.im.currSessionId) {
    store.commit('updateCurrSessionMsgs', {
      type: 'put',
      msg
    })
    // 发送已读回执
    store.dispatch('sendMsgReceipt')
  }
  if (msg.scene === 'team' && msg.type === 'notification') {
    store.dispatch('onTeamNotificationMsg', msg)
  }
}

function onSendMsgDone(error, msg) {
  store.dispatch('hideLoading')
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success'
      alert(error.message)
    } else {
      alert(error.message)
    }
  }
  onMsg(msg)
}

// 消息撤回
export function onRevocateMsg(error, msg) {
  //store.state.nim ||
  const nim = store.state.im.nim
  if (error) {
    if (error.code === 508) {
      alert('发送时间超过2分钟的消息，不能被撤回')
    } else {
      alert(error)
    }
    return
  }
  let tip = ''
  if (msg.from === store.state.im.userUID) {
    tip = '你撤回了一条消息'
  } else {
    let userInfo = store.state.im.userInfos[msg.from]
    if (userInfo) {
      tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`
    } else {
      tip = '对方撤回了一条消息'
    }
  }
  nim.sendTipMsg({
    isLocal: true,
    scene: msg.scene,
    to: msg.to,
    tip,
    time: msg.time,
    done: function sendTipMsgDone(error, tipMsg) {
      let idClient = msg.deletedIdClient || msg.idClient
      store.commit('replaceMsg', {
        sessionId: msg.sessionId,
        idClient,
        msg: tipMsg
      })
      if (msg.sessionId === store.state.im.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
          type: 'replace',
          idClient,
          msg: tipMsg
        })
      }
    }
  })
}


export function revocateMsg({ state, commit }, msg) {
  //state.nim
  const nim = store.state.im.nim
  let { idClient } = msg
  msg = Object.assign(msg, state.msgsMap[idClient])
  nim.deleteMsg({
    msg,
    done: function deleteMsgDone(error) {
      onRevocateMsg(error, msg)
    }
  })
}

// 发送普通消息
export function sendMsg({ state, commit }, obj) {
  // state.nim
  const nim = store.state.im.nim
  obj = obj || {}
  let type = obj.type || ''
  console.log('type', type)
  store.dispatch('showLoading')
  switch (type) {
    case 'text':
      nim.sendText({
        isHistoryable:true,
        scene: obj.scene,
        to: obj.to,
        text: obj.text,
        done: onSendMsgDone,
        needMsgReceipt: obj.needMsgReceipt || false
      })
      break
    case 'custom':
      nim.sendCustomMsg({
        scene: obj.scene,
        to: obj.to,
        pushContent: obj.pushContent,
        content: JSON.stringify(obj.content),
        done: onSendMsgDone
      })
  }
}
//转发消息
export function forwardMsg({ state, commit }, obj) {
  // state.nim
  nim.forwardMsg({
    msg: obj.msg,
    scene: obj.scene,
    to: obj.to
  })
}
// 发送预览图片
export function previewFileMsg({ state, commit }, obj) {
  // state.nim
  let { scene, to, file } = obj;
  let type = 'image';
  // if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
  //   type = 'image'
  // } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
  //   type = 'video'
  // }
  console.log('mmmm')
  nim.sendFile({
    scene,
    to,
    file,
    type,
    done: onSendMsgDone
  });
}
// 发送文件消息
export function sendFileMsg({ state, commit }, obj) {
  // commit('setFileUrl', '')
  //state.nim
  const nim = store.state.im.nim
  if (obj.fileInput !== undefined) {
    let { scene, to, fileInput } = obj
    let type = 'file'
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
      type = 'image'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
      type = 'video'
    }
    store.dispatch('showLoading')
    // nim.previewFile({
    //   type,
    //   fileInput,
    //   uploadprogress: function (obj) {
    //     console.log('文件总大小: ' + obj.total + 'bytes');
    //     console.log('已经上传的大小: ' + obj.loaded + 'bytes');
    //     console.log('上传进度: ' + obj.percentage);
    //     console.log('上传进度文本: ' + obj.percentageText);
    //   },
    //   done: function (error, file) {
    //     console.log(file,"file")
    //     console.log('上传image' + (!error ? '成功' : '失败'), file);
    //     // show file to the user
    //     if (!error) {
    //       var msg = nim.sendFile({
    //         scene: 'p2p',
    //         to,
    //         file,
    //         done: onSendMsgDone
    //       });
    //       console.log('正在发送p2p image消息, id=' + msg.idClient);
    //     }
    //   }
    // });
    nim.sendFile({
      scene,
      to,
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
        console.log("msgfile", file);
      },
      beforesend: function (msg) {
        // console && console.log('正在发送消息, id=', msg);
      },
      done: function (error, msg) {
        onSendMsgDone(error, msg)
      }
    })
  } else {
    console.log('obj---------', obj)
    let { scene, to, file } = obj;
    // sendFile previewFile
    let type = 'file'
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(file.path)) {
      type = 'image'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(file.path)) {
      type = 'video'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(file.path)) {
      type = 'video'
    }
    let len = Object.keys(file)
    if (len.length > 0) { }
    console.log('file', file)
    var blob = new Blob([file], { type })
    nim.previewFile({
      type,
      blob,
      uploadprogress: function (obj) {
        console.log('文件总大小: ' + obj.total + 'bytes');
        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
        console.log('上传进度: ' + obj.percentage);
        console.log('上传进度文本: ' + obj.percentageText);
        console.log('obj ' + obj.url);
      },
      done: function (error, file) {
        console.log('上传image' + (!error ? '成功' : '失败'), file, type, error, "错误", blob);
        // show file to the user
        if (!error) {
          console.log('ggg',file.url)
          // var msg = nim.sendFile({
          //   scene,
          //   to,
          //   file,
          //   type,
          //   done: onSendMsgDone
          // });
          // console.log('正在发送p2p image消息, id=', msg.idClient, type);
          // Bus.$emit("fileUrl",file.url)
          Bus.$emit("fileUrl",file)
        }
      }
    });
  }
}

// 发送机器人消息
export function sendRobotMsg({ state, commit }, obj) {
  //state.nim
  const nim = store.state.im.nim
  let { type, scene, to, robotAccid, content, params, target, body } = obj
  scene = scene || 'p2p'
  if (type === 'text') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
      content: {
        type: 'text',
        content,
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'welcome') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
      content: {
        type: 'welcome',
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'link') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
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

// 发送消息已读回执
export function sendMsgReceipt({ state, commit }) {
  // 如果有当前会话
  let currSessionId = store.state.im.currSessionId
  if (currSessionId) {
    // 只有点对点消息才发已读回执
    if (util.parseSession(currSessionId).scene === 'p2p') {
      let msgs = store.state.im.currSessionMsgs
      const nim = state.nim
      if (state.sessionMap[currSessionId]) {
        nim.sendMsgReceipt({
          msg: state.sessionMap[currSessionId].lastMsg,
          done: function sendMsgReceiptDone(error, obj) {
            // do something
          }
        })
      }
    }
  }
}

function sendMsgReceiptDone(error, obj) {
  console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
}
// 获取历史消息
export function getHistoryMsgs({ state, commit }, obj) {
  // state.nim
  const nim = store.state.im.nim
  if (nim) {
    let { scene, to } = obj
    let options = {
      scene,
      to,
      reverse: false,
      asc: true,
      limit: config.localMsglimit || 20,
      done: function getHistoryMsgsDone(error, obj) {
        if (obj.msgs) {
          if (obj.msgs.length === 0) {
            commit('setNoMoreHistoryMsgs')
          } else {
            let msgs = obj.msgs.map(msg => {
              return formatMsg(msg)
            })
            commit('updateCurrSessionMsgs', {
              type: 'concat',
              msgs: msgs
            })
          }
        }
        store.dispatch('hideLoading')
      }
    }
    if (state.currSessionLastMsg) {
      options = Object.assign(options, {
        lastMsgId: state.currSessionLastMsg.idServer,
        endTime: state.currSessionLastMsg.time,
      })
    }
    store.dispatch('showLoading')
    nim.getHistoryMsgs(options)
  }
}

export function resetNoMoreHistoryMsgs({ commit }) {
  commit('resetNoMoreHistoryMsgs')
}

// 继续与机器人会话交互
export function continueRobotMsg({ commit }, robotAccid) {
  commit('continueRobotMsg', robotAccid)
}


export function deleteMsg({ commit, state }, obj) {
  console.log("msgs", obj)
  const nim = state.nim
  if (nim) {
    let msg = obj.msg
    nim.deleteLocalMsg({
      msg: msg,
      done: function deleteLocalMsgDone(error, obj) {
        console.log('删除本地消息' + (!error ? '成功' : '失败'), error, obj);
        // commit('updateCurrSessionMsgs', { type: 'init' })
      }
    })
  }
}

// 获取本地历史记录   getLocalMsgs
export function getLocalMsgs({ state, commit }, obj) {
  const nim = state.nim
  let { sessionId } = obj
  if (nim) {
    nim.getLocalMsgs({
      sessionId: sessionId,
      limit: config.localMsglimit || 20,
      done: function getLocalSessionsDone(error, obj) {
        // console.log('获取本地消息' + (!error ? '成功' : '失败'), error, obj)
        if (obj.msgs) {
          if (obj.msgs.length === 0) {
            commit('setNoMoreHistoryMsgs')
          } else {
            let msgs = obj.msgs.map(msg => {
              return formatMsg(msg)
            })
            commit('updateCurrSessionMsgs', {
              type: 'concat',
              msgs: msgs
            })
          }
        }
      }
    });
  }
}