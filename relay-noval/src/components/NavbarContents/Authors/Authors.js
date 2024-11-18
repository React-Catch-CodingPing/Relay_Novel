import React, { useState } from 'react';
import './Authors.css';

const authorsData = [
    { id: 1, name: '어진핑', image: '/images/author1.jpg', participationCount: 5, startedWorks: 12 },
    { id: 2, name: '민금핑', image: '/images/author2.jpg', participationCount: 8, startedWorks: 8 },
    { id: 3, name: '기환핑', image: '/images/author3.jpg', participationCount: 3, startedWorks: 15 },
    { id: 4, name: '깜비핑', image: '/images/author4.jpg', participationCount: 3, startedWorks: 15 },
    { id: 5, name: '동현핑', image: '/images/author5.jpg', participationCount: 4, startedWorks: 10 },
    { id: 6, name: '승환핑', image: '/images/author6.jpg', participationCount: 6, startedWorks: 7 },
    // 필요에 따라 데이터 추가
];

const Authors = () => {
    const [sortOption, setSortOption] = useState('작성순'); // 기본 정렬 옵션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // 한 페이지에 표시할 저자 수
    const pagesToShow = 4; // 한 번에 표시할 페이지 수
    const maxPages = 20; // 페이지네이션을 20페이지까지로 제한

    const totalPages = Math.min(Math.ceil(authorsData.length / itemsPerPage), maxPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedAuthors = [...authorsData]
        .sort((a, b) => {
            if (sortOption === '작성순') return b.startedWorks - a.startedWorks;
            if (sortOption === '인기순') return b.participationCount - a.participationCount;
            if (sortOption === '추천순') return (b.participationCount + b.startedWorks) - (a.participationCount + a.startedWorks);
            return 0;
        })
        .slice(startIndex, startIndex + itemsPerPage);

    const handleSortChange = (option) => {
        setSortOption(option);
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextGroup = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + pagesToShow, maxPages));
    };

    const handlePreviousGroup = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - pagesToShow, 1));
    };

    // 표시할 페이지 그룹 범위 계산
    const startPage = Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
    const endPage = Math.min(startPage + pagesToShow - 1, maxPages);
    const pages = Array.from({ length: pagesToShow }, (_, i) => startPage + i);

    return (
        <div className="container">
            <div className="sort-buttons">
                {['작성순', '인기순', '추천순'].map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`sort-button ${sortOption === option ? 'active' : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <h2>저자 모아보기</h2>
            <div className="card-grid">
                {displayedAuthors.length > 0 ? (
                    displayedAuthors.map((author) => (
                        <div key={author.id} className="card">
                            <img src={author.image} alt={author.name} />
                            <h3>{author.name}</h3>
                            <div className="writing-status">
                                <p>{author.participationCount}줄 참여 중</p>
                                <p>{author.startedWorks}작품 시작</p>
                            </div>
                            <button className="button">프로필 보기</button>
                        </div>
                    ))
                ) : (
                    <p>데이터가 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button
                    onClick={handlePreviousGroup}
                    className="page-button"
                    disabled={startPage === 1}
                >
                    이전
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`page-button ${currentPage === page ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={handleNextGroup}
                    className="page-button"
                    disabled={endPage >= maxPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Authors;
