
import { GoogleGenAI, Type } from "@google/genai";
import { Level, GradingResult, Language } from "./types";

export const gradeCode = async (level: Level, code: string, lang: Language): Promise<GradingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 构造参考答案字符串，方便 AI 对比
  const expectedAnswers = level.placeholders?.join(", ") || "无";

  const prompt = `
    你是一位对计算机专业新生充满关怀的资深导师（学长角色）。
    
    【任务】
    评审学生的 ${lang} 代码。
    
    【关卡信息】
    - 主题：${level.topic}
    - 任务：${level.instruction}
    - 参考正确填空项：${expectedAnswers}
    
    【待评审代码】
    \`\`\`${lang.toLowerCase()}
    ${code}
    \`\`\`

    【判定准则 - 非常重要】
    1. 宽容性：只要代码逻辑正确、能运行并达到了任务目的，必须判定为 success: true。
    2. 忽略细微差异：不要因为多一个空格、少一个空格、或者单双引号的互换（例如 print('hi') vs print("hi")）而判定失败。
    3. 核心概念：重点检查学生是否理解了 "${level.topic}"。
    4. 心理建设：即使学生写错了，也要先给出一个温暖的鼓励，再指出具体的改进点。
    
    【返回内容】
    - success: 布尔值，逻辑正确即为 true。
    - feedback: 一句简短的赞美或鼓励的话。
    - explanation: 简要分析代码，如果错了，请温柔地指出原因。
    - suggestions: 提供 1-2 条改进建议。

    返回格式：纯 JSON 对象。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // 使用 Flash 模型通常对这种简单的逻辑判定响应更快且稳定
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            explanation: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["success", "feedback", "explanation"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim()) as GradingResult;
    
    // 兜底逻辑：如果 AI 返回的数据结构不完整，确保至少有 success 字段
    if (typeof result.success === 'undefined') {
        result.success = false;
        result.feedback = "导师正在沉思...";
    }
    
    return result;
  } catch (error) {
    console.error("Grading error:", error);
    return {
      success: false,
      feedback: "协议同步中断。",
      explanation: "由于神经网络波动，AI 导师暂时无法查看你的代码。请稍后再试。"
    };
  }
};

export const getHint = async (level: Level, currentCode: string, lang: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    新生在 ${lang} 挑战中卡住了。
    任务是：${level.instruction}
    当前学生写的代码是：\`\`\`${lang.toLowerCase()}\n${currentCode}\n\`\`\`
    参考答案是：${level.placeholders?.join(", ")}
    
    请作为一个温暖的学长，给出一个精准的、带有鼓励性的中文提示。
    不要直接给出完整答案，而是用启发式的方法引导他们。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "尝试从基本语法结构入手，或者检查一下拼写是否有误。";
  } catch (error) {
    return "思考一下这章的核心概念，多试几次。";
  }
};
