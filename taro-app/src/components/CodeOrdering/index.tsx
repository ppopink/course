
import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { Level } from '../../types';
import './index.scss';

interface CodeOrderingProps {
    lines: string[]; // These should be the shuffled lines
    onOrderChange: (orderedIndices: number[]) => void;
    disabled?: boolean;
}

const CodeOrdering: React.FC<CodeOrderingProps> = ({ lines, onOrderChange, disabled }) => {
    // We track the *indices* of the original lines array
    const [availableIndices, setAvailableIndices] = useState<number[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    useEffect(() => {
        // Initialize available indices [0, 1, 2, ...]
        setAvailableIndices(lines.map((_, i) => i));
        setSelectedIndices([]);
    }, [lines]);

    useEffect(() => {
        onOrderChange(selectedIndices);
    }, [selectedIndices, onOrderChange]);

    const handleSelect = (index: number) => {
        if (disabled) return;
        setAvailableIndices(prev => prev.filter(i => i !== index));
        setSelectedIndices(prev => [...prev, index]);
    };

    const handleDeselect = (index: number) => {
        if (disabled) return;
        setSelectedIndices(prev => prev.filter(i => i !== index));
        setAvailableIndices(prev => [...prev, index].sort((a, b) => a - b)); // Keep available sorted optionally, or just push back
    };

    return (
        <View className="code-ordering-container">
            {/* Area for selected code blocks */}
            <View className="code-area">
                <Text className="area-label">你的代码：</Text>
                {selectedIndices.length === 0 && (
                    <View className="placeholder-text">
                        <Text>点击下方代码块按顺序排列</Text>
                    </View>
                )}
                <View className="blocks-container">
                    {selectedIndices.map((lineIndex) => (
                        <View
                            key={`selected-${lineIndex}`}
                            className="code-block selected"
                            onClick={() => handleDeselect(lineIndex)}
                        >
                            <Text className="code-text">{lines[lineIndex]}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Area for available code blocks */}
            <View className="source-area">
                <Text className="area-label">待选代码：</Text>
                <View className="blocks-container">
                    {availableIndices.map((lineIndex) => (
                        <View
                            key={`available-${lineIndex}`}
                            className="code-block available"
                            onClick={() => handleSelect(lineIndex)}
                        >
                            <Text className="code-text">{lines[lineIndex]}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default CodeOrdering;
