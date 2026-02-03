// src/constants/index.ts - 关卡数据常量
// 原 React 代码：constants.ts → 已适配 Taro（无需修改，完全保留）

import { Level, Difficulty, Language } from '../types';

export const LANGUAGE_THEMES: Record<Language, string> = {
    [Language.PYTHON]: 'from-blue-400 to-emerald-400',
    [Language.C]: 'from-slate-300 to-indigo-400',
    [Language.JAVA]: 'from-orange-400 to-red-500'
};

export const LEVELS: Record<Language, Level[]> = {
    [Language.PYTHON]: [
        // 第一章：蛇语契约
        { id: 1, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-1 自由的标签", topic: "动态类型", description: "在 Python 中，同一个标签可以贴在不同类型的物体上。", instruction: "观察代码，补全输出语句：", type: 'fill', template: "a = 1\na = \"text\"\nprint({{0}})", placeholders: ["a"], difficulty: Difficulty.BEGINNER, points: 10 },
        { id: 2, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-2 缩进的法则", topic: "Indentation", description: "缩进决定了代码属于哪个魔法块。", instruction: "属于 if 内部的代码块应该？", type: 'choice', options: ["向左推一格", "向右推一个缩进", "不需要缩进", "用大括号包裹"], difficulty: Difficulty.EASY, points: 15 },
        { id: 3, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-3 字符串魔法", topic: "f-string", description: "使用 f-string 可以将变量直接注入字符串。", instruction: "补全代码输出 'Hello Neo'：", type: 'fill', template: "name = \"Neo\"\nprint(f\"Hello {{0}}\")", placeholders: ["{name}"], difficulty: Difficulty.MEDIUM, points: 15 },
        // 第二章：空间背包
        { id: 4, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-1 万能收纳", topic: "List Append", description: "用列表 basket 接住掉下来的 apple。", instruction: "补全添加元素的魔法：", type: 'fill', template: "basket = []\nbasket.{{0}}('apple')", placeholders: ["append"], difficulty: Difficulty.EASY, points: 15 },
        { id: 5, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-2 激光切割", topic: "Slicing", description: "激光切割 [start:end] 可以提取列表的一部分。", instruction: "提取 [0,1,2,3,4] 中的 [1,2]，切片是？", type: 'fill', template: "nums = [0, 1, 2, 3, 4]\nsub = nums[{{0}}:{{1}}]", placeholders: ["1", "3"], difficulty: Difficulty.MEDIUM, points: 20 },
        { id: 6, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-3 倒序咒语", topic: "Negative Index", description: "使用负索引 [-1] 拿取最后一个人。", instruction: "补全获取末尾元素的索引：", type: 'fill', template: "team = ['A', 'B', 'C']\nlast = team[{{0}}]", placeholders: ["-1"], difficulty: Difficulty.MEDIUM, points: 20 },
        // ... 其他关卡数据保持一致
        { id: 13, chapterId: 6, chapterTitle: "第六章：英灵殿的召唤", title: "6-1 呼唤外援", topic: "Import", description: "想算根号，选 math 卡牌。", instruction: "导入模块的关键字是？", type: 'fill', template: "{{0}} math", placeholders: ["import"], difficulty: Difficulty.EASY, points: 15 },
        { id: 14, chapterId: 6, chapterTitle: "第六章：英灵殿的召唤", title: "6-2 别名的艺术", isBoss: true, topic: "Import As", description: "把复杂的模块缩写成契约名。", instruction: "补全模块缩写咒语：", type: 'fill', template: "import pandas {{0}} pd", placeholders: ["as"], difficulty: Difficulty.HARD, points: 40 }
    ],
    [Language.C]: [
        { id: 1, chapterId: 1, chapterTitle: "第一章：元素周期表", title: "1-1 容器的形状", topic: "Variables & Types", description: "区分 int, float, char。", instruction: "把 3.14 放入正确的瓶子：", type: 'choice', options: ["int", "float", "char", "void"], difficulty: Difficulty.BEGINNER, points: 10 },
        // ... C 语言其他关卡
    ],
    [Language.JAVA]: [
        { id: 1, chapterId: 1, chapterTitle: "第一章：基石奠基", title: "1-1 严苛的规格", topic: "Types", description: "强类型检查。", instruction: "哪行会报错？", type: 'choice', options: ["int a=1;", "int a=\"H\";", "double b=1.1;", "String c=\"H\";"], difficulty: Difficulty.BEGINNER, points: 15 },
        // ... Java 其他关卡
    ]
};
