import React, { useState } from 'react';
import './Authors.css';

const authorsData = [
    { id: 1, name: '어진핑', image: '/images/author1.jpg', participationCount: 5, startedWorks: 12, hearts: 0, thumbsUp: 0 },
    { id: 2, name: '민금핑', image: '/images/author2.jpg', participationCount: 8, startedWorks: 8, hearts: 0, thumbsUp: 0 },
    { id: 3, name: '기환핑', image: '/images/author3.jpg', participationCount: 3, startedWorks: 15, hearts: 0, thumbsUp: 0 },
    { id: 4, name: '깜비핑', image: '/images/author4.jpg', participationCount: 3, startedWorks: 15, hearts: 0, thumbsUp: 0 },
    { id: 5, name: '뚜비핑', image: '/images/author5.jpg', participationCount: 4, startedWorks: 10, hearts: 0, thumbsUp: 0 },
    { id: 6, name: '승현핑', image: '/images/author6.jpg', participationCount: 6, startedWorks: 7, hearts: 0, thumbsUp: 0 },
    { id: 7, name: '콩이핑', image: '/images/author7.jpg', participationCount: 2, startedWorks: 5, hearts: 0, thumbsUp: 0 },
    { id: 8, name: '지수핑', image: '/images/author8.jpg', participationCount: 9, startedWorks: 6, hearts: 0, thumbsUp: 0 },
    { id: 9, name: '빵빵핑', image: '/images/author9.jpg', participationCount: 8, startedWorks: 11, hearts: 0, thumbsUp: 0 },
    { id: 10, name: '하츄핑', image: '/images/author10.jpg', participationCount: 5, startedWorks: 9, hearts: 0, thumbsUp: 0 },
    { id: 11, name: '마루핑', image: '/images/author11.jpg', participationCount: 3, startedWorks: 4, hearts: 0, thumbsUp: 0 },
    { id: 12, name: '푸름핑', image: '/images/author12.jpg', participationCount: 4, startedWorks: 7, hearts: 0, thumbsUp: 0 },
    { id: 13, name: '새벽핑', image: '/images/author13.jpg', participationCount: 7, startedWorks: 6, hearts: 0, thumbsUp: 0 },
    { id: 14, name: '노을핑', image: '/images/author14.jpg', participationCount: 10, startedWorks: 8, hearts: 0, thumbsUp: 0 },
    { id: 15, name: '별빛핑', image: '/images/author15.jpg', participationCount: 6, startedWorks: 12, hearts: 0, thumbsUp: 0 },
    { id: 16, name: '하늘핑', image: '/images/author16.jpg', participationCount: 8, startedWorks: 9, hearts: 0, thumbsUp: 0 },
    { id: 17, name: '구름핑', image: '/images/author17.jpg', participationCount: 3, startedWorks: 6, hearts: 0, thumbsUp: 0 },
    { id: 18, name: '달빛핑', image: '/images/author18.jpg', participationCount: 9, startedWorks: 10, hearts: 0, thumbsUp: 0 },
    { id: 19, name: '은하핑', image: '/images/author19.jpg', participationCount: 7, startedWorks: 11, hearts: 0, thumbsUp: 0 },
    { id: 20, name: '우주핑', image: '/images/author20.jpg', participationCount: 10, startedWorks: 13, hearts: 0, thumbsUp: 0 },
];

const Authors = () => {
    const [authors, setAuthors] = useState(authorsData);
    const [likedByUser, setLikedByUser] = useState([]);
    const [recommendedByUser, setRecommendedByUser] = useState([]);
    const [sortOption, setSortOption] = useState(null); // 초기 상태는 아무것도 클릭되지 않은 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageGroup, setCurrentPageGroup] = useState(1);

    const itemsPerPage = 4;
    const pagesPerGroup = 4;
    const totalPages = Math.ceil(authors.length / itemsPerPage);

    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedAuthors = [...authors]
        .sort((a, b) => {
            if (sortOption === '작성순') return b.startedWorks - a.startedWorks;
            if (sortOption === '인기순') return b.hearts - a.hearts;
            if (sortOption === '추천순') return b.thumbsUp - a.thumbsUp;
            return 0;
        })
        .slice(startIndex, startIndex + itemsPerPage);

    const handleSortChange = (option) => {
        // 같은 옵션을 다시 클릭하면 초기화
        if (sortOption === option) {
            setSortOption(null); // 초기화
        } else {
            setSortOption(option);
        }
        setCurrentPage(1);
        setCurrentPageGroup(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextGroup = () => {
        if (endPage < totalPages) {
            setCurrentPageGroup((prevGroup) => prevGroup + 1);
            setCurrentPage(endPage + 1);
        }
    };

    const handlePreviousGroup = () => {
        if (startPage > 1) {
            setCurrentPageGroup((prevGroup) => prevGroup - 1);
            setCurrentPage(startPage - pagesPerGroup);
        }
    };

    const handleHeartClick = (authorId) => {
        const updatedAuthors = authors.map((author) => {
            if (author.id === authorId) {
                const newHearts = likedByUser.includes(authorId)
                    ? author.hearts - 1
                    : author.hearts + 1;
                return { ...author, hearts: newHearts };
            }
            return author;
        });

        setAuthors(updatedAuthors);

        if (likedByUser.includes(authorId)) {
            setLikedByUser(likedByUser.filter((id) => id !== authorId)); // 취소 시 제거
        } else {
            setLikedByUser([...likedByUser, authorId]); // 하트 클릭 시 추가
        }
    };

    const handleThumbsUpClick = (authorId) => {
        const updatedAuthors = authors.map((author) => {
            if (author.id === authorId) {
                const newThumbsUp = recommendedByUser.includes(authorId)
                    ? author.thumbsUp - 1
                    : author.thumbsUp + 1;
                return { ...author, thumbsUp: newThumbsUp };
            }
            return author;
        });

        setAuthors(updatedAuthors);

        if (recommendedByUser.includes(authorId)) {
            setRecommendedByUser(recommendedByUser.filter((id) => id !== authorId)); // 취소 시 제거
        } else {
            setRecommendedByUser([...recommendedByUser, authorId]); // 따봉 클릭 시 추가
        }
    };

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
                {displayedAuthors.map((author) => (
                    <div key={author.id} className="card">
                        <img src={author.image} alt={author.name} />
                        <h3>{author.name}</h3>
                        <p>{author.participationCount}줄 참여 중</p>
                        <p>{author.startedWorks}작품 시작</p>
                        <div className="card-buttons">
                            <button className="button">프로필 보기</button>
                            <div className="interaction">
                                <button
                                    className="heart-button"
                                    onClick={() => handleHeartClick(author.id)}
                                >
                                    {likedByUser.includes(author.id) ? '❤️' : '🤍'}
                                </button>
                                <span className="count">{author.hearts}</span>
                            </div>
                            <div className="interaction">
                                <button
                                    className="thumbs-up-button"
                                    onClick={() => handleThumbsUpClick(author.id)}
                                >
                                    {recommendedByUser.includes(author.id) ? '👍' : '👍'}
                                </button>
                                <span className="count">{author.thumbsUp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                    disabled={endPage >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Authors;
