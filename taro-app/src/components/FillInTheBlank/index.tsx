// src/components/FillInTheBlank/index.tsx - 填空题组件
// 原 React 代码：components/FillInTheBlank.tsx → 已适配 Taro

import { View, Text, Input } from '@tarojs/components'; // 原 React 代码：import React → 已适配 Taro/小程序
import './index.scss';

interface FillInTheBlankProps {
    template: string;
    placeholders: string[];
    values: string[];
    onChange: (index: number, value: string) => void;
    disabled: boolean;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({ template, placeholders, values, onChange, disabled }) => {
    // 原 React 代码：正则匹配占位符 → 保持不变
    const placeholderRegex = /\{\{(\d+)\}\}/g;

    const calculateWidth = (val: string, placeholder: string) => {
        const text = val || placeholder;
        let len = 0;
        for (let i = 0; i < text.length; i++) {
            len += text.charCodeAt(i) > 127 ? 2.2 : 1.1;
        }
        return `${Math.max(len + 2, 4)}ch`;
    };

    const lines = template.split('\n');
    let placeholderCount = 0;

    return (
        // 原 React 代码：<div> → 已适配 Taro/小程序（<View>）
        <View className="fill-blank-container">
            <View className="fill-blank-content">
                {lines.map((line, lineIdx) => {
                    const parts = line.split(placeholderRegex);

                    return (
                        <View key={lineIdx} className="fill-blank-line">
                            {parts.map((part, partIdx) => {
                                if (partIdx % 2 === 1) {
                                    const currentIdx = placeholderCount++;
                                    const placeholderText = placeholders[currentIdx] || '';
                                    const currentValue = values[currentIdx] || '';

                                    return (
                                        // 原 React 代码：<input onChange={(e) => onChange(idx, e.target.value)} → 已适配 Taro/小程序（<Input onInput>）
                                        <Input
                                            key={currentIdx}
                                            type="text"
                                            value={currentValue}
                                            onInput={(e) => onChange(currentIdx, e.detail.value)} // 原 React 代码：e.target.value → 已适配 Taro（e.detail.value）
                                            disabled={disabled}
                                            placeholder={placeholderText}
                                            style={{ width: calculateWidth(currentValue, placeholderText) }}
                                            className={`fill-blank-input ${disabled ? 'disabled' : ''}`}
                                        />
                                    );
                                }
                                // 原 React 代码：<span> → 已适配 Taro/小程序（<Text>）
                                return (
                                    <Text key={partIdx} className="fill-blank-text">
                                        {part}
                                    </Text>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default FillInTheBlank;
