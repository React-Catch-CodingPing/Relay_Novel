// 제일 처음으로 접근 가능한 메인 페이지.

// src/components/MainPage.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../store/authSlice";
import Navbar from "./Nav/Navbar";
import Header from "./Header/Header";
import WorksSection from "./WorksSection/WorksSection";
import AuthorsSection from "./AuthorsSection/AuthorsSection";
import Footer from "./Footer/Footer";
import "./Home.css";

const Home = () => {
    const { user } = useSelector((state) => state.auth); // auth에서 user 상태 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 로그아웃 기능
    const handleLogout = () => {
        dispatch(signOut()); // 로그아웃 액션 디스패치
        navigate("/"); // 로그아웃 후 홈으로 리디렉션
    };

    // 회원가입, 프로필에서 선택한 표시할 이름 결정
    const displayName = user ? (user.useNickname ? user.nickname : user.name) : "";

    return (
        <div className="home">
            {/* 상단 헤더 */}
            <Header/>

            {/* 메인 콘텐츠 영역 */}
            <div className="content">
                <WorksSection />
                <AuthorsSection />
            </div>

        </div>
    );
};

export default Home;
