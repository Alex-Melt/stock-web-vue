export default {
  namespaced: true,
  state: {
    id: 0,
    name: '测试'
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
