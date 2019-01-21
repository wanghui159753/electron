const widget = {
    state: {
        // 正在加载中
        isLoading: true,
    },
    mutations: {
        updateLoading(state, status) {
            clearTimeout(state.loadingTimer)
            state.loadingTimer = setTimeout(() => {
                state.isLoading = status
            }, 20)
        },
    },
    actions: {
        // 显示加载中进度条
        showLoading({ state, commit }) {
            commit('updateLoading', true)
        }
    }
}
export default widget