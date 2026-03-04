// src/pages/notes/index.tsx - 笔记页面
// 原 React 代码：App.tsx (view='notes') → 已适配 Taro/小程序

import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Language } from '../../types';
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

const Notes = () => {
    // 同步 tab bar 选中状态 - 笔记页索引为 2
    useDidShow(() => {
        syncTabBar(2);
    });
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);

    useEffect(() => {
        const lang = Taro.getStorageSync('currentLanguage');
        const savedState = Taro.getStorageSync('python-quest-tree-v4');

        if (lang && savedState) {
            const state = JSON.parse(savedState);
            setCurrentLang(lang);
            setCompletedLevels(state.progress[lang].completedLevels || []);
        }
    }, []);

    if (!currentLang) {
        return (
            <View className="notes-empty">
                <Text className="empty-icon">📓</Text>
                <Text className="empty-text">你还没有解锁任何真理，快去闯关吧！</Text>
            </View>
        );
    }

    const levels = LEVELS[currentLang] || [];
    const learnedLevels = levels.filter(l => completedLevels.includes(l.id));

    return (
        <View className="notes-container">
            <View className="notes-header">
                <Text className="notes-title">圣殿笔记 📜</Text>
            </View>

            <ScrollView scrollY className="notes-list">
                {learnedLevels.length === 0 ? (
                    <View className="notes-empty">
                        <Text className="empty-icon">📓</Text>
                        <Text className="empty-text">你还没有解锁任何真理，快去闯关吧！</Text>
                    </View>
                ) : (
                    learnedLevels.map(level => (
                        <View key={level.id} className="note-card">
                            <View className="note-stripe"></View>
                            <View className="note-header">
                                <Text className="note-star">✨</Text>
                                <Text className="note-title">{level.title} (归类: {level.topic})</Text>
                            </View>
                            <Text className="note-desc">{level.description}</Text>
                            <View className="note-code">
                                <Text className="code-text">
                                    {level.template?.replace(/\{\{\d+\}\}/g, level.placeholders?.[0] || '...')}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default Notes;
