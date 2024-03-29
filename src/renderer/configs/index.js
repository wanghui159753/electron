let config = {
    sdk: 'NIM_Web_SDK_v5.4.0',
    // 用户自定义的登录注册地址
    // loginUrl: '/webdemo/h5/login.html',
    // registUrl: '/webdemo/h5/regist.html',
    // homeUrl: '/webdemo/h5/index.html#/session',

    // 资源路径根目录，为了方便用户部署在二级以上URL路径上
    // resourceUrl: 'http://yx-web.nos.netease.com/webdoc/h5',
    // 用户logo地址
    logo: 'http://yx-web.nos.netease.com/webdoc/h5/im/logo.png',
    // 默认用户头像 http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png
    defaultUserIcon: '',
    // 默认普通群头像
    // defaultGroupIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-group.png',
    // 默认高级群头像
    // defaultAdvancedIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-advanced.png',
    // 系统通知图标
    // noticeIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/notice-icon.png',
    // 我的图标
    // myPhoneIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/my-phone.png',
    // 本地消息显示数量，会影响性能
    localMsglimit: 20,
    uploadUrl:"http://www.mc51.xin/"
}




const env = 'test'
let appConfig = {
    // 用户的appkey
    // 用于在web demo中注册账号异步请求demo 服务器中使用
    //f7825c699c775e34b4923b454c290218  测试环境专用
    //72e8a525fce38e0ccc0b72e12139577c   线上环境
    test: {
        // appKey: '45c6af3c98409b18a84451215d0bdd6e',
        appKey: '72e8a525fce38e0ccc0b72e12139577c',
        postUrl: 'https://apptest.netease.im'
    },
    online: {
        appKey: '72e8a525fce38e0ccc0b72e12139577c',
        postUrl: 'https://app.netease.im'
    }
}

config = Object.assign(config, appConfig[env])
export default config;
export function f() {

}