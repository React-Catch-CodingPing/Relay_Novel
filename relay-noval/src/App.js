// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import { auth, firestore } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 기존에 추가된 컴포넌트들
import Home from "./components/HomePage/Home";
import Profile from "./components/Profile/Profile";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import SignOut from "./components/Auth/SignOut";

// 새로 추가된 컴포넌트들
import Navbar from "./components/HomePage/Nav/Navbar";
import Footer from "./components/HomePage/Footer/Footer";
import TodaysNovel from "./components/HomePage/TodaysNovel/TodaysNovel";
import TodaysAuthors from "./components/HomePage/TodaysAuthors/TodaysAuthors";

// 추가한 페이지 컴포넌트들
import HallOfFame from "./components/NavbarContents/HallOfFame/HallOfFame";
import Genres from "./components/NavbarContents/Genres/Genres";
import Authors from "./components/NavbarContents/Authors/Authors";
import Community from "./components/NavbarContents/Community/Community";
import NovelCreate from "./components/Novel/NovelCreate";
import NovelList from "./components/Novel/NovelList";
import NovelDetail from "./components/Novel/NovelDetails/NovelDetail";

import AuthorProfile from "./components/HomePage/AuthorProfile/AuthorProfile";
import WritingGuide from "./components/NavbarContents/WritingGuide/WritingGuide";

import WritePost from "./components/NavbarContents/Community/WritePost";
import PostDetail from "./components/NavbarContents/Community/PostDetail";

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
                <Navbar/>
                <div className="main-content">
                    <Routes>
                        {/* HomePage 페이지 */}
                        {/* Home 페이지 */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

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
                        <Route path="/novel-create" element={<NovelCreate />} />
                        <Route path="/novel-list" element={<NovelList />} />
                        <Route path="/writing-guide" element={<WritingGuide />} />

                        <Route path="/authors-section" element={<TodaysAuthors />} />
                        <Route path="/authors/:id" element={<AuthorProfile />} />

                        <Route path="/novels-section" element={<TodaysNovel />} />
                        <Route path="/novels/:novelId" element={<NovelDetail />} />

                        <Route path="/community/write" element={<WritePost />} />
                        <Route path="/community/:id" element={<PostDetail />} />

                </Routes>
                </div>
                {/* 하단 Footer */}
                <Footer />
            </div>
        </Router>
    );
};

export default App;
