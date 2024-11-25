// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증과 Firestore 내보내기
export const auth = getAuth(app);          // getAuth 함수로 인증 객체 가져오기
export const firestore = getFirestore(app); // getFirestore 함수로 Firestore 가져오기
export default app;
export const storage = getStorage();


// 세션 지속성을 로컬로 설정
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting session persistence:", error);
    });

// 인증 상태 변경을 감지하는 함수
export const monitorAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};