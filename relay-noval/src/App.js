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
import Navbar from "./components/HomePage/Nav/Navbar";
import Footer from "./components/HomePage/Footer/Footer";

// 신고 게시판 컴포넌트
import ReportBoard from "./components/HomePage/Footer/ReportBoard";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Firebase 인증 상태 변경을 감지하여 Redux 상태에 저장
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    dispatch(setUser({ ...user, ...userData }));
                }
            } else {
                dispatch(setUser(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="main-content">
                    <Routes>
                        {/* 홈 페이지 */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

                        {/* 신고 게시판 */}
                        <Route path="/report" element={<ReportBoard />} />

                        {/* 기타 라우트 */}
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/signout" element={<SignOut />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
