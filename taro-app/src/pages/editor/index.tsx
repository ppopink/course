// src/pages/editor/index.tsx - 答题页面
// 原 React 代码：App.tsx (view='editor') → 已适配 Taro/小程序

import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Language, Level, GradingResult } from '../../types';
import { LEVELS } from '../../constants';
import { gradeCode, getHint } from '../../utils/geminiService';
import OptionSelector from '../../components/OptionSelector';
import FillInTheBlank from '../../components/FillInTheBlank';
import FeedbackPanel from '../../components/FeedbackPanel';
import CodeOrdering from '../../components/CodeOrdering';
import './index.scss';

const Editor = () => {
    const [currentLang, setCurrentLang] = useState<Language | null>(null);
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [currentLevelId, setCurrentLevelId] = useState<number>(1);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [fillValues, setFillValues] = useState<string[]>([]);
    const [orderedIndices, setOrderedIndices] = useState<number[]>([]); // New state for order type
    const [isGrading, setIsGrading] = useState(false);
    const [result, setResult] = useState<GradingResult | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [xpEarned, setXpEarned] = useState<number>(0);

    useEffect(() => {
        // 原 React 代码：从 state 获取 → 已适配 Taro/小程序（从 Storage 获取）
        const lang = Taro.getStorageSync('currentLanguage');
        const levelId = Taro.getStorageSync('currentLevelId') || 1;

        if (lang) {
            setCurrentLang(lang);
            setCurrentLevelId(levelId);

            const levels = LEVELS[lang] || [];
            const level = levels.find(l => l.id === levelId) || levels[0];
            setCurrentLevel(level);
            setFillValues(level?.type === 'fill' ? new Array(level.placeholders?.length || 0).fill('') : []);
            setOrderedIndices([]); // Reset ordered indices
            setProgress((levelId / levels.length) * 100);
        }
    }, []);

    const constructFinalCode = (): string => {
        if (!currentLevel) return "";
        if (currentLevel.type === 'choice') {
            return selectedOptionIndex !== null ? currentLevel.options![selectedOptionIndex] : "";
        } else if (currentLevel.type === 'order') {
            if (!currentLevel.shuffledLines) return "";
            // Construct code based on orderedIndices
            return orderedIndices.map(idx => currentLevel.shuffledLines![idx]).join('\n');
        } else {
            let finalCode = currentLevel.template || "";
            fillValues.forEach((val, i) => {
                finalCode = finalCode.replace(`{{${i}}}`, val || "___");
            });
            return finalCode;
        }
    };

    const handleSubmit = async () => {
        if (!currentLevel || !currentLang) return;
        const codeToSubmit = constructFinalCode();
        setIsGrading(true);
        setResult(null);
        setXpEarned(0);

        const gradingResult = await gradeCode(currentLevel, codeToSubmit, currentLang);
        setIsGrading(false);

        if (gradingResult.success) {
            // 原 React 代码：更新 gameState → 已适配 Taro/小程序（更新 Storage）
            const savedState = Taro.getStorageSync('python-quest-tree-v4');
            if (savedState) {
                const gameStateData = JSON.parse(savedState);
                const langProg = gameStateData.progress[currentLang];

                const isNewCompletion = !langProg.completedLevels.includes(currentLevel.id);
                const xpGain = isNewCompletion ? currentLevel.points : Math.floor(currentLevel.points / 5);

                setXpEarned(xpGain); // Set state for UI

                // Update Streak
                const today = new Date().toISOString().split('T')[0];
                let newStreak = langProg.currentStreak || 0;
                if (langProg.lastLoginDate !== today) {
                    const lastLogin = new Date(langProg.lastLoginDate);
                    const diffTime = Math.abs(new Date(today).getTime() - lastLogin.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        newStreak = 1;
                    }
                }

                const newScore = langProg.score + (isNewCompletion ? currentLevel.points : 0);
                const newCompleted = isNewCompletion ? [...langProg.completedLevels, currentLevel.id] : langProg.completedLevels;
                const nextLevelId = Math.max(langProg.unlockedLevelId, currentLevel.id + 1);

                gameStateData.progress[currentLang] = {
                    ...langProg,
                    completedLevels: newCompleted,
                    score: newScore,
                    unlockedLevelId: Math.min(nextLevelId, LEVELS[currentLang].length),
                    xp: (langProg.xp || 0) + xpGain,
                    currentStreak: newStreak,
                    lastLoginDate: today
                };

                Taro.setStorageSync('python-quest-tree-v4', JSON.stringify(gameStateData));
            }
        }
        setResult(gradingResult); // Set result last to trigger UI update
    };

    const handleNextLevel = () => {
        if (!result || !currentLang) return;
        if (result.success) {
            const levels = LEVELS[currentLang] || [];
            if (currentLevelId < levels.length) {
                const nextLevel = levels.find(l => l.id === currentLevelId + 1);
                if (nextLevel) {
                    setCurrentLevelId(nextLevel.id);
                    setCurrentLevel(nextLevel);
                    setSelectedOptionIndex(null);
                    setFillValues(nextLevel.type === 'fill' ? new Array(nextLevel.placeholders?.length || 0).fill('') : []);
                    setOrderedIndices([]);
                    setResult(null);
                    setHint(null);
                    setProgress(((currentLevelId + 1) / levels.length) * 100);
                }
            } else {
                // 原 React 代码：setView('dashboard') → 已适配 Taro/小程序（navigateBack）
                Taro.navigateBack();
            }
        } else {
            setResult(null);
        }
    };

    const handleBack = () => {
        // 原 React 代码：setView('dashboard') → 已适配 Taro/小程序（navigateBack）
        Taro.navigateBack();
    };

    const handleGetHint = async () => {
        if (!currentLevel || !currentLang) return;
        const hintText = await getHint(currentLevel, constructFinalCode(), currentLang);
        setHint(hintText);
    };

    if (!currentLevel || !currentLang) {
        return (
            <View className="editor-loading">
                <Text>加载中...</Text>
            </View>
        );
    }

    const isSubmitDisabled = isGrading || (
        currentLevel.type === 'choice' ? selectedOptionIndex === null :
            currentLevel.type === 'order' ? orderedIndices.length !== currentLevel.shuffledLines?.length :
                fillValues.some(v => !v.trim())
    );

    return (
        <View className="editor-container">
            <View className="editor-header">
                <View onClick={handleBack} className="close-btn">
                    <Text>✕</Text>
                </View>
                <View className="progress-bar">
                    <View className="progress-fill" style={{ width: `${progress}%` }}></View>
                </View>
            </View>

            <View className="editor-content">
                <View className="question-section">
                    <Text className="question-icon">
                        {currentLang === Language.PYTHON ? '🔮' : currentLang === Language.C ? '⚙️' : '🏰'}
                    </Text>
                    <View className="question-bubble">
                        <View className="bubble-arrow"></View>
                        <Text className="question-text">{currentLevel.instruction}</Text>
                    </View>
                </View>

                <View className="answer-section">
                    {currentLevel.type === 'choice' ? (
                        <OptionSelector
                            options={currentLevel.options || []}
                            selectedIndex={selectedOptionIndex}
                            onSelect={setSelectedOptionIndex}
                            disabled={isGrading}
                        />
                    ) : currentLevel.type === 'order' ? (
                        <CodeOrdering
                            lines={currentLevel.shuffledLines || []}
                            onOrderChange={setOrderedIndices}
                            disabled={isGrading}
                        />
                    ) : (
                        <FillInTheBlank
                            template={currentLevel.template || ""}
                            placeholders={currentLevel.placeholders || []}
                            values={fillValues}
                            onChange={(idx, val) => {
                                const newValues = [...fillValues];
                                newValues[idx] = val;
                                setFillValues(newValues);
                            }}
                            disabled={isGrading}
                        />
                    )}
                </View>
            </View>

            <View className="editor-footer">
                <View onClick={handleGetHint} className="hint-btn">
                    <Text>💡 提示</Text>
                </View>
                <View
                    onClick={!isSubmitDisabled ? handleSubmit : undefined}
                    className={`submit-btn ${isSubmitDisabled ? 'disabled' : ''}`}
                >
                    <Text>{isGrading ? "检查中..." : "提交鉴定"}</Text>
                </View>
            </View>

            {result && <FeedbackPanel result={result} level={currentLevel} onNext={handleNextLevel} isLastLevel={currentLevelId === LEVELS[currentLang]?.length} xpGain={xpEarned} />}

            {hint && !result && (
                <View className="hint-panel">
                    <Text className="hint-text">圣殿指示：{hint}</Text>
                    <View onClick={() => setHint(null)} className="hint-close">
                        <Text>✕</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Editor;
