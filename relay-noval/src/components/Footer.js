// src/components/Footer.js
import React from 'react';
import './Footer.css';
import { FaInstagram, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { SiXdotcom } from 'react-icons/si';

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
                </ul>
            </div>
            <div className="footer-social-links">
                <p>Contact: info@example.com</p>
            </div>
        </footer>
    );
}

export default Footer;
