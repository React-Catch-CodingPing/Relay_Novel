// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../../store/authSlice';
import "./Navbar.css"; // 스타일 파일 추가 (필요한 경우)

function Navbar() {
    const { user } = useSelector((state) => state.auth); // Redux에서 user 상태 가져오기
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 로그아웃 핸들러
    const handleLogout = () => {
        dispatch(signOut());
        navigate("/"); // 로그아웃 후 메인 페이지로 리디렉션
    };

// 로그인한 사용자 표시 이름 결정
    const displayName = user ? (user.useNickname ? user.nickname : user.name) : "";

    return (
        <nav className="navbar">
            {/* 왼쪽 로고 */}
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <i className="home-icon">🏠</i> {/* 홈 아이콘 */}
                </Link>
            </div>

            {/* 중간 메뉴 */}
            <ul className="navbar-menu">
                <li><Link to="/community">커뮤니티</Link></li>
                <li><Link to="/hall-of-fame">명예의 전당</Link></li>
                <li><Link to="/authors">저자별 모아보기</Link></li>
                <li><Link to="/genres">소설 모아보기</Link></li>
                <li><Link to="/start-novel">소설 시작하기</Link></li>
            </ul>

            {/* 오른쪽 로그인/회원가입 또는 로그아웃 */}
            <div className="navbar-right">
                {user ? (
                    <>
                        <span>{displayName}님</span>
                        <button onClick={handleLogout} className="logout-button">로그아웃</button>
                        <Link to="/profile"><button className="profile-button">프로필</button></Link>
                    </>
                ) : (
                    <>
                        <Link to="/login"><button className="login-button">로그인</button></Link>
                        <Link to="/signup"><button className="signup-button">회원가입</button></Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
