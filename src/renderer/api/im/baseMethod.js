//临时会话及好友
export function friendAndDialog(that, util) {
    let friendslist = that.im.friendslist.map(
        item => that.im.userInfos[item.account]
    );
    // 合并当前的会话列表和通讯录好友列表
    let mylist = that.im.sessionlist.concat(friendslist);
    // 列表去重
    let hash = {};
    mylist = mylist.filter(item => {
        let id = item.id || item.account + '';
        id = id.indexOf('p2p') > -1 ? id : 'p2p-' + id
        if (hash[id]) {
            return false
        } else {
            hash[id] = true;
            return item
        }
    })
    let forwardList = mylist.map(item => {
        // if(item.scene='p2p'){
        //     if(that.$store.state.im.userInfos[item.id]){
        //         item=Object.assign(item,that.$store.state.im.userInfos[Number(item.id)?'p2p-'+item.id:item.id])
        //     }
        // }
        if (item.alias) {
            item.name = item.alias || item.nick;
        }
        if (item.account) {
            item.id = item.account;
        }
        item.avatar =
            item.avatar || (item.scene == 'team' ? 'https://cdn.xindongpeixun.com/oss/20181024/e3ec3b3166114bbcab92e064202ab0b5.png' :
            "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png");
        return item;
    });
    return forwardList.filter(item => {
        if (that.searchName) {
            if (item) {
                if ((item.name || item.nick || item.id).indexOf(that.searchName) > -1) {
                    return item;
                }
            }
        } else {
            return item;
        }
    });
}

export function getBase64(url, fn) {
    var img = new Image();
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        fn ? fn(dataURL) : null;
        canvas = null;
    };
}

export function backScene(id, i) {
    id=id+'';
    console.log(id,'===========')
    if (i) {
        if (Number(id)) {
            return id.length > 9 ? 'team' : 'p2p'
        } else {
            return id.indexOf('p2p') > -1 ? 'p2p' : 'team'
        }
    } else {
        if (id.indexOf('p2p') > -1) {
            return id.substring(4)
        } else if (id.indexOf('team') > -1) {
            return id.substring(5)
        } else {
            return id
        }
    }
}

export function getLocalBase64(file, fn) {
    let read = new FileReader()
    read.readAsDataURL(file)
    read.onload = function () {
        fn(read.result)
    }
}