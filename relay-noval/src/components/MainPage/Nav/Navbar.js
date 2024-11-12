// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../../store/authSlice'; // 로그아웃 액션 import
import "./Navbar.css"; // 스타일 파일 import

function Navbar() {
    // Redux에서 사용자 로그인 상태 정보(user) 가져오기
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 로그아웃을 처리하는 함수
    const handleLogout = () => {
        dispatch(signOut()); // 로그아웃 액션 디스패치
        navigate("/"); // 로그아웃 후 메인 페이지로 리디렉션
    };

    // 표시할 사용자 이름 결정: useNickname 값에 따라 닉네임 또는 이름 선택
    const displayName = user ? (user.useNickname ? user.nickname : user.name) : "";

    return (
        <nav className="navbar">
            {/* 왼쪽: 홈으로 이동하는 로고 아이콘 */}
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src="/images/home-icon.png" alt="홈 아이콘" className="home-icon" /> {/* 홈 아이콘 이미지 */}
                </Link>
            </div>

            {/* 중앙 메뉴: 커뮤니티, 명예의 전당 등 각 페이지로의 링크 */}
            <ul className="navbar-menu">
                <li><Link to="/community">커뮤니티</Link></li>
                <li><Link to="/hall-of-fame">명예의 전당</Link></li>
                <li><Link to="/authors">저자별 모아보기</Link></li>
                <li><Link to="/genres">소설 모아보기</Link></li>
                <li><Link to="/start-novel">소설 시작하기</Link></li>
            </ul>

            {/* 오른쪽: 로그인/회원가입 또는 로그아웃/프로필 버튼 */}
            <div className="navbar-right">
                {user ? (
                    // 로그인한 경우: 사용자 이름과 로그아웃, 프로필 버튼 표시
                    <>
                        <span className="display-name">{displayName}님</span>
                        <button onClick={handleLogout} className="logout-button">로그아웃</button>
                        <Link to="/profile">
                            <button className="profile-button">프로필</button>
                        </Link>
                    </>
                ) : (
                    // 비로그인 상태: 로그인 및 회원가입 버튼 표시
                    <>
                        <Link to="/login">
                            <button className="login-button">로그인</button>
                        </Link>
                        <Link to="/signup">
                            <button className="signup-button">회원가입</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
