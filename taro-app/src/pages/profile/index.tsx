// src/pages/profile/index.tsx - 个人中心页面
// 原 React 代码：App.tsx (view='profile') → 已适配 Taro/小程序

import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Language, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
import './index.scss';

const Profile = () => {
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [progress, setProgress] = useState<Record<Language, LanguageProgress> | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);

    useEffect(() => {
        const lang = Taro.getStorageSync('currentLanguage');
        const savedState = Taro.getStorageSync('python-quest-tree-v4');

        if (savedState) {
            const state = JSON.parse(savedState);
            setCurrentLang(lang || Language.PYTHON);
            setProgress(state.progress);

            const scores = Object.values(state.progress as Record<Language, LanguageProgress>);
            setTotalScore(scores.reduce((acc, curr) => acc + curr.score, 0));
            setTotalCompleted(scores.reduce((a, c) => a + c.completedLevels.length, 0));
        }
    }, []);

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
            <ScrollView scrollY className="profile-scroll">
                <View className="profile-card">
                    <View className="profile-bg-glow"></View>

                    <View className="profile-header">
                        <View className="profile-avatar">
                            <Text>🛡️</Text>
                        </View>
                        <View className="profile-info">
                            <Text className="profile-rank">{getRank(currentScore, currentLang)}</Text>
                            <Text className="profile-status">
                                {currentLang ? `${currentLang} 修行中` : '等待宿命开启'}
                            </Text>
                        </View>
                    </View>

                    <View className="profile-stats">
                        <View className="stat-item">
                            <Text className="stat-label">Total XP</Text>
                            <Text className="stat-value">{totalScore}</Text>
                        </View>
                        <View className="stat-item">
                            <Text className="stat-label">Completed</Text>
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
            </ScrollView>
        </View>
    );
};

export default Profile;
