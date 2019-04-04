import { formatUserInfo } from './userInfo'
let seached=[];
export function resetSearchResult({ state, commit }) {
  commit('updateSearchlist', {
    type: 'user',
    list: []
  })
  commit('updateSearchlist', {
    type: 'team',
    list: []
  })
}

export function searchUsers({ state, commit }, obj) {
  let { accounts, done } = obj
  const nim = state.nim
  if (!Array.isArray(accounts)) {
    accounts = [accounts]
  }
  nim.getUsers({
    accounts,
    sync: true,
    done: function searchUsersDone(error, users) {
      commit('updateSearchlist', {
        type: 'user',
        list: users
      })
      let updateUsers = users.filter(item => {
        let account = item.account;
        if(state.currSessionInfo){
            if ((state.currSessionInfo.id||state.currSessionInfo.account).indexOf(account) > -1) {
                commit('setCurrSessionInfo', item)
            }
        }
        if (item.account === state.userUID) {
          return false
        }
        let userInfo = state.userInfos[account] || {}
        if (userInfo.isFriend) {
          return false
        }
        return true
      })
      updateUsers = updateUsers.map(item => {
        return formatUserInfo(item)
      })
      commit('updateUserInfo', updateUsers)
      if (done instanceof Function) {
        done(users)
      }
    }
  })
}

export function searchTeam({ state, commit }, obj) {
  if(seached.includes(obj.teamId)){
    return
  }else {
      seached.push(obj.teamId)
  }
  let { teamId, done } = obj
  const nim = state.nim
  if (!teamId) return
  nim.getTeam({
    teamId: teamId,
    done: function searchTeamDone(error, teams) {
      if (error) {
        if (error.code === 803) {
          // 群不存在或未发生变化
          teams = []
        } else {
          console.log(error)
          return
        }
      }
      if (!Array.isArray(teams)) {
        teams = [teams]
      }
      commit('updateSearchlist', {
        type: 'team',
        list: teams
      })
      commit('mergeTeams',teams);
      if (done instanceof Function) {
        done(teams)
      }
    }
  })
}
