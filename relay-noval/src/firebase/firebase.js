// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정을 코드에 직접 입력
const firebaseConfig = {
    apiKey: "AIzaSyACCspYhXfZWJvDNeg7xONh1rBVAIzzlSs",
    authDomain: "relay-novel-webproject.firebaseapp.com",
    projectId: "relay-novel-webproject",
    storageBucket: "relay-novel-webproject.appspot.com",
    messagingSenderId: "791727970618",
    appId: "1:791727970618:web:09b9db3b1ad3f74860d803"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증과 Firestore 내보내기
export const auth = getAuth(app);          // getAuth 함수로 인증 객체 가져오기
export const firestore = getFirestore(app); // getFirestore 함수로 Firestore 가져오기