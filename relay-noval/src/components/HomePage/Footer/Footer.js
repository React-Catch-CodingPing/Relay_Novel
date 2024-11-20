import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-icons">
                <span className="heart-icon">❤️</span>
            </div>
            <div className="footer-contact">
                <h3>Contact</h3>
                <ul>
                    <li><a href="https://instagram.com">인스타그램</a></li>
                    <li><a href="https://youtube.com">유튜브</a></li>
                    <li><a href="https://facebook.com">페이스북</a></li>
                    <li><a href="mailto:info@example.com">고객센터</a></li>
                    <li>
                        {/* 신고 게시판 링크 추가 */}
                        <Link to="/report" className="report-link">🚨 신고 게시판</Link>
                    </li>
                </ul>
            </div>
            <div className="footer-social-links">
                <p>info@example.com</p>
            </div>
        </footer>
    );
}

export default Footer;
