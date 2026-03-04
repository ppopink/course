// src/utils/geminiService.ts - AI 评分服务（需要适配）
// 原 React 代码：geminiService.ts → 标注为待适配（需要云函数或后端 API）

import Taro from '@tarojs/taro';
import { Level, GradingResult, Language } from '../types';

/**
 * ⚠️ 待适配：@google/genai 无法在小程序中直接运行
 * 
 * 建议方案：
 * 1. 改造为微信云函数调用
 * 2. 或部署后端 API，使用 Taro.request 调用
 * 
 * 当前实现：使用模拟数据
 */

export const gradeCode = async (level: Level, code: string, lang: Language): Promise<GradingResult> => {
    // 原 React 代码：使用 @google/genai 调用 Gemini API → 已标注待适配

    // TODO: 替换为云函数或后端 API 调用
    // 示例：
    // const result = await Taro.cloud.callFunction({
    //   name: 'gradeCode',
    //   data: { level, code, lang }
    // });
    // return result.result;

    // 或使用后端 API：
    // const result = await Taro.request({
    //   url: 'https://your-api.com/grade',
    //   method: 'POST',
    //   data: { level, code, lang }
    // });
    // return result.data;

    // 临时模拟实现（仅用于测试）
    await new Promise(resolve => setTimeout(resolve, 1000));

    let isCorrect = false;

    if (level.type === 'order') {
        // For Code Ordering, we check if the code matches the expected sequence
        // Hardcoded check for the sample level (id: 5)
        if (level.id === 5) {
            // The correct code should be:
            // items = []
            // items.append('sword')
            // items.append('shield')
            // print(items)
            // Or shield then sword.
            const correct1 = "items = []\nitems.append('sword')\nitems.append('shield')\nprint(items)";
            const correct2 = "items = []\nitems.append('shield')\nitems.append('sword')\nprint(items)";
            isCorrect = code === correct1 || code === correct2;
        } else {
            // Default fallback for other order levels
            isCorrect = true;
        }
    } else {
        const expectedAnswers = level.placeholders || level.options;
        isCorrect = expectedAnswers ? code.includes(expectedAnswers[0]) : false;
    }

    return {
        success: isCorrect,
        feedback: isCorrect ? '完美契约！代码通过检验' : '实验炸膛！请再试一次',
        explanation: isCorrect ? '你完全掌握了这个知识点！' : '提示：请检查代码逻辑顺序',
        suggestions: isCorrect ? [] : ['仔细阅读题目要求', '参考教程重新学习']
    };
};

export const getHint = async (level: Level, currentCode: string, lang: Language): Promise<string> => {
    // 原 React 代码：使用 @google/genai 获取提示 → 已标注待适配

    // TODO: 替换为云函数或后端 API 调用

    // 临时模拟实现
    await new Promise(resolve => setTimeout(resolve, 500));
    return `提示：这道题考察的是 ${level.topic}，仔细观察代码结构`;
};
