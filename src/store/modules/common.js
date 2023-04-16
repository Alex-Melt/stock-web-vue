export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    // menuList: [],
	// dynamicMenuRoutes
	// [{"path":"common-404","component":null,"name":"common-404","meta":{"menuId":1,"title":"股票推荐","isDynamic":true,"isTab":true,"iframeUrl":""}},{"path":"common-login","component":null,"name":"common-login","meta":{"menuId":2,"title":"股票新闻","isDynamic":true,"isTab":true,"iframeUrl":""}},{"path":"common-home","component":null,"name":"common-home","meta":{"menuId":3,"title":"股票分析","isDynamic":true,"isTab":true,"iframeUrl":""}}]
    menuList: [{"icon":"job","list":null,"menuId":1,"parentId":0,"orderName":1,"open":null,"parentName":null,"name":"股票推荐","perms":"","type":1,"url":"common/404"},{"icon":"job","list":null,"menuId":2,"parentId":0,"orderName":2,"open":null,"parentName":null,"name":"股票新闻","perms":"","type":1,"url":"common/login"},{"icon":"job","list":null,"menuId":3,"parentId":0,"orderName":3,"open":null,"parentName":null,"name":"股票分析","perms":"","type":1,"url":"common/home"}],
    menuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateContentIsNeedRefresh (state, status) {
      state.contentIsNeedRefresh = status
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    }
  }
}
