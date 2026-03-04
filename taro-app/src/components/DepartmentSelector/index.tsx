// src/components/DepartmentSelector/index.tsx - 语言选择组件
// 原 React 代码：components/DepartmentSelector.tsx → 已适配 Taro

import { View, Text } from '@tarojs/components'; // 原 React 代码：import React → 已适配 Taro/小程序
import { Language } from '../../types';
import './index.scss';

interface ProgressInfo {
    completed: number;
    total: number;
}

interface DepartmentSelectorProps {
    onSelect: (lang: Language) => void;
    progress: Record<Language, ProgressInfo>;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ onSelect, progress }) => {
    const departments = [
        {
            lang: Language.PYTHON,
            title: "Python 大召唤师",
            desc: "简洁即是正义。通过强大的库和简洁的语法，你将学会如何用最少的代码实现最强大的功能。",
            icon: "🔮",
            colorClass: "dept-python"
        },
        {
            lang: Language.C,
            title: "C 语言炼金术师",
            desc: "欢迎来到真理之门。这里没有捷径,你必须亲手操控内存，在底层逻辑中炼化出极致的性能。",
            icon: "⚙️",
            colorClass: "dept-c"
        },
        {
            lang: Language.JAVA,
            title: "Java 帝国建筑师",
            desc: "规范、严谨、永恒。在城堡蓝图的指引下，构建属于你的庞大系统，掌握面向对象的终极奥义。",
            icon: "🏰",
            colorClass: "dept-java"
        }
    ];

    return (
        // 原 React 代码：<div> → 已适配 Taro/小程序（<View>）
        <View className="dept-container">
            {/* 原 React 代码：首页英雄卡片 → 保持布局不变 */}
            <View className="hero-card">
                <View className="hero-bg">
                    <View className="hero-glow hero-glow-1"></View>
                    <View className="hero-glow hero-glow-2"></View>

                    <View className="hero-content">
                        {/* 原 React 代码：<h2><br/></h2> → 已适配 Taro/小程序（<Text>\n</Text>） */}
                        <Text className="hero-title">攀登{'\n'}编程巅峰</Text>
                        <Text className="hero-desc">选择你的宿命,{'\n'}开启代码冒险！</Text>
                    </View>

                    <Text className="hero-rocket">🚀</Text>
                    <Text className="hero-star-1">✦</Text>
                    <Text className="hero-star-2">★</Text>
                </View>
            </View>

            <View className="dept-list">
                {departments.map((dept) => {
                    const prog = progress[dept.lang];
                    const percentage = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
                    const hasStarted = prog.completed > 0;

                    return (
                        // 原 React 代码：<div onClick> → 已适配 Taro/小程序（<View onClick>）
                        <View
                            key={dept.lang}
                            className={`dept-card ${dept.colorClass}`}
                        >
                            <View className="dept-header">
                                <View className={`dept-icon ${dept.colorClass}-bg`}>
                                    <Text>{dept.icon}</Text>
                                </View>
                                <View className="dept-title-group">
                                    {/* 原 React 代码：<h3> → 已适配 Taro/小程序（<Text>） */}
                                    <Text className="dept-title">{dept.title}</Text>
                                    <Text className="dept-stars">★★★★★</Text>
                                </View>
                            </View>

                            {/* 原 React 代码：<p> → 已适配 Taro/小程序（<Text>） */}
                            <Text className="dept-desc">{dept.desc}</Text>

                            <View className="dept-progress">
                                <View className="progress-header">
                                    <View className={`progress-badge ${dept.colorClass}-badge`}>
                                        <Text>修行进度: {prog.completed} / {prog.total}</Text>
                                    </View>
                                    <Text className="progress-percent">{percentage}%</Text>
                                </View>
                                <View className="progress-bar-wrapper">
                                    <View
                                        className={`progress-bar ${dept.colorClass}-bar`}
                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                    ></View>
                                </View>
                            </View>

                            <View className="dept-footer">
                                {/* 原 React 代码：<button> → 已适配 Taro/小程序（<View>） */}
                                <View
                                    className={`dept-btn ${dept.colorClass}-btn`}
                                    onClick={() => onSelect(dept.lang)}
                                >
                                    <Text>{hasStarted ? '继续冒险' : '开始冒险'}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default DepartmentSelector;
