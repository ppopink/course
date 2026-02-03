// src/components/OptionSelector/index.tsx - 选择题组件
// 原 React 代码：components/OptionSelector.tsx → 已适配 Taro

import { View, Text } from '@tarojs/components'; // 原 React 代码：import React → 已适配 Taro/小程序
import './index.scss';

interface OptionSelectorProps {
    options: string[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    disabled: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedIndex, onSelect, disabled }) => {
    return (
        // 原 React 代码：<div> → 已适配 Taro/小程序（<View>）
        <View className="option-selector">
            {options.map((option, index) => (
                // 原 React 代码：<button onClick> → 已适配 Taro/小程序（<View onClick>）
                <View
                    key={index}
                    onClick={() => !disabled && onSelect(index)}
                    className={`option-item ${selectedIndex === index ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                >
                    <View className="option-content">
                        <View className={`option-number ${selectedIndex === index ? 'active' : ''}`}>
                            {/* 原 React 代码：普通内容 → 保持不变 */}
                            <Text>{index + 1}</Text>
                        </View>
                        {/* 原 React 代码：<code> → 已适配 Taro/小程序（<Text>） */}
                        <Text className="option-code">{option}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default OptionSelector;
