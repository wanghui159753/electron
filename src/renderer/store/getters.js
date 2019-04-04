import util from "@/utils/index";
import store from '@/store';
const getters = {
    // sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    sessions: state => {
    // 当前的会话列表:
    let sessionlist = state.im.sessionlist.map((item, index) => {
        if (item.scene === "p2p" || item.id.indexOf("p2p") > -1) {
            let userInfo = null;
            if (item.id.substring(4)) {
                userInfo = state.im.userInfos[Number(item.id) ? item.id : item.id.substring(4)];
            }
            if (userInfo) {
                item.name = userInfo.nick || userInfo.name;
                item.alias = userInfo.alias;
                item.avatar =
                    userInfo.avatar ||
                    "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png";
            }
        } else {
            //群聊处理
            let val = state.im.teamlist.filter(some => some.teamId == item.to)[0];
            if (val) {
                item.avatar =
                    val.avatar ||
                    "https://cdn.xindongpeixun.com/oss/20181024/e3ec3b3166114bbcab92e064202ab0b5.png";
                item.name = val.name;
                item.valid = val.valid;
                if (!val.validToCurrentUser) {
                    store.dispatch(
                        "deleteSession",
                        Number(val.teamId) ? val.id : val.teamId.substring(5)
                    );
                    return false;
                }
            } else {
                if (item.to.length == 8 || item.to == 'undefined') {
                    store.dispatch("deleteSession", item.id);
                    return false;
                }
                store.dispatch("searchTeam", {
                    teamId: item.to,
                    done(teams) {
                        if (teams.length) {
                            item.avatar = teams[0].avatar;
                            item.name = teams[0].name;
                            item.valid = teams[0].valid;
                        }
                    }
                });
            }
        }
        let lastMsg = item.lastMsg || {};
        if (lastMsg.type === "text") {
            item.lastMsgShow = lastMsg.text || "";
        } else if (lastMsg.type === "custom") {
            item.lastMsgShow = util.parseCustomMsg(lastMsg);
        } else if (lastMsg.scene === "team" && lastMsg.type === "notification") {
            item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
        } else if (util.mapMsgType(lastMsg)) {
            item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
        } else {
            item.lastMsgShow = "";
        }
        if (item.lastMsg) {
            item.lastMsg.time ? (item.updateTimeShow = util.formatDate(item.lastMsg.time, true)) : null;
        }
        return item;
    });
    //  触发声音
    sessionlist = sessionlist.filter(item => {
        if (item.scene == "team") {
            return item.valid;
        } else {
            return item;
        }
    });
    return sessionlist;
},
    msgs: state => state.im.msgs,
    im: state => state.im
}
export default getters
