// src/components/Header.js
import React from 'react';
import './Header.css';


function Header() {
    return (
        <header className="header">
            <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="Banner" className="header-image" />
        </header>
    );
}

export default Header;
