/*
 * SDK连接相关
 */
// config.js相关配置
import config from '@/configs'
// 获取页面相关
import pageUtil from '@/utils/page'
import util from '@/utils/index.js'
import store from '@/store'
import {onFriends, onSyncFriendAction} from './friends'
import {onRobots} from './robots'
import {onBlacklist, onMarkInBlacklist} from './blacks'
import {onMyInfo, onUserInfo} from './userInfo'
import {onSessions, onUpdateSession, onMutelist} from './session'
import {onRoamingMsgs, onOfflineMsgs, onMsg} from './msgs'
import {onSysMsgs, onSysMsg, onSysMsgUnread, onCustomSysMsgs} from './sysMsgs'
import {
    onTeams,
    onSynCreateTeam,
    onCreateTeam,
    onUpdateTeam,
    onTeamMembers,
    onUpdateTeamMember,
    onAddTeamMembers,
    onRemoveTeamMembers,
    onUpdateTeamManagers,
    onDismissTeam,
    onUpdateTeamMembersMute,
    onTeamMsgReceipt
} from './team'
import {getLocal} from "@/utils/localstorage.js"

// var SDK = require('@/sdk/NIM_Web_SDK_v5.4.0.js')

// 重新初始化 NIM SDK
export function initNimSDK({state, commit, dispatch}, loginInfo) {
    if (state.nim) {
        state.nim.disconnect()
    }
    dispatch('showLoading')
    // 初始化SDK
    console.log(config.appKey,
        getLocal("imuid"),
        getLocal("imtoken"))
    window.nim = state.nim = SDK.NIM.getInstance({
        // debug: true && { api: 'info', style: 'font-size:12px;color:blue;background-color:rgba(0,0,0,0.1)' },
        appKey: config.appKey,
        account: getLocal("imuid"),
        token: getLocal("imtoken"),
        db: true,
        syncMsgReceipts:true,
        syncSessionUnread: true,
        syncRoamingMsgs: true,
        syncRobots: true,
        Boolean: true,
        autoMarkRead: true, // 默认为true
        onconnect: function onConnect(event) {
            console.log("im连接成功.")
            if (loginInfo) {
                // 连接上以后更新uid
                commit('updateUserUID', loginInfo)
            }
        },
        onerror: function onError(event) {
            // alert(JSON.stringify(event))
            // debugger
            // alert('网络连接状态异常')
            console.log(event, '错误')
        },
        onwillreconnect: function onWillReconnect() {
            console.log(event)
        },
        ondisconnect: function onDisconnect(error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    // pageUtil.turnPage('帐号或密码错误', 'login')
                    break
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    let map = {
                        PC: '电脑版',
                        Web: '网页版',
                        Android: '手机版',
                        iOS: '手机版',
                        WindowsPhone: '手机版'
                    }
                    let str = error.from
                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[str] || '其他端')}踢出下线，请确定帐号信息安全!`
                    // pageUtil.turnPage(errorMsg, 'login')
                    break
                default:
                    break
            }
        },
        // // 多端登录
        // onloginportschange: onLoginPortsChange,
        // 用户关系及好友关系
        onblacklist: onBlacklist,
        onsyncmarkinblacklist: onMarkInBlacklist,
        onmutelist: onMutelist,
        // onsyncmarkinmutelist: onMarkInMutelist,
        onfriends: onFriends,
        onsyncfriendaction: onSyncFriendAction,
        // 机器人
        onrobots: onRobots,
        // 用户名片 - actions/userInfo
        onmyinfo: onMyInfo,
        onupdatemyinfo: onMyInfo,
        onusers: onUserInfo,
        onupdateuser: onUserInfo,
        // // 群组
        onteams: onTeams,
        onsynccreateteam: onSynCreateTeam,
        syncTeams: true,
        onteammembers: onTeamMembers,
        onCreateTeam: onCreateTeam,
        onDismissTeam: onDismissTeam,
        onUpdateTeam: onUpdateTeam,
        onAddTeamMembers: onAddTeamMembers,
        onRemoveTeamMembers: onRemoveTeamMembers,
        onUpdateTeamManagers: onUpdateTeamManagers,
        onupdateteammember: onUpdateTeamMember,
        onUpdateTeamMembersMute: onUpdateTeamMembersMute,
        onTeamMsgReceipt: onTeamMsgReceipt,
        // // 会话
        onsessions: onSessions,
        onupdatesession: onUpdateSession,
        // // 消息
        onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        // // 系统通知
        onsysmsg: onSysMsg,
        onofflinesysmsgs: onSysMsgs,
        onupdatesysmsg: onSysMsg, // 通过、拒绝好友申请会收到此回调

        onsysmsgunread: onSysMsgUnread,
        onupdatesysmsgunread: onSysMsgUnread,
        onofflinecustomsysmsgs: onCustomSysMsgs,
        oncustomsysmsg: onCustomSysMsgs,
        // // 同步完成
        onsyncdone: function onSyncDone() {
            commit('setLoading', false)
            console.log('sync done ...')
            dispatch('hideLoading')
            // 说明在聊天列表页

            if (store.state.currSessionId) {
                dispatch('setCurrSession', store.state.currSessionId)
            }
            var request = indexedDB.open('nim-'+state.userUID);
            function getStoreByName(storeName,db){
                var transaction = db.transaction(storeName,'readwrite');
                return transaction.objectStore(storeName);
            }
            request.onsuccess = function(e) { // 成功
                let db = e.target.result ;
                var stor = getStoreByName('session',db);
                let dd = stor.getAll();
                dd.onsuccess =(e)=>{
                    console.log(e.target.result)
                    e.target.result.forEach(item=>{
                        if(!item.scene){
                            stor.delete(item.id)
                        }
                    })
                } ;
            };
            state.nim.getLocalSessions({
                done(error, user) {
                    if (user.sessions) {
                        onSessions(user.sessions)
                    }
                }
            })
            dispatch('getHistoryMsgs', {
                scene: 'p2p',
                to: state.userUID
            })
            state.nim.getUser({
                account: getLocal("imuid"),
                done: function getUserDone(error, user) {
                }
            });
        },
    })
}
