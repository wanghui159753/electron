<template>
    <ul>
        <li v-for="item in showArray" :key="item.id">
            <img src="item" alt="">
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                teamMember: [],
                showArray:[]
            }
        },
        computed: {
            teamMembers() {
                return Object.values(this.$store.state.im.currChatroomMembers);
            }
        },
        created() {
            this.teamMember = this.teamMembers.map(item => {
                return Object.assign(this.$store.state.im.userInfos[item.account], item)
            });
            this.showArray=this.teamMember;
        }
    }
</script>
<style scoped lang="scss">

</style>
<style lang="scss">

</style>