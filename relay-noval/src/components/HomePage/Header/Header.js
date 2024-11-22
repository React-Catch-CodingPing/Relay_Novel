import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <img src={`images/home-logo.png`} alt="Banner" className="header-image" />
            {/* 헤더 텍스트 */}
            <div className="header-text">재미있는 릴레이 소설 쓰기</div>
        </header>
    );
}

export default Header;
