import store from '@/store'
// 收到群列表及更新群列表接口
export function onTeams(teams) {
  if (teams) {
    if (!Array.isArray(teams)) {
      teams = [teams]
    }
    let arr = []
    teams.forEach(team => {
      if (store.state.im.currChatroomId == 'team-' + team.teamId) {
        store.dispatch('getChatGroup', { id: team.teamId })
      }
      arr.push(team.teamId)
    })
    store.dispatch('isMute', { id: arr })
    store.commit('updateTeamList', teams)
  }
}

// 收到群成员及更新群成员接口
export function onTeamMembers(obj) {
  store.commit('updateTeamMembers', obj)
}
//更新当前群成员ji群信息
export function getChatGroup(str, obj) {
  function get(arr,chatRoom){
      store.dispatch("searchUsers", {
          accounts: arr,
          done: obj => {
              obj.map(item => {
                  item.nickInTeam = chatRoom[item.account].nickInTeam;
              });
              commit("setTeamMembers", obj);
              commit("updateUserInfo", obj);
          }
      });
  }
  let { state, commit } = str || store
  if (obj.id || obj.teamId) {
    let id = obj.teamId ? obj.teamId : obj.id.substring(5);
    store.dispatch("getTeamMembers", {
      teamId: id,
      done: (error, obj) => {
        if (error) {
         store.dispatch("connect");
          // return  getChatGroup(str, obj);
        } else {
          let chatRoom = {};
          obj.members.forEach(item => {
            chatRoom[item.account] = item;
          });
          commit("setCurrChatroom", { chatRoom, id: obj.id });
          let arr=Object.keys(state.currChatroomMembers);
          if(arr.length<150){
              get(arr,chatRoom)
          }else{
              for (let i=0;i<arr.length/150+1;i++){
                  get(arr.slice(i,150*(i+1)),chatRoom)
              }
          }
        }
      }
    });
  }
}

export function onCreateTeam(obj) {
  onTeams(obj)
  onTeamMembers({
    teamId: obj.teamId,
    members: [obj.owner]
  })
}

export function onSynCreateTeam(team) {
  onTeams(team)
}

export function onDismissTeam(obj) {
  store.commit('updateTeamList', {
    invalid: { teamId: obj.teamId }
  })
}

export function onUpdateTeam(team) {
  onTeams(team)
}

export function onTeamNotificationMsg({ state, commit }, msg) {
  if (msg.attach.type === 'updateTeam' && msg.attach.team) {
    store.commit('updateTeamInfo', msg.attach.team)
  }
  if (msg.attach.type === 'transferTeam') {
    onTeamMembers({
      teamId: msg.attach.team.teamId,
      members: msg.attach.members
    })
  }
}

export function onAddTeamMembers(obj) {
  obj.accounts.forEach(account => {
    // 自己被拉入群时更新群列表
    if (account === store.state.userUID) {
      let team = [obj.team]
      onTeams(team)
    }
  })
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onRemoveTeamMembers(obj) {
  obj.accounts.forEach(account => {
    // 自己被移出群时，更新群列表
    if (account === store.state.userUID) {
      obj.team.validToCurrentUser = false
      let team = [obj.team]
      onTeams(team)
    }
  })
  store.commit('removeTeamMembersByAccounts', {
    teamId: obj.team.teamId,
    accounts: obj.accounts
  })
}

export function onUpdateTeamMember(teamMember) {
  onTeamMembers({
    teamId: teamMember.teamId,
    members: teamMember
  })
}

export function onUpdateTeamMembersMute(obj) {
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onUpdateTeamManagers(obj) {
  onTeamMembers({
    teamId: obj.team.teamId,
    members: obj.members
  })
}

export function onTeamMsgReceipt(obj) {
  obj.teamMsgReceipts.forEach(item => {
    if (item.teamId === store.state.currReceiptQueryTeamId) {
      store.commit('updateSingleTeamMsgReads', item)
    }
  })
  console.log('群消息回执通知' + obj)
}

// 进入可配置的群信息设置页，进入前改变state中的配置信息，进入页面后读取配置信息更新视图
export function enterSettingPage({ commit }, obj) {
  commit('updateTeamSettingConfig', obj)
  setTimeout(() => {
    location.href = `#/teamsetting`
  }, 20)
}


/* 
* 代理nim sdk中对群组的操作方法
* @functionName  nim sdk中的方法名
* @options 传递给sdk方法的参数
*/
export function delegateTeamFunction({ state }, { functionName, options }) {
  const nim = state.nim
  if (functionName && nim[functionName] && typeof nim[functionName] === 'function') {
    nim[functionName](options)
  } else {
    throw (`There is not property of '${functionName}' in nim or '${functionName}' is not a function`)
  }
}

export function getTeamMembers({ state }, { teamId, done }) {
  const nim = state.nim
  if (!nim) {
    // 防止nim未初始化
    setTimeout(() => {
      getTeamMembers(store, teamId)
    }, 200);
    return
  }
  nim.getTeamMembers({
    teamId: teamId,
    done
  })
  // : (err, obj) => {
  //   console.log(obj,'群众查询结果')
  //   if (obj.members) {
  //     onTeamMembers({
  //       teamId: obj.teamId,
  //       members: obj.members
  //     })
  //   } else {
  //     setTimeout(() => {
  //       getTeamMembers(store, teamId)
  //     }, 200);
  //   }
  // }
}

export function checkTeamMsgReceipt({ state }, msgs) {
  var result = /team-(\d+)/.exec(state.currSessionId)
  if (!result) {
    return null
  }
  var teamId = result[1]

  var needToPeceiptList = getMsgNeedToReceipt(state, teamId, msgs)
  if (needToPeceiptList && needToPeceiptList.length > 0) {
    nim.sendTeamMsgReceipt({
      teamMsgReceipts: needToPeceiptList,
      done: (err, obj, content) => {
        console.log('标记群组消息已读' + (!err ? '成功' : '失败'));
        if (!err) {
          store.commit('updateSentReceipedMap', needToPeceiptList)
        }
      }
    })
  }

  store.commit('updateReceiptQueryList', {
    teamId: teamId,
    msgs: msgs
  })
}

// 查询需要发送回执的消息
function getMsgNeedToReceipt(state, teamId, msgs) {
  var sentReceipedList = state.sentReceipedMap[teamId] || []
  var needToReceipt = msgs.filter(msg => {
    // 需要回执，且未发送过
    return msg.needMsgReceipt && msg.from !== state.myInfo.account && !sentReceipedList.find(id => id === msg.idServer)
  }).map(msg => {
    return {
      teamId: teamId,
      idServer: msg.idServer
    }
  })
  return needToReceipt
}

export function getTeamMsgReads({ state }, needQuery) {
  nim.getTeamMsgReads({
    teamMsgReceipts: needQuery,
    done: (error, obj, content) => {
      if (error) {
        console.log('获取群组消息已读' + error)
      } else {
        console.log('获取群组消息已读：', content)
        store.commit('updateTeamMsgReads', content)
      }
    }
  })
}
