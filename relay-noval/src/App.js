// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import { auth, firestore } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 기존에 추가된 컴포넌트들
import Home from "./components/MainPage/Home";
import Profile from "./components/Profile/Profile";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import SignOut from "./components/Auth/SignOut";

// 새로 추가된 컴포넌트들
import Navbar from "./components/MainPage/Nav/Navbar";
import Footer from "./components/MainPage/Footer/Footer";
import WorksSection from "./components/MainPage/WorksSection/WorksSection";
import AuthorsSection from "./components/MainPage/AuthorsSection/AuthorsSection";

// 추가한 페이지 컴포넌트들
import HallOfFame from "./components/HallOfFame/HallOfFame";
import Genres from "./components/Genres/Genres";
import Authors from "./components/Authors/Authors";
import Community from "./components/Community/Community";
import StartNovel from "./components/StartNovel/StartNovel";



// 추가된 WorkDetail 컴포넌트
import WorkDetail from "./components/WorkDetail/WorkDetail";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Firebase 인증 상태 변경을 감지하여 Redux 상태에 저장
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Firestore에서 사용자 정보 가져오기
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Redux 상태에 사용자 정보 저장
                    dispatch(setUser({ ...user, ...userData }));
                }
            } else {
                // 로그아웃 상태일 경우 Redux 상태 초기화
                dispatch(setUser(null));
            }
        });

        // 컴포넌트 언마운트 시 리스너 정리
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                {/* 공통 네비게이션 바 */}
                <Navbar />

                <Routes>
                    {/* MainPage 페이지 */}
                    <Route path="/" element={<Home />} />

                    {/* 회원가입 및 로그인 페이지 */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/signout" element={<SignOut />} />

                    {/* 추가된 페이지들 */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/hall-of-fame" element={<HallOfFame />} />
                    <Route path="/genres" element={<Genres />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/start-novel" element={<StartNovel />} />


                    {/* /authors 경로로 저자 목록 페이지 설정 */}
                    <Route path="/authors" element={<AuthorsSection />} />

                  >

                    {/* /works/:id 경로로 작품 상세 페이지 설정 */}
                    <Route path="/works/:id" element={<WorkDetail />} />
                </Routes>

                {/* 하단 Footer */}
                <Footer />
            </div>
        </Router>
    );
};

export default App;
