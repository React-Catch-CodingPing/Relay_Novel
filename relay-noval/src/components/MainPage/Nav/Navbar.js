// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <i className="home-icon">🏠</i> {/* 홈 아이콘 추가 */}
                </Link>
            </div>
            <ul className="navbar-menu">
                <li><Link to="/community">커뮤니티</Link></li>
                <li><Link to="/hall-of-fame">명예의 전당</Link></li>
                <li><Link to="/authors">저자별 모아보기</Link></li>
                <li><Link to="/genres">소설 모아보기</Link></li>
                <li><Link to="/start-novel">소설 시작하기</Link></li>
            </ul>
            <div className="navbar-right">
            <Link to="/login"><button>로그인</button></Link>
                <Link to="/signup"><button>회원가입</button></Link>
            </div>
        </nav>
    );
}

export default Navbar;

