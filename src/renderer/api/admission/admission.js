import request from "@/utils/request.js";
//获取验码
export function sendCode(data) {
    return request({
        url: "merchant/i/auto/seller/sms/verif/code",
        data: data,
        method: "post"
    })
}
//验证票据
export function getPaper(data) {
    return request({
        url: "merchant/i/auto/seller/back/paper",
        data: data,
        method: "post"
    })
}
//地区数据
export function getarea() {
    return request({
        url: "/vehicle/base/area/all/three",
        method: "get"
    })
}
//汽车列表
export function getcalList() {
    return request({
        url: "vehicle/seller/manage/scope/all/tree",
        method: "get"
    })
}
//修改基本信息提交
export function resetDetil(data) {
    return request({
        url: "/merchant/i/auto/seller/base/modify",
        method: "post",
         data: data
    })
}
//个人修改基本信息提交
export function resetInfoDetil(data) {
    return request({
        url: "/merchant/merchant/update",
        method: "post",
         data: data
    })
}

//审核提交
export function upinFo(data) {
    return request({
        url: "/merchant/i/auto/seller/apply",
        data: data,
        method: "post"
    })
}
//修改提交
export function revise(data) {
    return request({
        url: "/merchant/i/auto/seller/modify/commit",
        data: data,
        method: "post"
    })
}
//店铺详情
export function getdetails() {
    return request({
        url: "/merchant/i/auto/seller/details",
        method: "get"
    })
}
//个人会话信息查询 返回个人主要信息
export function session() {
    return request({
        url: "/merchant/merchant/session/info/pc",
        method: "get"
    })
}
//个人详情
export function getInfodetails() {
    return request({
        url: "/merchant/merchant/details",
        method: "get"
    })
}
//头像修改
export function resetLogo(data) {
    return request({
        url: "/merchant/i/auto/seller/update/logo",
        method: "post",
        data: data
    })
}
//手机修改
export function resetMod(data) {
    return request({
        url: "/merchant/i/auto/seller/update/mobile",
        method: "post",
        data: data
    })
}
//商铺信息
export function getMyShop() {
    return request({
        url: "/merchant/i/auto/seller/details",
        method: "get"
    })
}

import viewer from "viewerjs/dist/viewer.min.js";
import "viewerjs/dist/viewer.min.css";
//图片查看器
export function lookPhoto(i, arr) {
    let box = document.createElement("div");
    arr=arr||['http://image.xindongpeixun.com/brand1.png'];
    arr.forEach(item => {
        let img = document.createElement("img");
        img.src = item.image || item;
        box.appendChild(img);
    });
    let showimg = new viewer(box, {
        hidden() {
            this.viewer.destroy();
        }
    });
    box.style.display = "none";
    showimg.view(i);
    showimg.show();
    showimg.full();
}