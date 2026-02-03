// taro-app/babel.config.js
module.exports = {
    presets: [
        ['taro', {
            framework: 'react',
            ts: true // 关键：开启 TypeScript 支持
        }]
    ]
}