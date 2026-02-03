// src/app.tsx - Taro 入口组件
// 原 React 代码：index.tsx + App.tsx → 已适配 Taro

import { PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import './app.scss';

// 原 React 代码：import ReactDOM from 'react-dom/client' → 已移除（Taro 自动处理）

function App({ children }: PropsWithChildren) {
    // 原 React 代码：const rootElement = document.getElementById('root') → 已移除（小程序无 DOM）

    return children;
}

export default App;
