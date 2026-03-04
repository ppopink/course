// src/pages/profile/index.tsx - 个人中心页面
// 原 React 代码：App.tsx (view='profile') → 已适配 Taro/小程序

import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Language, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
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

// 初始进度模板
const initialProgress: LanguageProgress = {
    completedLevels: [],
    unlockedLevelId: 1,
    score: 0,
    currentStreak: 0,
    lastLoginDate: '',
    xp: 0
};

const Profile = () => {
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [progress, setProgress] = useState<Record<Language, LanguageProgress> | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);

    useDidShow(() => {
        syncTabBar(3);

        const lang = Taro.getStorageSync('currentLanguage');
        const savedState = Taro.getStorageSync('python-quest-tree-v4');

        let state;
        if (savedState) {
            try {
                state = JSON.parse(savedState);
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }

        // 如果没有存储状态或解析失败，使用默认空状态
        if (!state || !state.progress) {
            state = {
                currentLanguage: lang || Language.PYTHON,
                progress: {
                    [Language.PYTHON]: { ...initialProgress },
                    [Language.C]: { ...initialProgress },
                    [Language.JAVA]: { ...initialProgress }
                }
            };
        }

        setCurrentLang(state.currentLanguage || Language.PYTHON);
        setProgress(state.progress);

        const scores = Object.values(state.progress as Record<Language, LanguageProgress>);
        setTotalScore(scores.reduce((acc, curr) => acc + curr.score, 0));
        setTotalCompleted(scores.reduce((a, c) => a + c.completedLevels.length, 0));
    });

    const getRank = (score: number, lang: Language | null) => {
        if (score < 30) return "初入江湖";
        if (score < 100) {
            if (lang === Language.PYTHON) return "魔法见习生";
            if (lang === Language.C) return "炼金学徒";
            if (lang === Language.JAVA) return "见习工头";
            return "进阶玩家";
        }
        if (score < 250) {
            if (lang === Language.PYTHON) return "元素使者";
            if (lang === Language.C) return "真理探寻者";
            if (lang === Language.JAVA) return "高级建造师";
            return "精英导师";
        }
        if (lang === Language.PYTHON) return "大召唤师";
        if (lang === Language.C) return "真理炼金师";
        if (lang === Language.JAVA) return "帝国建筑师";
        return "宗师级";
    };

    if (!progress) {
        return (
            <View className="profile-loading">
                <Text>加载中...</Text>
            </View>
        );
    }

    const currentScore = currentLang ? progress[currentLang].score : totalScore;

    return (
        <View className="profile-container">
            {/* 顶部导航栏 - 复用 Home 页样式逻辑 */}
            <View className="page-header">
                <View className="header-left">
                    <Text className="header-icon">🌱</Text>
                    <Text className="header-title">不学编程</Text>
                </View>
                <View className="header-score">
                    <Text className="score-star">⭐</Text>
                    <Text className="score-value">{totalCompleted}</Text>
                </View>
            </View>

            {/* 由于 flex: 1 直接作用于 ScrollView 在某些小程序环境下可能有兼容性问题
                增加一层 View 作为 flex item，ScrollView 撑满这个 View */}
            <View className="profile-content-wrapper">
                <ScrollView scrollY className="profile-scroll-view">
                    {/* 用户信息大卡片 */}
                    <View className="profile-card">
                        <View className="profile-bg-circle"></View>

                        <View className="user-info-row">
                            <View className="profile-avatar">
                                <Text className="avatar-icon">🛡️</Text>
                            </View>
                            <View className="profile-text-info">
                                <Text className="profile-rank">{getRank(currentScore, currentLang)}</Text>
                                <Text className="profile-status">
                                    {currentLang ? `${currentLang} 修行中` : '等待宿命开启'}
                                </Text>
                            </View>
                        </View>

                        <View className="profile-stats">
                            <View className="stat-item">
                                <Text className="stat-label">TOTAL XP</Text>
                                <Text className="stat-value">{totalScore}</Text>
                            </View>
                            <View className="stat-item">
                                <Text className="stat-label">COMPLETED</Text>
                                <Text className="stat-value">{totalCompleted}</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="section-title">修行进度</Text>

                    <View className="progress-list">
                        {Object.entries(progress).map(([lang, prog]) => {
                            const total = LEVELS[lang as Language]?.length || 0;
                            if (total === 0) return null;
                            const percent = Math.round((prog.completedLevels.length / total) * 100);
                            const icon = lang === Language.PYTHON ? '🔮' : lang === Language.C ? '⚙️' : '🏰';

                            return (
                                <View key={lang} className="progress-card">
                                    <Text className="progress-icon">{icon}</Text>
                                    <View className="progress-details">
                                        <View className="progress-top">
                                            <Text className="progress-lang">{lang}</Text>
                                            <Text className="progress-percent">{percent}%</Text>
                                        </View>
                                        <View className="progress-bar-wrapper">
                                            <View className="progress-bar-fill" style={{ width: `${percent}%` }}></View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* 底部占位符，防止内容被 TabBar 遮挡 */}
                    <View style={{ height: '320rpx' }}></View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Profile;
