import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Language, Level, LanguageProgress } from '../../types';
import { LEVELS } from '../../constants';
import './index.scss';

const syncTabBar = (index: number) => {
    Taro.eventCenter.trigger('updateTabBar', index);
    const page = Taro.getCurrentInstance().page as any;
    const tabBar = page?.getTabBar?.();
    if (tabBar) {
        if (typeof tabBar.setSelected === 'function') tabBar.setSelected(index);
        else if (typeof tabBar.setData === 'function') tabBar.setData({ selected: index });
    }
};

// 各语言的荧光绿浮动代码术语
const CODE_TERMS: Record<Language, string[]> = {
    [Language.PYTHON]: ['def', 'import', 'self', 'print', 'len', 'elif', 'lambda', 'yield', 'True', 'None', 'class', 'return', 'for', 'try', 'in'],
    [Language.C]: ['int', 'void', 'main', 'struct', 'printf', 'return', 'char', '#include', 'NULL', 'sizeof', 'malloc', '->', 'for', '&', '*'],
    [Language.JAVA]: ['public', 'class', 'static', 'void', 'new', 'String', 'extends', 'this', 'final', 'return', 'import', 'try', 'null', 'super', 'int'],
};

const Dashboard = () => {
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [gameState, setGameState] = useState<LanguageProgress | null>(null);
    const [allLevels, setAllLevels] = useState<Level[]>([]);

    useDidShow(() => {
        syncTabBar(1);
        const parseStorage = (raw: any) => {
            if (!raw) return null;
            if (typeof raw === 'object') return raw;
            try { return JSON.parse(raw); } catch { return null; }
        };
        const lang = Taro.getStorageSync('currentLanguage') as Language;
        const savedState = Taro.getStorageSync('python-quest-tree-v4');
        const state = parseStorage(savedState);
        if (lang && state && state.progress && state.progress[lang]) {
            const progress = state.progress[lang];
            if (progress.xp === undefined) {
                progress.xp = progress.score * 10;
                progress.currentStreak = 1;
                progress.lastLoginDate = new Date().toISOString().split('T')[0];
                state.progress[lang] = progress;
                Taro.setStorageSync('python-quest-tree-v4', JSON.stringify(state));
            }
            setCurrentLang(lang);
            setGameState(progress);
            setAllLevels(LEVELS[lang] || []);
        }
    });

    const handleLevelSelect = (level: Level) => {
        if (!gameState) return;
        if (level.id <= gameState.unlockedLevelId) {
            Taro.setStorageSync('currentLevelId', level.id);
            Taro.navigateTo({ url: '/pages/editor/index' });
        } else {
            Taro.showToast({ title: '前方区域未解锁，请先完成当前关卡', icon: 'none' });
        }
    };

    if (!currentLang || !gameState || allLevels.length === 0) {
        return (
            <View className="dashboard-loading">
                <Text className="loading-text">链接星海中...</Text>
            </View>
        );
    }

    // 蜿蜒曲折的 S 型偏移
    const getOffset = (index: number) => Math.sin(index * 1.0) * 120;

    const reversedLevels = [...allLevels].reverse();

    // ========== 能量路径 SVG ==========
    const renderPathSVG = () => {
        const hpn = 130;
        const totalH = allLevels.length * hpn + 100;
        let d = `M 187.5 ${totalH - 50} `;
        allLevels.forEach((_, i) => {
            const sy = totalH - (i * hpn + 50);
            const ey = totalH - ((i + 1) * hpn + 50);
            const sx = 187.5 + getOffset(i);
            const ex = 187.5 + getOffset(i + 1);
            d += ` C ${sx} ${sy - hpn / 2}, ${ex} ${ey + hpn / 2}, ${ex} ${ey}`;
        });

        const svg = `<svg width="375" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gOuter" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="rgba(139,92,246,0.6)"/>
                    <stop offset="100%" stop-color="rgba(59,130,246,0.15)"/>
                </linearGradient>
                <linearGradient id="gWall" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="rgba(99,102,241,0.4)"/>
                    <stop offset="100%" stop-color="rgba(139,92,246,0.1)"/>
                </linearGradient>
            </defs>
            <path d="${d}" fill="none" stroke="url(#gOuter)" stroke-width="110" stroke-linecap="round" opacity="0.35"/>
            <path d="${d}" fill="none" stroke="url(#gWall)" stroke-width="95" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="rgba(99,102,241,0.25)" stroke-width="90" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="rgba(12,14,28,0.92)" stroke-width="78" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="rgba(79,70,229,0.08)" stroke-width="80" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="rgba(10,12,22,0.97)" stroke-width="70" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="rgba(139,92,246,0.12)" stroke-width="2" stroke-dasharray="6 12" stroke-linecap="round"/>
        </svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    // ========== 荧光绿浮动代码术语 ==========
    const terms = CODE_TERMS[currentLang] || CODE_TERMS[Language.PYTHON];
    const floatingTerms = Array.from({ length: 16 }, (_, i) => ({
        word: terms[i % terms.length],
        left: 38 + Math.sin(i * 2.3) * 12,       // 38%~50%, 在管道内
        delay: (i * 0.9) % 8,
        duration: 12 + (i % 4) * 3,               // 12~21s
        size: 22 + (i % 3) * 4,                   // 22~30rpx
        opacity: 0.25 + (i % 3) * 0.1,            // 0.25~0.45
    }));

    const targetViewId = `level-${gameState.unlockedLevelId}`;
    const activeLevel = allLevels.find(l => l.id === gameState.unlockedLevelId) || allLevels[0];
    const chapterTitle = activeLevel?.chapterTitle || "第一章";

    return (
        <View className="dashboard-container">
            <ScrollView
                scrollY
                className="map-scroll-view"
                scrollIntoView={targetViewId}
                scrollWithAnimation
            >
                <View
                    className="path-canvas"
                    style={{
                        height: `${allLevels.length * 260 + 200}rpx`,
                        backgroundImage: `url("${renderPathSVG()}")`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* 荧光绿浮动代码术语 */}
                    {floatingTerms.map((t, i) => (
                        <Text
                            key={`ft-${i}`}
                            className="code-term"
                            style={{
                                left: `${t.left}%`,
                                animationDelay: `${t.delay}s`,
                                animationDuration: `${t.duration}s`,
                                fontSize: `${t.size}rpx`,
                                opacity: t.opacity,
                            }}
                        >
                            {t.word}
                        </Text>
                    ))}

                    {/* 关卡节点 */}
                    {reversedLevels.map((level) => {
                        const idx = level.id - 1;
                        const done = gameState.completedLevels.includes(level.id);
                        const active = level.id === gameState.unlockedLevelId;
                        const ox = getOffset(idx);
                        const labelSide = ox >= 0 ? 'label-left' : 'label-right';

                        return (
                            <View
                                key={level.id}
                                id={`level-${level.id}`}
                                className="node-row"
                                style={{ transform: `translateX(${ox}rpx)` }}
                            >
                                <View className="node-wrapper" onClick={() => handleLevelSelect(level)}>
                                    {active ? (
                                        <View className="node-active-wrap">
                                            <View className="ring ring-1"></View>
                                            <View className="ring ring-2"></View>
                                            <View className="node-active">
                                                <Text>{level.id}</Text>
                                                <View className="highlight-dot"></View>
                                            </View>
                                            <Text className="star-sparkle">✦</Text>
                                            <View className="start-btn">START</View>
                                        </View>
                                    ) : done ? (
                                        <View className="node-done">
                                            <Text>{level.id}</Text>
                                        </View>
                                    ) : (
                                        <View className="node-locked">
                                            <Text>🔒</Text>
                                        </View>
                                    )}

                                    {/* 玻璃拟态标签卡片 */}
                                    <View className={`glass-label ${labelSide}`}>
                                        <Text className="glass-label-topic">{level.topic}</Text>
                                        <Text className="glass-label-title">{level.title}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: '320rpx' }}></View>
            </ScrollView>

            {/* 章节标题 */}
            <View className="chapter-header">
                <View className="chapter-glow-line"></View>
                <Text className="chapter-name">{chapterTitle}</Text>
                <View className="chapter-glow-line"></View>
            </View>
        </View>
    );
};

export default Dashboard;
