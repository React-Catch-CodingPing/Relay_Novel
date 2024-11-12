// src/components/Community.js
import React, { useState } from 'react';
import './Community.css';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

function Community() {
    const navigate = useNavigate();

    // 페이지네이션 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1);

    // 게시물 예시 데이터 (총 6개)
    const posts = [
        { id: 1, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
        { id: 2, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
        { id: 3, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
        { id: 4, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
        { id: 5, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
        { id: 6, title: '커뮤니티 글 제목', author: '글 작성자', info: '23줄 저자' },
    ];

    // 네비게이션 버튼 클릭 시 경로 이동
    const handleNavClick = (path) => {
        navigate(path);
    };

    // 페이지 변경 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="community-container">
            {/* 헤더 영역 */}
            <header className="community-header">
                <h1>커뮤니티</h1>
                <nav className="community-nav">
                    <button onClick={() => handleNavClick('/hall-of-fame')}>명예의 전당</button>
                    <button onClick={() => handleNavClick('/genres')}>장르별 모아보기</button>
                    <button onClick={() => handleNavClick('/authors')}>저자별 모아보기</button>
                    <button onClick={() => handleNavClick('/community')}>커뮤니티</button>
                    <button onClick={() => handleNavClick('/start-novel')}>소설 시작하기</button>
                    <div className="user-icon">👤</div>
                </nav>
            </header>

            {/* 게시물 리스트 영역 */}
            <main className="community-main">
                <h2>2024.10.??</h2>
                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.id} className="post-card">
                            <h3>“{post.title}”</h3>
                            <div className="post-author">
                                <img src="https://example.com/author-image.jpg" alt="author" className="author-image" />
                                <div>
                                    <span>{post.author}</span>
                                    <p>{post.info}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* 페이지네이션 영역 */}
            <div className="pagination">
                {[1, 2, 3, '...', 67, 68].map((page, index) => (
                    <button
                        key={index}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* 푸터 영역 */}
            <footer className="community-footer">
                <div className="footer-icon">💗</div>
                <div className="footer-links">
                    <p>Contact</p>
                    <ul>
                        <li>인스타그램</li>
                        <li>유튜브</li>
                        <li>페이스북</li>
                        <li>고객센터</li>
                    </ul>
                    <div className="social-icons">
                        <FaTwitter />
                        <FaInstagram />
                        <FaYoutube />
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Community;