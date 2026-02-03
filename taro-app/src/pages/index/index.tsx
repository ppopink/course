// src/pages/index/index.tsx - 首页（语言选择）
// 原 React 代码：App.tsx (view='home') → 已适配 Taro/小程序

import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Language, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
import DepartmentSelector from '../../components/DepartmentSelector';
import './index.scss';

// 原 React 代码：const initialProgress → 保持不变
const initialProgress: LanguageProgress = {
    completedLevels: [],
    unlockedLevelId: 1,
    score: 0
};

const Index = () => {
    // 原 React 代码：localStorage.getItem → 已适配 Taro/小程序（Taro.getStorageSync）
    const [gameState, setGameState] = useState(() => {
        try {
            const saved = Taro.getStorageSync('python-quest-tree-v4');
            return saved ? JSON.parse(saved) : {
                currentLanguage: null,
                progress: {
                    [Language.PYTHON]: { ...initialProgress },
                    [Language.C]: { ...initialProgress },
                    [Language.JAVA]: { ...initialProgress }
                }
            };
        } catch (e) {
            return {
                currentLanguage: null,
                progress: {
                    [Language.PYTHON]: { ...initialProgress },
                    [Language.C]: { ...initialProgress },
                    [Language.JAVA]: { ...initialProgress }
                }
            };
        }
    });

    // 原 React 代码：useEffect(() => { localStorage.setItem(...) }) → 已适配 Taro/小程序（Taro.setStorageSync）
    useEffect(() => {
        try {
            Taro.setStorageSync('python-quest-tree-v4', JSON.parse(JSON.stringify(gameState)));
        } catch (e) {
            console.error('存储失败:', e);
        }
    }, [gameState]);

    // 原 React 代码：setView('dashboard') → 已适配 Taro/小程序（Taro.navigateTo）
    const handleLanguageSelect = (lang: Language) => {
        setGameState(prev => {
            const newState = { ...prev, currentLanguage: lang };
            const langProg = newState.progress[lang];
            const currentLevelId = langProg.completedLevels.length > 0
                ? Math.min(langProg.unlockedLevelId, LEVELS[lang].length)
                : 1;

            // 原 React 代码：存储到 state 后跳转 → 已适配 Taro/小程序（先存储再跳转）
            Taro.setStorageSync('python-quest-tree-v4', JSON.stringify({ ...newState }));
            Taro.setStorageSync('currentLanguage', lang);
            Taro.setStorageSync('currentLevelId', currentLevelId);

            // 原 React 代码：setView('dashboard') → 已适配 Taro/小程序（navigateTo）
            Taro.navigateTo({ url: '/pages/dashboard/index' });

            return newState;
        });
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
