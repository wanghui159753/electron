// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

import store from '@/store'
import cookie from '@/utils/cookie'
import util from '@/utils'
import config from '@/configs'
import Vue from 'Vue'
import {Store} from 'vuex';

export default {
    //合并群组列表
    mergeTeams(state,arr){
       state.teamlist= state.nim.mergeTeams(state.teamlist,arr)
    },
    setCurrSessionInfo(state, obj) {
        state.currSessionInfo = obj;
        // obj.
    },
    setNimcurrenSession(state, id) {
        state.nim.setCurrSession(id)
    },
    //im错误返回
    setError(state, error) {
        console.log(error)
        state.error = error
    },
    //群消息免打扰
    setGroupMuteList(state, obj) {
        state.muteList = Object.assign(state.muteList, obj)
    },
    //更新好友名片
    getUser(state, obj) {
        console.log('查找个人信息')
        let {id} = obj;
        if (typeof id == 'object') {
            nim.getUsers({
                accounts: id,
                done(error, obj) {
                    obj.forEach(item => {
                        store.commit("updateUserInfo", item);
                    })
                }
            })
        } else {
            nim.getUser({
                account: id,
                done(error, obj) {
                    store.commit("updateUserInfo", obj);
                }
            });
        }
    },
    updateRefreshState(state) {
        state.isRefresh = false
    },
    updateLoading(state, status) {
        clearTimeout(state.loadingTimer)
        state.loadingTimer = setTimeout(() => {
            state.isLoading = status
        }, 20)
    },
    updateFullscreenImage(state, obj) {
        obj = obj || {}
        if (obj.src && obj.type === 'show') {
            state.fullscreenImgSrc = obj.src
            state.isFullscreenImgShow = true
        } else if (obj.type === 'hide') {
            state.fullscreenImgSrc = ' '
            state.isFullscreenImgShow = false
        }
    },
    setLoading(state, flag) {
        store.state.app.loading = flag
    },
    updateUserUID(state, loginInfo) {
        state.userUID = loginInfo.uid
        state.sdktoken = loginInfo.sdktoken
        cookie.setCookie('uid', loginInfo.uid)
        cookie.setCookie('sdktoken', loginInfo.sdktoken)
    },
    updateMyInfo(state, myInfo) {
        state.myInfo = util.mergeObject(state.myInfo, myInfo)
    },
    updateUserInfo(state, users) {
        let userInfos = state.userInfos
        if (users) {
            users.length ?
                users.forEach(user => {
                    let account = user.account
                    if (account) {
                        userInfos[account] = util.mergeObject(userInfos[account], user)
                    }
                }) : userInfos[users.account] = util.mergeObject(userInfos[users.account], users);
            state.userInfos = util.mergeObject(state.userInfos, userInfos)
        }
    },
    updateFriends(state, friends, cutFriends = []) {
        const nim = state.nim
        state.friendslist = nim.mergeFriends(state.friendslist, friends)
        state.friendslist = nim.cutFriends(state.friendslist, cutFriends)
        state.friendslist = nim.cutFriends(state.friendslist, friends.invalid)
    },
    updateRobots(state, robots) {
        const nim = state.nim
        robots = robots.map(item => {
            if (item.avatar) {
                item.originAvatar = item.avatar
                item.avatar = nim.viewImageSync({
                    url: item.avatar, // 必填
                    thumbnail: { // 生成缩略图， 可选填
                        width: 40,
                        height: 40,
                        mode: 'cover'
                    }
                })
            } else {
                item.avatar = config.defaultUserIcon
            }
            return item
        })
        state.robotslist = robots
        state.robotInfos = Object.create(null)
        robots.forEach(robot => {
            state.robotInfos[robot.account] = robot
            state.robotInfosByNick[robot.nick] = robot
        })
    },
    updateBlacklist(state, blacks) {
        const nim = state.nim
        state.blacklist = nim.cutFriends(state.blacklist, blacks.invalid)
        let addBlacks = blacks.filter(item => {
            return item.isBlack === true
        })
        let remBlacks = blacks.filter(item => {
            return item.isBlack === false
        })
        // 添加黑名单
        state.blacklist = nim.mergeFriends(state.blacklist, addBlacks)
        // 解除黑名单
        state.blacklist = nim.cutFriends(state.blacklist, remBlacks)
    },
    updateSearchlist(state, obj) {
        const type = obj.type
        switch (type) {
            case 'user':
                if (obj.list.length !== 0 || state.searchedUsers.length !== 0) {
                    state.searchedUsers = obj.list
                } else {
                    state.searchedUsers = []
                }
                break
            case 'team':
                if (obj.list.length !== 0 || state.searchedTeams.length !== 0) {
                    state.searchedTeams = obj.list
                } else {
                    state.searchedTeams = []
                }
                break
        }
    },
    updateSessions(state, sessions) {
        const nim = state.nim;
        state.sessionlist = nim.mergeSessions(state.sessionlist, sessions)
        state.sessionlist.sort((a, b) => {
            return b.updateTime - a.updateTime
        })
        let accounts = []
        state.sessionlist.map(item => {
            state.sessionMap[item.id] = item
            if (!item.avatar && item.scene != 'team') {
                accounts.push(item.id.substring(4))
            }
        })
        if(state.currSessionMsgs){
            let msg=JSON.parse(JSON.stringify(state.currSessionMsgs));
            msg.map(item=>{
                if(sessions.constructor==Array){
                    sessions=sessions[0]
                }
                if(item.type !=='timeTag' && sessions.msgReceiptTime && sessions.msgReceiptTime >= item.time ){
                    Vue.set(item,'isRead',true)
                }else
                Vue.set(item,'isRead',false)
            })
            state.currSessionMsgs=msg;
        }
        accounts.length ? store.commit("getUser", {id: accounts}) : null
    },

    deleteSessions(state, sessionIds) {
        const nim = state.nim
        state.sessionlist = nim.cutSessionsByIds(state.sessionlist, sessionIds)
    },
    // 初始化，收到离线漫游消息时调用
    updateMsgs(state, msgs) {
        const nim = state.nim
        let tempSessionMap = {}
        msgs.forEach(msg => {
            let sessionId = msg.sessionId
            tempSessionMap[sessionId] = true
            if (!state.msgs[sessionId]) {
                state.msgs[sessionId] = []
            }
            // sdk会做消息去重
            state.msgs[sessionId] = nim.mergeMsgs(state.msgs[sessionId], [msg])
        })
        store.commit('updateMsgByIdClient', msgs)
        for (let sessionId in tempSessionMap) {
            state.msgs[sessionId].sort((a, b) => {
                if (a.time === b.time) {
                    // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
                    if (a.type === 'robot' && b.type === 'robot') {
                        if (a.content && a.content.msgOut) {
                            return 1
                        }
                        if (b.content && b.content.msgOut) {
                            return -1
                        }
                    }
                }
                return a.time - b.time
            })
            if (sessionId === state.currSessionId) {
                store.commit('updateCurrSessionMsgs', {
                    type: 'init'
                })
            }
        }
    },
    // 更新追加消息，追加一条消息
    putMsg(state, msg) {
        let sessionId = msg.sessionId
        if (!state.msgs[sessionId]) {
            state.msgs[sessionId] = []
        }
        store.commit('updateMsgByIdClient', msg)
        let tempMsgs = state.msgs[sessionId]
        let lastMsgIndex = tempMsgs.length - 1
        if (tempMsgs.length === 0 || msg.time >= tempMsgs[lastMsgIndex].time) {
            tempMsgs.push(msg)
        } else {
            for (let i = lastMsgIndex; i >= 0; i--) {
                let currMsg = tempMsgs[i]
                if (msg.time >= currMsg.time) {
                    state.msgs[sessionId].splice(i, 0, msg)
                    break
                }
            }
        }
    },

    // 删除消息列表消息
    deleteMsg(state, msg) {
        let sessionId = msg.sessionId
        let tempMsgs = state.msgs[sessionId]
        if (!tempMsgs || tempMsgs.length === 0) {
            return
        }
        let lastMsgIndex = tempMsgs.length - 1
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            if (msg.idClient === currMsg.idClient) {
                state.msgs[sessionId].splice(i, 1)
                break
            }
        }
    },
    // 替换消息列表消息，如消息撤回
    replaceMsg(state, obj) {
        let {sessionId, idClient, msg} = obj
        let tempMsgs = state.msgs[sessionId]
        if (!tempMsgs || tempMsgs.length === 0) {
            return
        }
        let lastMsgIndex = tempMsgs.length - 1
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            if (idClient === currMsg.idClient) {
                state.msgs[sessionId].splice(i, 1, msg)
                break
            }
        }
    },
    // 用idClient 更新消息，目前用于消息撤回
    updateMsgByIdClient(state, msgs) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs]
        }
        let tempTime = (new Date()).getTime()
        msgs.forEach(msg => {
            // 有idClient 且 5分钟以内的消息
            if (msg.idClient && (tempTime - msg.time < 1000 * 300)) {
                state.msgsMap[msg.idClient] = msg
            }
        })
    },
    //更新当前未读最后一条
    setCurrSessionLastMsg(state, obj) {
        state.currSessionLastMsg = obj
    },
    // 更新当前会话id，用于唯一判定是否在current session状态
    updateCurrSessionId(state, obj) {
        let type = obj.type || ''
        if (type === 'destroy') {
            state.currSessionId = null
        } else if (type === 'init') {
            if (obj.sessionId && (obj.sessionId !== state.currSessionId)) {
                state.currSessionId = obj.sessionId
            }
        }
    },
    // 更新当前会话列表的聊天记录，包括历史消息、单聊消息等，不包括聊天室消息
    // replace: 替换idClient的消息
    updateCurrSessionMsgs(state, obj) {
        let type = obj.type || ''
        if (type === 'replace') {
            let arr = state.currSessionMsgs
            for (let i = arr.length - 1; i > 0; i--) {
                if (arr[i].type == 'timeTag' || arr[i].type == 'tip') continue
                if (arr[i].idClient === obj.idClient) {
                    arr.splice(i, 1, obj.msg)
                    return;
                }
            }
        } else if (type === 'destroy') { // 清空会话消息
            state.currSessionMsgs = []
            state.currSessionLastMsg = null
            store.commit('updateCurrSessionId', {
                type: 'destroy'
            })
        } else if (type === 'init') { // 初始化会话消息列表
            state.currSessionMsgs = []
            // if (state.currSessionId) {
            //   let sessionId = state.currSessionId
            //   let currSessionMsgs = [].concat(state.msgs[sessionId] || [])
            //   // 做消息截断
            //   let limit = config.localMsglimit
            //   let msgLen = currSessionMsgs.length
            //   if (msgLen - limit > 0) {
            //     currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen)
            //   }
            //   state.currSessionMsgs = currSessionMsgs;
            //   store.dispatch('checkTeamMsgReceipt', state.currSessionMsgs)
            // }

        } else if (type === 'put') { // 追加一条消息
            if(state.currSessionMsgs.length){
                if(obj.msg.idClient==state.currSessionMsgs[state.currSessionMsgs.length-1].idClient){
                    return
                }
            }
            let newMsg = obj.msg
            let lastMsgTime = 0
            let lenCurrMsgs = state.currSessionMsgs.length
            if (lenCurrMsgs > 0) {
                lastMsgTime = state.currSessionMsgs[lenCurrMsgs - 1].time
            }
            if (newMsg) {
                if ((newMsg.time - lastMsgTime) > 1000 * 60 * 5) {
                    state.currSessionMsgs.push({
                        type: 'timeTag',
                        text: util.formatDate(newMsg.time, false)
                    })
                }
                state.currSessionMsgs.push(newMsg)
                store.dispatch('checkTeamMsgReceipt', [newMsg])
            }
        } else if (type === 'concat') {
            // 一般用于历史消息拼接
            let currSessionMsgs = []
            let lastMsgTime = 0;
            var list = obj.msgs.reverse();
            list.forEach(msg => {
                if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                    lastMsgTime = msg.time;
                    currSessionMsgs.push({
                        type: 'timeTag',
                        text: util.formatDate(msg.time, false)
                    })
                }
                currSessionMsgs.push(msg)
            })
            state.currSessionMsgs = currSessionMsgs;
        }

    },
    updateSysMsgs(state, sysMsgs) {
        const nim = state.nim
        if (!Array.isArray(sysMsgs)) {
            sysMsgs = [sysMsgs]
        }
        sysMsgs = sysMsgs.map(msg => {
            msg.showTime = util.formatDate(msg.time, false)
            return msg
        })
        // state.sysMsgs = nim.mergeSysMsgs(state.sysMsgs, sysMsgs)
        //state.sysMsgs = [].concat(nim.mergeSysMsgs(state.sysMsgs, sysMsgs))

        //对象去重
        Array.prototype.unique = function (key) {
            var arr = this;
            var n = [arr[0]];
            for (var i = 1; i < arr.length; i++) {
                if (key === undefined) {
                    if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
                } else {
                    inner: {
                        var has = false;
                        for (var j = 0; j < n.length; j++) {
                            if (arr[i][key] == n[j][key]) {
                                has = true;
                                break inner;
                            }
                        }
                    }
                    if (!has) {
                        n.push(arr[i]);
                    }
                }
            }
            return n;
        }
        state.sysMsgs = [].concat(nim.mergeSysMsgs(state.sysMsgs, sysMsgs))
        state.sysMsgs = state.sysMsgs.unique("from")
        Vue.set(state, 'sysMsgs', state.sysMsgs)
    },
    // 更新消息的状态，如管理员批准或拒绝入群后，会收到新消息，更新入群申请的状态
    updateSysMsgState(state, sysMsg) {
        let exitMsg = state.sysMsgs.find(msg => {
            return msg.idServer === sysMsg.idServer
        })
        if (exitMsg) {
            exitMsg.state = sysMsg.state
        }
    },
    updateSysMsgUnread(state, obj) {
        console.error(obj, "-------un")
        state.sysMsgUnread = Object.assign(state.sysMsgUnread, obj)
    },
    updateCustomSysMsgs(state, sysMsgs) {
        const nim = state.nim
        if (!Array.isArray(sysMsgs)) {
            sysMsgs = [sysMsgs]
        }
        sysMsgs = sysMsgs.map(msg => {
            msg.showTime = util.formatDate(msg.time, false)
            return msg
        })
        // state.customSysMsgs = nim.mergeSysMsgs(state.customSysMsgs, sysMsgs)
        state.customSysMsgs = state.customSysMsgs.concat(sysMsgs)
        Vue.set(state, 'customSysMsgs', state.customSysMsgs)
        store.commit('updateCustomSysMsgUnread', {
            type: 'add',
            unread: sysMsgs.length
        })
    },
    updateCustomSysMsgUnread(state, obj) {
        let {type, unread} = obj
        switch (type) {
            case 'reset':
                state.customSysMsgUnread = unread || 0
                break
            case 'add':
                state.customSysMsgUnread += unread
                break
        }
    },
    resetSysMsgs(state, obj) {
        let type = obj.type
        switch (type) {
            case 0:
                state.sysMsgs = []
                break
            case 1:
                state.customSysMsgs = []
                store.commit('updateCustomSysMsgUnread', {
                    type: 'reset'
                })
                break
        }
    },
    deleteSysMsgs(state, obj) {
        let type = obj.type
        let idServer = obj.idServer
        let arr = type === 0 ? state.sysMsgs : state.customSysMsgs
        arr = arr.filter(msg => {
            return msg.idServer !== idServer
        })
        Vue.set(state, 'sysMsgs', arr)
    },
    setNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = true
    },
    resetNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = false
    },
    // 继续与机器人会话交互
    continueRobotMsg(state, robotAccid) {
        state.continueRobotAccid = robotAccid
    },

    initChatroomInfos(state, obj) {
        state.chatroomInfos = obj
    },
    setCurrChatroom(state, {id, chatRoom}) {
        state.currChatroomId = id
        // state.currChatroom = state.chatroomInsts[chatroomId]
        // state.currChatroomMsgs = []
        // state.currChatroomInfo = {}
        state.currChatroomMembers = chatRoom
    },
    setTeamMembers(state, arr) {
        state.teamMembers = arr;
    },
    setTeamlist(state, arr) {
        state.teamlist = arr;
    },
    setChatroomInfos(state, obj) {
        state.currChatroomInfo = obj
    },
    resetCurrChatroom(state) {
        state.currChatroomId = null
        state.currChatroom = null
        state.currChatroomMsgs = []
        state.currChatroomInfo = {}
        state.currChatroomMembers = []
    },
    // 聊天室相关逻辑
    updateChatroomInfo(state, obj) {
        state.currChatroomInfo = obj;
        for (let i in state.teamlist) {
            if (state.teamlist[i].teamId == obj.teamId) {
                state.teamlist[i] = state.currChatroomInfo;
            }
        }
    },
    updateCurrChatroomMsgs(state, obj) {
        let {type, msgs} = Object.assign({}, obj)
        if (type === 'put') {
            msgs.forEach(msg => {
                let chatroomId = msg.chatroomId
                if (chatroomId === state.currChatroomId) {
                    msgs.forEach(msg => {
                        state.currChatroomMsgs.push(msg)
                    })
                }
            })
        } else if (type === 'concat') {
            // 一般用于历史消息拼接
            let currSessionMsgs = obj.msgs
            currSessionMsgs.reverse()
            currSessionMsgs.forEach(msg => {
                state.currSessionMsgs.unshift(msg)
            })
        }
    },
    getChatroomInfo(state, obj) {
        state.currChatroomInfo = obj
    },
    updateChatroomMembers(state, obj) {
        let {type, members} = obj
        if (type === 'destroy') {
            state.currChatroomMembers = []
        } else if (type === 'put') {
            members.forEach(member => {
                if (member.online) {
                    state.currChatroomMembers.push(member)
                }
            })
        }
    },
    updateTeamList(state, teams) {
        const nim = state.nim
        store.state.im.teamlist = nim.mergeTeams(store.state.im.teamlist, teams)
        store.state.im.teamlist = nim.cutTeams(store.state.im.teamlist, teams.invalid)
    },
    updateTeamMembers(state, obj) {
        state.teamMembers = state.teamMembers || []
        state.teamMembers.sort((a, b) => {
            // 将群主和管理员排在队列前方
            if (a.type === 'owner' || b.type === 'owner') {
                return a.type === 'owner' ? -1 : 1
            }
            if (a.type === 'manager' || b.type === 'manager') {
                return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0
            }
            return -1
        })
        state.teamMembers = state.teamMembers
    },
    removeTeamMembersByAccounts(state, obj) {
        var teamId = obj.teamId
        var invalidAccounts = obj.accounts
        if (state.teamMembers[teamId] === undefined) return
        state.teamMembers[teamId] = state.teamMembers[teamId].filter((member, index) => {
            return invalidAccounts.indexOf(member.account) === -1
        })
        state.teamMembers = Object.assign({}, state.teamMembers)
    },
    updateTeamInfo(state, team) {
        var index = state.teamlist.findIndex(item => {
            return item.teamId === team.teamId
        })
        if (index === -1) return
        for (const key in team) {
            if (key !== 'teamId' && team.hasOwnProperty(key) && team[key]) {
                state.teamlist[index][key] = team[key]
            }
        }
    },
    updateTeamSettingConfig(state, obj) {
        state.teamSettingConfig = obj
    },
    updateSentReceipedMap(state, obj) {
        if (!obj || obj.length < 1) {
            return
        }
        var teamId = obj[0].teamId
        if (!state.sentReceipedMap[teamId]) {
            state.sentReceipedMap[teamId] = []
        }
        state.sentReceipedMap[teamId].push(...obj.map(msg => msg.idServer))
    },
    updateReceiptQueryList(state, obj) {
        if (state.currReceiptQueryTeamId !== obj.teamId) {
            state.receiptQueryList = []
            state.teamMsgReads = []
            state.currReceiptQueryTeamId = obj.teamId
        }
        var needQuery = obj.msgs
            .filter(msg =>
                msg.needMsgReceipt && msg.from === state.myInfo.account && !state.receiptQueryList.find(item => item.idServer === msg.idServer)
            )
            .map(msg => {
                return {
                    teamId: obj.teamId,
                    idServer: msg.idServer
                }
            })
        if (needQuery.length > 0) {
            state.receiptQueryList.push(...needQuery)
        }
        if (needQuery.length > 0) {
            store.dispatch('getTeamMsgReads', needQuery)
        }
    },
    updateTeamMsgReads(state, obj) {
        state.teamMsgReads.push(...obj.teamMsgReceipts)
    },
    updateSingleTeamMsgReads(state, obj) {
        state.teamMsgReads.forEach(item => {
            if (item.idServer === obj.idServer) {
                item.unread = obj.unread
                item.read = obj.read
            }
        })
        // 更新已读未读账号列表
        var unreadAccounts = state.teamMsgReadsDetail.unreadAccounts
        var findIndex = unreadAccounts.findIndex(account => account === obj.account)
        if (findIndex >= 0) {
            unreadAccounts.splice(findIndex, 1)
            state.teamMsgReadsDetail.readAccounts.push(obj.account)
        }
    },
    initMsgReceiptDetail(state, obj) {
        state.teamMsgReadsDetail.readAccounts = obj.readAccounts
        state.teamMsgReadsDetail.unreadAccounts = obj.unreadAccounts
    },
    updateImageSrc(state, obj) {
    },
    updateSelectBox(state, obj) {
        let {isShow} = obj
        state.isShowSelectBox = isShow
    }
}