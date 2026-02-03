// src/pages/dashboard/index.tsx - 闯关树页面
// 原 React 代码：App.tsx (view='dashboard') → 已适配 Taro/小程序（简化版SVG动画）

import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Language, Level, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
import './index.scss';

const Dashboard = () => {
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [gameState, setGameState] = useState<LanguageProgress | null>(null);
    const [currentLevels, setCurrentLevels] = useState<Level[]>([]);

    useEffect(() => {
        // 原 React 代码：从 state 获取 → 已适配 Taro/小程序（从 Storage 获取）
        const lang = Taro.getStorageSync('currentLanguage');
        const savedState = Taro.getStorageSync('python-quest-tree-v4');

        if (lang && savedState) {
            const state = JSON.parse(savedState);
            setCurrentLang(lang);
            setGameState(state.progress[lang]);
            setCurrentLevels(LEVELS[lang] || []);
        }
    }, []);

    const handleLevelSelect = (id: number) => {
        // 原 React 代码：setView('editor') → 已适配 Taro/小程序（navigateTo）
        Taro.setStorageSync('currentLevelId', id);
        Taro.navigateTo({ url: '/pages/editor/index' });
    };

    const handleBack = () => {
        // 原 React 代码：setView('home') → 已适配 Taro/小程序（navigateBack）
        Taro.navigateBack();
    };

    if (!currentLang || !gameState) {
        return (
            <View className="dashboard-loading">
                <Text>加载中...</Text>
            </View>
        );
    }

    return (
        <View className="dashboard-container">
            <View className="dashboard-header">
                <View onClick={handleBack} className="back-btn">
                    <Text className="back-arrow">←</Text>
                    <Text className="back-text">返回首页</Text>
                </View>
                <Text className="dashboard-title">{currentLang} 路径</Text>
            </View>

            {/* 原 React 代码：LevelSelector (复杂SVG动画) → 已简化为列表视图 */}
            <ScrollView scrollY className="level-list">
                {currentLevels.map((level, index) => {
                    const isUnlocked = level.id <= gameState.unlockedLevelId;
                    const isCompleted = gameState.completedLevels.includes(level.id);
                    const isCurrent = isUnlocked && !isCompleted;
                    const showChapter = index === 0 || currentLevels[index - 1].chapterId !== level.chapterId;

                    return (
                        <View key={level.id}>
                            {showChapter && (
                                <View className="chapter-header">
                                    <Text className="chapter-title">{level.chapterTitle}</Text>
                                </View>
                            )}

                            <View
                                className={`level-item ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`}
                                onClick={() => isUnlocked && handleLevelSelect(level.id)}
                            >
                                <View className={`level-node ${level.isBoss ? 'boss' : ''}`}>
                                    <Text className="level-number">
                                        {isCompleted ? '⭐' : isUnlocked ? (level.isBoss ? '👑' : level.id) : '🔒'}
                                    </Text>
                                </View>

                                <View className="level-info">
                                    <Text className="level-topic">{level.topic}</Text>
                                    <Text className="level-title">{level.title}</Text>
                                </View>

                                {isCurrent && (
                                    <View className="level-badge">
                                        <Text>START</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default Dashboard;
