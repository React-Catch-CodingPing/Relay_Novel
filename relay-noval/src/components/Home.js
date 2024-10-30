// 제일 처음으로 접근 가능한 메인 페이지.


// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // 스타일링 파일 추가

const Home = () => {
    // 예제 소설 항목 데이터
    const novels = [
        { id: 1, title: "Novel 1", description: "A fascinating story" },
        { id: 2, title: "Novel 2", description: "An exciting adventure" },
        { id: 3, title: "Novel 3", description: "A mysterious journey" },
    ];

    return (
        <div className="home">
            {/* 상단 네비게이션 */}
            <header className="navbar">
                <h1>소설 창작 홈페이지</h1>
                <nav>
                    <Link to="/login">로그인</Link>
                    <Link to="/signup">회원가입</Link>
                    <Link to="/my-novels">내 소설</Link>
                </nav>
            </header>

            {/* 소설 목록 */}
            <div className="novel-list">
                {novels.map((novel) => (
                    <div key={novel.id} className="novel-card">
                        <h2>{novel.title}</h2>
                        <p>{novel.description}</p>
                        <button>자세히 보기</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
