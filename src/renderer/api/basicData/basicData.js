import request from "@/utils/request.js";

//基础数据放置
export function parts() {
    return request({
        url: 'vehicle/part/enquiry/all/children',
        method: 'get'
    })
}

//vin查询
export function vin(data) {
    return request({
        url: "vehicle/vin/car/info/vin",
        mothod: "get",
        params: data
    })
}

//vin删除记录
export function delVin(data) {
    return request({
        url: "vehicle/vin/user/log/delete",
        method: 'post',
        data: data
    })
}

//vin历史记录查询
export function vinHistory(data) {
    return request({
        url: "vehicle/vin/user/log/page",
        mothod: "get",
        params: data
    })
}

//1、测试PC端根据车辆品牌查询对应的厂家、车系数据
export function Serie(data) {
    return request({
        url: "vehicle/base/car/brand/series/pc",
        mothod: "get",
        params: data
    })
}

//2、测试PC端根据车系查询对应的车型车款数据
export function carModel(data) {
    return request({
        url: "vehicle/base/car/series/year/type/pc",
        mothod: "get",
        params: data
    })
}

// 自动更新描述接口
export function autoUpdateVersion(data) {
    return request({
        url: "tool/version/control/find/version",
        method: "get",
        params: data
    })
}

//个人信息查询
export function myInfo() {
    return request({
        url: "merchant/merchant/details",
        method: 'get'
    })
}

//汽配经销商开放省市
export function merchantCity() {
    return request({
        url: "vehicle/base/area/open/city/merchant/tree",
        method: 'get'
    })
}

export function getOne(arr,level) {
    if(arr[0].level<=level){
        var arr1 = [];
        arr.forEach(item => {
            if (item.children) {
                arr1.push({
                    value: item.id + "," + item.name,
                    label: item.name,
                    children: getOne(item.children,level)
                })
            } else {
                arr1.push({
                    value: item.id + "," + item.name,
                    label: item.name
                })
            }
        })
        return arr1
    }
}


export function getSpecialCity(arr,level) {
    let pro = null;
    function a(arr,level){
        if(arr[0].level<=level) {
            var arr1 = [];
            if (pro) {
                arr1.push({
                    label: '全' + pro.name,
                    value: ','
                });
            } else
                arr1.push({
                    label: '全国',
                    value: ','
                });
            arr.forEach(item => {
                pro = item;
                if (item.children) {
                    arr1.push({
                        value: item.id + "," + item.name,
                        label: item.name,
                        children: a(item.children,level)
                    })
                } else {
                    arr1.push({
                        value: item.id + "," + item.name,
                        label: item.name
                    })
                }
            })
            return arr1
        }
    }
    return a(arr,level);
}