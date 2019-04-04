<template>
    <div class="buyerInfo">
        <h5>收货人：{{shipAddress.name}} {{shipAddress.mobile }}</h5>
        <p class="address"><img src="@/../../static/image/cirlePosi.png" alt=""> {{shipAddress.province||shipAddress.provinceName}}
            {{shipAddress.city||shipAddress.cityName}} {{shipAddress.region||shipAddress.regionName}} {{shipAddress.address}}</p>
    </div>
</template>
<script>
export default {
    props:['shipAddress']
}
</script>
<style lang="scss" scoped>
h5{
    font-size:16px;
    text-indent: 18px;
}
p{
    font-size: 14px;
    img{
        vertical-align: middle;
    }
}
</style>