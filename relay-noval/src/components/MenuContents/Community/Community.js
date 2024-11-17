// src/components/Community.js
import React, { useState } from 'react';
import './Community.css';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Footer from "../../HomePage/Footer/Footer";

function Community() {
    const navigate = useNavigate();

    // 현재 날짜를 가져와서 "YYYY.MM.DD" 형식으로 변환
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

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
                커뮤니티 페이지
            </header>

            {/* 게시물 리스트 영역 */}
            <main className="community-main">
                <h2>{today}</h2>
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

        </div>
    );
}

export default Community;