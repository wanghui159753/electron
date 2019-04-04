import {parseTime} from "./index";

export default function (item, state, flow) {
    let myid = state.user.storeInformation.userId;
    if (item.msgType == 1) {
        return ` <div class='top'>
                        <img src="${item.msgContent.avatar || require('../../../static/image/DefaultUserIcon.png')}" width='60' alt="">
                        <div>
                          <h6>${item.msgContent.name || '未知用户'}</h6>
                          <p>${item.msgContent.account || '未知ID'}</p>
                        </div>
                      </div>
                      <p>心动-个人名片</p>
                  `;
    } else if (item.msgType == 2) {
        let str = item.msgContent.authList.join();
        let indeed = /实地认证/.test(str);
        let business = /身份/.test(str);
        let money = /营业执照/.test(str);
        let img = "";
        if (indeed) {
            img += `<img src="${require('../../../static/image/cash2.png')}">`;
        }
        if (business) {
            img += `<img src="${require('../../../static/image/id.png')}">`;
        }
        if (money) {
            img += `<img src="${require('../../../static/image/cash.png')}">`;
        }
        return ` <div class='top'>
                            <img src="${item.msgContent.avatar}" width='60' alt="">
                            <div class='busi'>
                              <h6>${item.msgContent.name}</h6>
                              <p class='pic'>
                                ${img}
                              </p>
                              <p>${item.msgContent.businessScope}</p>
                            </div>
                          </div>
                          <p class='adress'> <img src='${require('../../../static/image/grayPosi.png')}'> ${item.msgContent.address}</p>
                          <p>心动-汽配商名片</p>
                      `;
    } else if (item.msgType == 3) {
        return ` <div class='top'>
                        <img src="${item.msgContent.avatar}" width='60' alt="">
                        <div class='busi'>
                          <h6>${item.msgContent.manufacturers}(${
            item.msgContent.brand
            })</h6>
                  <p class='pic'>
                    vin:${item.msgContent.vin}
                  </p>
                  <p>${item.msgContent.series + " " + item.msgContent.salesName}</p>
                </div>
              </div>
              <p>心动-车架号分享</p>
                  `;
    } else if (item.msgType == 4) {
        let str, src;
        if (item.msgContent.sellerId == myid) {
            str = item.msgContent.isModify ? '订单已修改' : '订单已发送';
            src = require('../../../static/image/orderf.png')
        } else if (item.msgContent.buyerId == myid) {
            str = item.msgContent.isModify ? '报价已修改，去付款' : '已为你报价，去付款';
            src = require('../../../static/image/order.png')
        }
        return `
                <span>${str}</span>
                <div class='top'>
                <img src="${src}" width='50' alt="">
                <div class='busi'>
                <h6 title='${item.msgContent.brandName}'>${item.msgContent.brandName}</h6>
                <span class='pic' title='${item.msgContent.partName}'>
                ${item.msgContent.partName}
                </span>
                </div>
                </div>
                <p><a>点击查看订单</ a><span class='el-icon-arrow-right'></span></p >
                `;
    } else if (item.msgType == 5) {
        return `
            <div class="content">
                <div class="left">
                    <img src="${item.msgContent.brandLogo}" width="50" alt="">
                </div>
                <div class="right">
                    <h6>采购 ${item.msgContent.brandName}</h6>
                    <div class="parts">${item.msgContent.partName}</div>
                </div>
            </div>
            <footer>
               <button class="look">查看报价</button> 
            </footer>
        `
    } else if (item.msgType == 6) {
        let str = '';
        let src = '';
        if (item.msgContent.sellerId == myid && flow == 'in') {
            str = '对方请求报价'
            src = require('../../../static/image/orderf.png')
        } else if (item.msgContent.buyerId == myid && flow == 'out') {
            str = '清单已发送,等待对方报价';
            src = require('../../../static/image/order.png')
        } else if (item.msgContent.sellerId == myid && flow == 'out') {
            str = '已报价,等待对方付款'
            src = require('../../../static/image/orderf.png')
        } else if (item.msgContent.buyerId == myid && flow == 'in') {
            str = '对方已报价'
            src = require('../../../static/image/order.png')
        } else {
            str = '当前清单不可查看'
            src = require('../../../static/image/order.png')
        }
        return `
            <h6>${str}</h6>
            <div class="content">
                <div class="left">
                    <img src="${src}" alt="">
                </div>
                <div class="right">
                    <p class="top">${item.msgContent.brandName}</p>
                    <p class="foot">${item.msgContent.partName}</p>
                </div>
            </div>
            <footer><p>点击查看报价</p> <span class="el-icon-arrow-right"></span></footer>
        `
    } else if (item.msgType == 7) {
        return `
           <h6>单号：${item.msgContent.orderNum}</h6>
           <div class="content">
                <div class="left">
                    <img src="${require('../../../static/image/pay.png')}" width="50" alt="">
                </div>
               <div class="right">
                    <div>采购“${item.msgContent.brandName}”</div>
                    <p>${item.msgContent.partName}</p>
                </div>
            </div>
            <footer>
                <div class="price">总价：<span>￥${(item.msgContent.orderPrice/100).toFixed(2)}</span></div>
                <button class="look">查看订单</button>
            </footer>
       `
    } else if (item.msgType == 8) {
        let str, str2;
        if (item.msgContent.sellerId == myid) {
            str = item.msgContent.orderFrom=='pay'||item.msgContent.orderFrom=='order'?'已收到' + item.msgContent.buyerName+'转账':`已退款给${item.msgContent.buyerName}`;
            str2 = item.msgContent.orderFrom=='pay'||item.msgContent.orderFrom=='order'?'已收到':'已退款';
        } else if (item.msgContent.buyerId == myid) {
            str = item.msgContent.orderFrom=='pay'||item.msgContent.orderFrom=='order'?'付款给' + item.msgContent.sellerName:`已退款`;
            str2 = item.msgContent.orderFrom=='pay'||item.msgContent.orderFrom=='order'?'已付款':'已退款';
        } else {
            str = '已收到' + item.msgContent.buyerName;
            str2 = '已付款';
        }
        return item.msgContent.orderFrom == 'pay'||item.msgContent.orderFrom == 'refund' ? `
           <div class="content">
                <div class="left"><img src="${require('../../../static/image/pay_ok.png')}" width="50" alt=""></div>
                <div class="right">
                    <div>${str}</div>
                    <p>${item.msgContent.orderFrom == 'refund'?'退款':'交易'}金额：¥${(item.msgContent.orderPrice/100).toFixed(2)}</p>
                    <p>${parseTime(item.msgContent.orderTime)}</p>
                </div>
            </div>
            <footer>
                ${str2}
            </footer>
        ` : `
        <h6>单号：${item.msgContent.orderNum}</h6>
           <div class="content">
                <div class="left">
                    <img src="${require('../../../static/image/pay.png')}" width="50" alt="">
                </div>
               <div class="right">
                    <div>${str}</div>
                    <p>${parseTime(item.msgContent.orderTime)}</p>
                </div>
            </div>
            <footer>
                <div class="price">总价：<span>￥${(item.msgContent.orderPrice/100).toFixed(2)}</span></div>
                <button class="look">查看订单</button>
            </footer>
        `
    }
}