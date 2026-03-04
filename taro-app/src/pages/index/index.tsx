// src/pages/index/index.tsx - 首页（语言选择）
// 原 React 代码：App.tsx (view='home') → 已适配 Taro/小程序

import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Language, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
import DepartmentSelector from '../../components/DepartmentSelector';
import './index.scss';

// 同步 tab bar 选中状态
const syncTabBar = (index: number) => {
    // 1. 触发全局事件供 CustomTabBar 组件的小程序端监听更新 React 状态
    Taro.eventCenter.trigger('updateTabBar', index);

    // 2. 兼容部分原生混合环境兜底
    const page = Taro.getCurrentInstance().page as any;
    const tabBar = page?.getTabBar?.();
    if (tabBar) {
        if (typeof tabBar.setSelected === 'function') {
            tabBar.setSelected(index);
        } else if (typeof tabBar.setData === 'function') {
            tabBar.setData({ selected: index });
        }
    }
};

// 原 React 代码：const initialProgress → 保持不变
const initialProgress: LanguageProgress = {
    completedLevels: [],
    unlockedLevelId: 1,
    score: 0,
    currentStreak: 0,
    lastLoginDate: '',
    xp: 0
};

const Index = () => {
    // 安全解析 Storage（兼容 string 和 object 两种格式）
    const parseStorage = (raw: any) => {
        if (!raw) return null;
        if (typeof raw === 'object') return raw;
        try { return JSON.parse(raw); } catch { return null; }
    };

    const defaultState = {
        currentLanguage: null,
        progress: {
            [Language.PYTHON]: { ...initialProgress },
            [Language.C]: { ...initialProgress },
            [Language.JAVA]: { ...initialProgress }
        }
    };

    const [gameState, setGameState] = useState(() => {
        const saved = Taro.getStorageSync('python-quest-tree-v4');
        return parseStorage(saved) || defaultState;
    });

    useDidShow(() => {
        syncTabBar(0);
        const saved = Taro.getStorageSync('python-quest-tree-v4');
        const parsed = parseStorage(saved);
        if (parsed) {
            setGameState(parsed);
        }
    });

    // 注意：不再通过 useEffect 自动保存 gameState 到 Storage
    // 所有的存储操作都在 handleLanguageSelect 中显式执行，避免格式不一致和竞态条件

    // 原 React 代码：setView('dashboard') → 已适配 Taro/小程序（Taro.navigateTo）
    const handleLanguageSelect = (lang: Language) => {
        // 先基于当前状态计算新状态
        const newState = { ...gameState, currentLanguage: lang };
        const langProg = newState.progress[lang];
        const currentLevelId = langProg.completedLevels.length > 0
            ? Math.min(langProg.unlockedLevelId, LEVELS[lang].length)
            : 1;

        // 更新 React state
        setGameState(newState);

        // 存储到 Storage - 始终存储为 JSON 字符串
        Taro.setStorageSync('python-quest-tree-v4', JSON.stringify(newState));
        Taro.setStorageSync('currentLanguage', lang);
        Taro.setStorageSync('currentLevelId', currentLevelId);

        // dashboard 是 tabBar 页面，必须使用 switchTab 跳转！
        Taro.switchTab({ url: '/pages/dashboard/index' });
    };

    const totalScore = (Object.values(gameState.progress) as LanguageProgress[]).reduce((acc, curr) => acc + curr.score, 0);

    const progressData = {
        [Language.PYTHON]: {
            completed: gameState.progress[Language.PYTHON].completedLevels.length,
            total: LEVELS[Language.PYTHON].length
        },
        [Language.C]: {
            completed: gameState.progress[Language.C].completedLevels.length,
            total: LEVELS[Language.C].length
        },
        [Language.JAVA]: {
            completed: gameState.progress[Language.JAVA].completedLevels.length,
            total: LEVELS[Language.JAVA].length
        }
    };

    return (
        // 原 React 代码：<div className="min-h-screen..."> → 已适配 Taro/小程序（<View>）
        <View className="index-container">
            {/* 原 React 代码：TopBar → 保持不变 */}
            <View className="index-header">
                <View className="header-left">
                    <Text className="header-icon">🌱</Text>
                    <Text className="header-title">不学编程</Text>
                </View>
                <View className="header-score">
                    <Text className="score-star">⭐</Text>
                    <Text className="score-value">{totalScore}</Text>
                </View>
            </View>

            <DepartmentSelector onSelect={handleLanguageSelect} progress={progressData} />
        </View>
    );
};

export default Index;
