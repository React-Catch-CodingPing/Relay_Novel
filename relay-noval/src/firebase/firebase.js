// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBrns41eu0OU-i5fizzrqwQ7ohO0UgDtB0",
    authDomain: "relay-novel-web-e00bc.firebaseapp.com",
    projectId: "relay-novel-web-e00bc",
    storageBucket: "relay-novel-web-e00bc.firebasestorage.app",
    messagingSenderId: "178551455265",
    appId: "1:178551455265:web:39f949cb4694c58babad60"
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