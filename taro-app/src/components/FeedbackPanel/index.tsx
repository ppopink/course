// src/components/FeedbackPanel/index.tsx - 反馈弹窗组件
// 原 React 代码：components/FeedbackPanel.tsx → 已适配 Taro

import { useMemo } from 'react';
import { View, Text } from '@tarojs/components'; // 原 React 代码：import React → 已适配 Taro/小程序
import { GradingResult, Level } from '../../types';
import './index.scss';

interface FeedbackPanelProps {
    result: GradingResult;
    level: Level;
    onNext: () => void;
    isLastLevel: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ result, level, onNext, isLastLevel }) => {
    const { success, feedback, explanation } = result;

    // 原 React 代码：粒子特效数据 → 保持不变（CSS 动画实现）
    const particles = useMemo(() => {
        return Array.from({ length: success ? 100 : 50 }).map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 1400,
            y: (Math.random() - 0.5) * 1400,
            rotate: Math.random() * 1080,
            scale: Math.random() * 2 + 0.5,
            color: success
                ? ['#58cc02', '#1cb0f6', '#ffcf33', '#ff4b4b', '#ce82ff'][i % 5]
                : ['#64748b', '#334155', '#1e293b', '#475569'][i % 4],
            delay: Math.random() * 0.3
        }));
    }, [success]);

    return (
        // 原 React 代码：<div className="fixed..."> → 已适配 Taro/小程序（<View className="feedback-overlay">）
        <View className={`feedback-overlay ${!success ? 'shake' : ''}`}>
            {/* 原 React 代码：背景遮罩 → 保持不变 */}
            <View className="feedback-mask"></View>

            {/* 原 React 代码：反馈卡片 → 保持布局不变 */}
            <View className={`feedback-card ${success ? 'success' : 'error'}`}>
                <View className="feedback-content">
                    <Text className="feedback-icon">
                        {success ? '🔮' : '🧪'}
                    </Text>

                    {/* 原 React 代码：<h4> → 已适配 Taro/小程序（<Text>） */}
                    <Text className={`feedback-title ${success ? 'success-title' : 'error-title'}`}>
                        {success ? '完美契约！' : '实验炸膛！'}
                    </Text>

                    {/* 原 React 代码：<div className="..."> → 已适配 Taro/小程序（<View>） */}
                    <View className={`feedback-message ${success ? 'success-msg' : 'error-msg'}`}>
                        <Text>{feedback}</Text>
                    </View>

                    {explanation && (
                        <View className="feedback-explanation">
                            <View className={`explanation-badge ${success ? 'success-badge' : 'error-badge'}`}>
                                <Text>{success ? '真理解析' : '导师谏言'}</Text>
                            </View>
                            {/* 原 React 代码：<p> → 已适配 Taro/小程序（<Text>） */}
                            <Text className="explanation-text">{explanation}</Text>
                        </View>
                    )}

                    {/* 原 React 代码：<button> → 已适配 Taro/小程序（<View>） */}
                    <View
                        onClick={onNext}
                        className={`feedback-btn ${success ? 'success-btn' : 'error-btn'}`}
                    >
                        <Text>{success ? (isLastLevel ? "荣耀而归" : "继续冒险") : "重新校准"}</Text>
                    </View>
                </View>
            </View>

            {/* 原 React 代码：粒子特效层 → 简化为CSS动画（小程序性能考虑） */}
            <View className="feedback-particles">
                {success && particles.slice(0, 20).map(p => (
                    <View
                        key={p.id}
                        className="particle"
                        style={{
                            width: `${12 * p.scale}px`,
                            height: `${12 * p.scale}px`,
                            backgroundColor: p.color,
                            borderRadius: p.id % 3 === 0 ? '50%' : '3px',
                            animationDelay: `${p.delay}s`,
                            left: `${50 + p.x / 28}%`,
                            top: `${50 + p.y / 28}%`
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

export default FeedbackPanel;
