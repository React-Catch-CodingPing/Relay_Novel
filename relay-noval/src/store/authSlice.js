// 인증 관련 상태 관리 (로그인 상태, 사용자 정보 등).

// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../firebase/firebase"; // Firebase 인증 모듈

// 회원가입 비동기 액션
export const signUp = createAsyncThunk(
    "auth/signUp",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 로그인 비동기 액션
export const signIn = createAsyncThunk(
    "auth/signIn",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 로그아웃 액션
export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
    try {
        await auth.signOut();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 회원가입
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 로그인
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 로그아웃
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export default authSlice.reducer;
