// 인증 관련 상태 관리 (로그인 상태, 사용자 정보 등).

// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, firestore } from "../firebase/firebase"; // Firebase 인증 모듈
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore"; // Firestore 함수

// 회원가입 비동기 액션
export const signUp = createAsyncThunk(
    "auth/signUp",
    async ({ email, password, name, nickname, useNickname }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); //
            const user = userCredential.user;

            // Firestore에 추가 사용자 정보 저장
            await setDoc(doc(firestore, "users", user.uid), {
                name,
                nickname,
                useNickname,
                email,
            });

            return { ...user, displayName: name || nickname, name, nickname, useNickname };
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password); //
            const user = userCredential.user;


            // Firestore에서 사용자 추가 정보 가져오기
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return { ...user, ...userData }; // 추가 정보 포함하여 반환
            } else {
                throw new Error("사용자 정보가 없습니다.");
            }
        } catch (error) {
            // Firebase 에러 메시지 매핑
            const errorMessage = mapFirebaseError(error.code);
            return rejectWithValue(errorMessage);
        }
    }
);

// Firebase 에러 메시지 매핑 함수
const mapFirebaseError = (errorCode) => {
    const errorMessages = {
        "auth/user-not-found": "존재하지 않는 이메일입니다. 회원가입을 진행해주세요.",
        "auth/wrong-password": "비밀번호가 잘못되었습니다. 다시 시도해주세요.",
        "auth/too-many-requests": "잠시 후 다시 시도해주세요.",
        "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
    };

    return errorMessages[errorCode] || "로그인에 실패했습니다. 다시 시도해주세요.";
};

// 로그아웃 액션
export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
    try {
        await firebaseSignOut(auth); //Firebase 인증에서 로그아웃 수행
        console.log("User successfully logged out.");
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
    reducers: {
        // setUser 액션을 추가하여 외부에서 상태를 업데이트할 수 있도록 함
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
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
                state.user = null; // 상태에서 사용자 정보 초기화
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
