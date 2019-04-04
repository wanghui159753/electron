export default function(idDetail) {
    let arr = [];
    idDetail.partList.forEach(item => {
        let arrx = [];
        item.quotePartItemList && item.quotePartItemList.forEach(x => {
            arrx.push({
                classify: x.parts.split(",")[0],
                price: x.price,
                priceS: x.price / 100,
                type: x.isHave.split(",")[0]
            });
        });
        arrx.length > 0 && arr.push({
            enquiryPartId: item.id,
            partItemList: arrx,
            remark: ""
        });
    });
    return {
        enquiryId: idDetail.id,
        partList: arr,
        remark: idDetail.notes
    };
}