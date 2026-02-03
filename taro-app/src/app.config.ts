// src/app.config.ts - Taro 全局配置
// 原 React 代码：index.html + App.tsx 路由逻辑 → 已适配 Taro 小程序

export default defineAppConfig({
    pages: [
        'pages/index/index',      // 首页（语言选择）
        'pages/dashboard/index',  // 闯关树
        'pages/editor/index',     // 答题页面
        'pages/notes/index',      // 笔记页面
        'pages/profile/index'     // 个人中心
    ],
    tabBar: {
        custom: false,
        color: '#999999',
        selectedColor: '#58cc02',
        backgroundColor: '#3c3c3c',
        borderStyle: 'black',
        list: [
            {
                pagePath: 'pages/index/index',
                text: '首页',
                iconPath: 'assets/icons/home.png',
                selectedIconPath: 'assets/icons/home-active.png'
            },
            {
                pagePath: 'pages/dashboard/index',
                text: '闯关',
                iconPath: 'assets/icons/game.png',
                selectedIconPath: 'assets/icons/game-active.png'
            },
            {
                pagePath: 'pages/notes/index',
                text: '笔记',
                iconPath: 'assets/icons/notes.png',
                selectedIconPath: 'assets/icons/notes-active.png'
            },
            {
                pagePath: 'pages/profile/index',
                text: '我的',
                iconPath: 'assets/icons/profile.png',
                selectedIconPath: 'assets/icons/profile-active.png'
            }
        ]
    },
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#0f1016',
        navigationBarTitleText: '不学编程',
        navigationBarTextStyle: 'white',
        backgroundColor: '#0f1016'
    }
});
