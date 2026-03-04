import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Component } from 'react';
import './index.scss';

const NAV_ITEMS = [
    { id: 'home', icon: '🏠', label: '首页', pagePath: '/pages/index/index' },
    { id: 'dashboard', icon: '🧗', label: '闯关', pagePath: '/pages/dashboard/index' },
    { id: 'notes', icon: '📜', label: '笔记', pagePath: '/pages/notes/index' },
    { id: 'profile', icon: '🛡️', label: '我的', pagePath: '/pages/profile/index' }
];

// 全局变量存储当前选中索引，跨页面共享状态
let globalSelectedIndex = 0;

// 使用 Class 组件以便支持 setData 方法
export default class CustomTabBar extends Component {
    state = {
        selected: globalSelectedIndex // 优先使用全局缓存的状态
    };

    componentDidMount() {
        // 监听来自页面的同步事件
        Taro.eventCenter.on('updateTabBar', (index: number) => {
            if (this.state.selected !== index) {
                this.setState({ selected: index });
                globalSelectedIndex = index;
            }
        });
        this.setSelectedBasedOnPath();
    }

    componentWillUnmount() {
        Taro.eventCenter.off('updateTabBar');
    }

    setSelectedBasedOnPath() {
        const instance = Taro.getCurrentInstance();
        const page = instance.page;
        const router = instance.router;

        // Use router path or page route
        const path = router?.path || (page as any)?.route || '';
        if (path) {
            const normalizedPath = path.startsWith('/') ? path : `/${path}`;
            const index = NAV_ITEMS.findIndex(item => item.pagePath === normalizedPath);

            if (index !== -1 && index !== this.state.selected) {
                this.setState({ selected: index });
            }
        } else {
            // Fallback to global state if path resolution fails initially
            this.setState({ selected: globalSelectedIndex });
        }
    }

    // 供旧页面调用的后备方法（现在推荐使用 Taro.eventCenter.trigger('updateTabBar', index)）
    setSelected(index: number) {
        globalSelectedIndex = index;
        this.setState({ selected: index });
    }

    switchTab = (url: string) => {
        Taro.switchTab({ url });
        // NOTE: We do not call this.setState or trigger updateTabBar here.
        // Instead, we rely on the destination page's useDidShow hook calling syncTabBar()
        // which triggers the 'updateTabBar' event. This guarantees that the CustomTabBar
        // instance belonging to the *new* page is the one that gets its state updated.
    };

    render() {
        const { selected } = this.state;

        return (
            <View className="custom-tab-bar">
                <View className="tab-bar-container">
                    {NAV_ITEMS.map((item, index) => {
                        const isSelected = selected === index;
                        return (
                            <View
                                key={item.id}
                                className={`tab-bar-item ${isSelected ? 'active' : ''}`}
                                onClick={() => this.switchTab(item.pagePath)}
                            >
                                {isSelected && <View className="active-bg" />}
                                <Text className="tab-icon">{item.icon}</Text>
                                <Text className="tab-text">{item.label}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }
}

