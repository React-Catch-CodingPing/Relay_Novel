// 제일 처음으로 접근 가능한 메인 페이지.

// src/components/HomePage.js
import React from "react";
import Header from "./Header/Header";
import TodaysNovel from "./TodaysNovel/TodaysNovel";
import TodaysAuthors from "./TodaysAuthors/TodaysAuthors";
import TodaysTalk from "./TodaysTalk/TodaysTalk";
import "./Home.css";

const Home = () => {

    return (
        <div className="home">
            {/* 상단 헤더 */}
            <Header/>
            {/* 메인 콘텐츠 영역 */}
            <div className="content">
                <TodaysNovel />
                <TodaysAuthors />
                <TodaysTalk />
            </div>

        </div>
    );
};

export default Home;
