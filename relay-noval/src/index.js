// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store'; // 생성한 스토어 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Provider로 App을 감쌉니다 */}
            <App />
        </Provider>
    </React.StrictMode>
);



// 신민금 깃허브 연습 왔다감 ㅋㅋ
//메롱
// 깜기 왔다감
// 기환 왔다감

