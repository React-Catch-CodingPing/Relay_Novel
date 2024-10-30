// 리덕스 스토어를 생성하고, authSlice를 포함.

// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// 스토어 생성
const store = configureStore({
    reducer: {
        auth: authReducer, // auth 리듀서 등록
    },
});

export default store;

