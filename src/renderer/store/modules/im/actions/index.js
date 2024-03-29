// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import { getLocal } from '@/utils/localstorage'
import  cookie  from '@/utils/cookie'
import pageUtil from '@/utils/page'

/* 导出actions方法 */
import { showLoading, hideLoading, showFullscreenImg, hideFullscreenImg } from './widgetUi'
import { initNimSDK } from './initNimSDK'
import { initChatroomSDK, resetChatroomSDK } from './initChatroomSDK'
import { updateBlack } from './blacks'
import { updateFriend, addFriend, deleteFriend, applyFriend } from './friends'
import { resetSearchResult, searchUsers, searchTeam } from './search'
import { deleteSession, setCurrSession, resetCurrSession, upsession, insert } from './session'
import { sendMsg, sendFileMsg, sendMsgReceipt, sendRobotMsg, revocateMsg, getHistoryMsgs, resetNoMoreHistoryMsgs, continueRobotMsg, deleteMsg, getLocalMsgs, forwardMsg, previewFileMsg ,ait} from './msgs'
import { markSysMsgRead, resetSysMsgs, deleteSysMsgs, markCustomSysMsgRead } from './sysMsgs'
import { sendChatroomMsg, sendChatroomRobotMsg, sendChatroomFileMsg, getChatroomHistoryMsgs, dismissTeam,transferTeam, leaveTeam, removeTeamMembers, newChatRoom, teamAdd, upinfo, setNick, isMute } from './chatroomMsgs'
import { initChatroomInfos, getChatroomInfo, getChatroomMembers, clearChatroomMembers } from './chatroomInfos'
import { delegateTeamFunction, onTeamNotificationMsg, enterSettingPage, getTeamMembers, checkTeamMsgReceipt, getTeamMsgReads, getChatGroup } from './team'

function connectNim({ state, commit, dispatch }, obj) {
  let { force } = Object.assign({}, obj)
  // 操作为内容页刷新页面，此时无nim实例
  if (!state.nim || force) {
    let loginInfo = {
      uid: getLocal("imuid"),
      sdktoken: getLocal("imtoken"),
    }
    if (!loginInfo.uid) {
      // 无cookie，直接跳转登录页
      // pageUtil.turnPage('无历史登录记录，请重新登录', 'login')
      //location.href = "#/login/generallogin"
    } else {
      // 有cookie，重新登录
      dispatch('initNimSDK', loginInfo)
    }
  }
}

function connectChatroom({ state, commit, dispatch }, obj) {
  let { chatroomId } = Object.assign({}, obj)
  const nim = state.nim
  if (nim) {
    dispatch('showLoading')
    nim.getChatroomAddress({
      chatroomId,
      done: function getChatroomAddressDone(error, obj) {
        if (error) {
          console.log(error.message)
          location.href = '#/room'
          return
        }
        dispatch('initChatroomSDK', obj)
      }
    })
  }
}

export default {
  updateRefreshState({ commit }) {
    commit('updateRefreshState')
  },

  // UI 及页面状态变更
  showLoading,
  hideLoading,
  showFullscreenImg,
  hideFullscreenImg,
  continueRobotMsg,

  // 连接sdk请求，false表示强制重连
  connect(store, obj) {
    let { type } = Object.assign({}, obj)
    // type 可为 nim chatroom
    type = type || 'nim'
    switch (type) {
      case 'nim':
        connectNim(store, obj)
        break
      case 'chatroom':
        connectChatroom(store, obj)
        break
    }
  },

  // 用户触发的登出逻辑
  logout({ state, commit }) {
    cookie.delCookie('uid')
    cookie.delCookie('sdktoken')
    if (state.nim) {
      state.nim.disconnect()
    }
    // pageUtil.turnPage('', 'login')
  },

  // 初始化 重新连接SDK
  initNimSDK,
  // 清空所有搜索历史纪录
  resetSearchResult,
  // 搜索用户信息
  searchUsers,
  // 更新黑名单
  updateBlack,
  // 更新好友
  addFriend,
  applyFriend,
  deleteFriend,
  updateFriend,
  // 删除会话
  deleteSession,
  // 设置当前会话
  setCurrSession,
  // 重置当前会话
  resetCurrSession,
  // 发送消息
  sendMsg,
  //@人
  ait,
  sendFileMsg,
  //更新当前会话信息
  upsession,
  //插入一条消息
  insert,
  sendRobotMsg,
  // 发送消息已读回执
  sendMsgReceipt,
  // 消息撤回
  revocateMsg,
  getHistoryMsgs,
  // 删除消息
  deleteMsg,
  // 获取本地历史记录
  getLocalMsgs,
  // 重置历史消息状态
  resetNoMoreHistoryMsgs,
  // 标记系统消息已读
  markSysMsgRead,
  markCustomSysMsgRead,
  resetSysMsgs,
  deleteSysMsgs,
  //转发消息
  forwardMsg,
  //发送预览图片
  previewFileMsg,
  initChatroomSDK,
  initChatroomInfos,
  resetChatroomSDK,
  sendChatroomMsg,
  sendChatroomRobotMsg,
  sendChatroomFileMsg,
  getChatroomHistoryMsgs,
  getChatroomInfo,
  getChatroomMembers,
  clearChatroomMembers,
  //新建群组
  newChatRoom,
  //刷新当前群聊信息
  getChatGroup,
  //主动退群
  leaveTeam,
  transferTeam,
  //踢人出群
  removeTeamMembers,
  //拉人进群
  teamAdd,
  //修改群信息
  upinfo,
  //修改群昵称，是否静音
  setNick,
  //查询消息免打扰
  isMute,
  // 搜索群
  searchTeam,
  // 代理sdk中的群方法
  delegateTeamFunction,
  // 处理群消息回调
  onTeamNotificationMsg,
  // 进入群信息设置页
  enterSettingPage,
  // 获取群成员
  getTeamMembers,
  // 群消息回执检查
  checkTeamMsgReceipt,
  // 查询群消息回执已读列表
  getTeamMsgReads,
    //解散群组
    dismissTeam

}
