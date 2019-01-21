const getters = {
  // sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  sessions: state => state.im.sessionlist,
  msgs:state=>state.im.msgs,
  im:state=>state.im
}
export default getters
