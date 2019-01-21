/*
 * 会话列表
 */

import store from '@/store'

// 如果会话对象不是好友，需要更新好友名片
function updateSessionAccount(sessions) {
  let accountsNeedSearch = []
  sessions.forEach(item => {
    if (item.scene === 'p2p') {
      // 如果不存在缓存资料
      // if (!store.state.userInfos[item.to]) {
      //   accountsNeedSearch.push(item.to)
      // }
    }
  })
  if (accountsNeedSearch.length > 0) {
    store.dispatch('searchUsers', {
      accounts: accountsNeedSearch
    })
  }
}

// 更新本地会话
export function upsession(id) {
  nim.updateLocalSession({
    id: id,
    localCustom: '{"key","value"}',
    done: function updateLocalSessionDone(error, obj) {
      console.log(error);
      console.log(obj);
      console.log('更新本地会话' + (!error ? '成功' : '失败'));
    }
  });
}
//插入一条本地会话记录
export function insert(inp) {
  nim.insertLocalSession({
    scene: 'p2p',
    to: inp,
    done: insertLocalSessionDone
  });
  function insertLocalSessionDone(error, obj) {
    console.log('插入本地会话记录' + (!error ? '成功' : '失败'));
    if (!error) {
      onSessions(obj.session);
    }
  }
}


// onSessions只在初始化完成后回调
export function onSessions(sessions) {
  updateSessionAccount(sessions)
  store.commit('updateSessions', sessions)
}

export function onUpdateSession(session) {
  let sessions = [session]
  updateSessionAccount(sessions)
  store.commit('updateSessions', sessions)
}

export function deleteSession({ state, commit }, sessionId) {
  const nim = state.nim
  sessionId = sessionId || ''
  let scene = null
  let account = null
  if (/^p2p-/.test(sessionId)) {
    scene = 'p2p'
    account = sessionId.replace(/^p2p-/, '')
  } else if (/^team-/.test(sessionId)) {
    scene = 'team'
    account = sessionId.replace(/^team-/, '')
  }
  if (account && scene) {
    nim.deleteSession({
      scene,
      to: account,
      done: function deleteServerSessionDone(error, obj) {
        if (error) {
          alert(error)
          return
        }
        nim.deleteLocalSession({
          id: sessionId,
          done: function deleteLocalSessionDone(error, obj) {
            if (error) {
              alert(error)
              return
            }
            commit('deleteSessions', [sessionId])
          }
        })
      }
    })
  }
}

export function setCurrSession({ state, commit, dispatch }, sessionId) {
  //state.nim
  const nim = store.state.im.nim
  if (sessionId) {
    commit('updateCurrSessionId', {
      type: 'init',
      sessionId
    })
    if (nim) {
      // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
      nim.setCurrSession(sessionId)
      commit('updateCurrSessionMsgs', {
        type: 'init',
        sessionId
      })
      // 发送已读回执
      dispatch('sendMsgReceipt')
    }
  }
}

export function resetCurrSession({ state, commit }) {
  //  state.nim
  const nim = store.state.im.nim
  nim.resetCurrSession()
  commit('updateCurrSessionMsgs', {
    type: 'destroy'
  })
}
