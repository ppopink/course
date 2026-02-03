// src/app.tsx - Taro 3.x 兼容版（彻底解决TS编译错误）
import React, { ReactNode } from 'react'; // 导入基础的ReactNode类型
import './app.scss';

// 手动声明Props接口，Taro编译链100%兼容
interface AppProps {
    children?: ReactNode; // 子节点类型，可选（?表示非必传）
}

// 用自定义的AppProps声明参数，替代PropsWithChildren
function App({ children }: AppProps) {
    // 原业务逻辑不变，小程序无DOM相关代码
    return children;
}

export default App;