// src/components/Community.js
import React, { useState } from "react";
import "./Community.css"; // CSS 파일을 통해 스타일 적용
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 React Router 훅

function Community() {
    const navigate = useNavigate();

    // 현재 날짜를 "YYYY.MM.DD" 형식으로 변환
    const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    // 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1); // 기본값은 첫 페이지

    // 한 페이지에 표시할 게시물 수
    const postsPerPage = 6;

    // 게시물 데이터 (예시 데이터)
    const posts = [
        { id: 1, title: "커뮤니티 글 제목 1", author: "글 작성자 1", info: "23줄 저자" },
        { id: 2, title: "커뮤니티 글 제목 2", author: "글 작성자 2", info: "23줄 저자" },
        { id: 3, title: "커뮤니티 글 제목 3", author: "글 작성자 3", info: "23줄 저자" },
        { id: 4, title: "커뮤니티 글 제목 4", author: "글 작성자 4", info: "23줄 저자" },
        { id: 5, title: "커뮤니티 글 제목 5", author: "글 작성자 5", info: "23줄 저자" },
        { id: 6, title: "커뮤니티 글 제목 6", author: "글 작성자 6", info: "23줄 저자" },
        { id: 7, title: "커뮤니티 글 제목 7", author: "글 작성자 4", info: "23줄 저자" },
        { id: 8, title: "커뮤니티 글 제목 8", author: "글 작성자 5", info: "23줄 저자" },
        { id: 9, title: "커뮤니티 글 제목 9", author: "글 작성자 6", info: "23줄 저자" },
    ];

    // 현재 페이지에 해당하는 게시물 계산
    const indexOfLastPost = currentPage * postsPerPage; // 현재 페이지의 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 현재 페이지의 첫 게시물 인덱스
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 표시할 게시물

    // 이전 페이지로 이동하는 함수
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1); // 현재 페이지를 1 감소
        }
    };

    // 다음 페이지로 이동하는 함수
    const handleNextPage = () => {
        if (currentPage < Math.ceil(posts.length / postsPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1); // 현재 페이지를 1 증가
        }
    };

    // 특정 페이지로 이동하는 함수
    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지를 변경
    };

    return (
        <div className="community-container">
            {/* 페이지 상단 헤더 */}
            <header className="community-header">커뮤니티 페이지</header>

            {/* 게시물 리스트 영역 */}
            <main className="community-main">
                <h2>{today}</h2>

                {/* 데이터가 없는 경우 표시 */}
                {currentPosts.length === 0 ? (
                    <p className="no-data-message">데이터가 없습니다.</p>
                ) : (
                    <div className="posts-grid">
                        {currentPosts.map((post) => (
                            <div key={post.id} className="post-card">
                                <h3>“{post.title}”</h3>
                                <div className="post-author">
                                    <img
                                        src="https://example.com/author-image.jpg"
                                        alt="author"
                                        className="author-image"
                                    />
                                    <div>
                                        <span>{post.author}</span>
                                        <p>{post.info}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* 페이지네이션 영역 */}
            <div className="pagination">
                {/* 이전 버튼 */}
                <button
                    className="pagination-button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1} // 첫 페이지에서는 비활성화
                >
                    이전
                </button>

                {/* 페이지 번호 버튼 */}
                {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(
                    (page) => (
                        <button
                            key={page + 1}
                            className={`pagination-button ${
                                currentPage === page + 1 ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </button>
                    )
                )}

                {/* 다음 버튼 */}
                <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(posts.length / postsPerPage)} // 마지막 페이지에서는 비활성화
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default Community;