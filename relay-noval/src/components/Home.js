// 제일 처음으로 접근 가능한 메인 페이지.


// src/components/Home.js
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useSelector, useDispatch } from "react-redux"; // useDispatch 추가
import { signOut } from "../store/authSlice"; // signOut 액션 import
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
                <h1> 모두의 릴레이 소설 </h1>
                <nav>
                    {/* 로그인 여부에 따른 버튼 표시 */}
                    {user ? (
                        <>
                            <span onClick={handleLogout} style={{cursor: "pointer"}}>
                                로그아웃
                            </span>
                            <Link to="/my-novels">{user.email}의 소설</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                            <Link to="/signup">회원가입</Link>
                        </>
                    )}
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
