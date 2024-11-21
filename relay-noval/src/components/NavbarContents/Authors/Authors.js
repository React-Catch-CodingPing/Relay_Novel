import React, { useEffect, useState } from 'react';
import './Authors.css';
import { getUsers } from "../../../firebase/firestore/userService"; // userService 함수
import { subscribeToAuthors } from "../../../firebase/firestore/realTimeService"; // realTimeService 함수

const placeholderData = [
    { id: 1, name: '어진핑', image: '/images/author1.jpg', participationCount: 5, startedWorks: 12, hearts: 0 },
    { id: 2, name: '민금핑', image: '/images/author2.jpg', participationCount: 8, startedWorks: 8, hearts: 0 },
    { id: 3, name: '기환핑', image: '/images/author3.jpg', participationCount: 3, startedWorks: 15, hearts: 0 },
    { id: 4, name: '깜비핑', image: '/images/author4.jpg', participationCount: 3, startedWorks: 15, hearts: 0 },
];

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [likedByUser, setLikedByUser] = useState([]);
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

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const usersData = await getUsers(); // Firebase에서 사용자 정보 가져오기
                const authorsData = usersData.map((user) => ({
                    id: user.id,
                    name: user.name || "익명 저자",
                    image: user.profileImage || "/path/to/default-image.png",
                    participationCount: user.participationCount || 0, // 참여 작품 수
                    startedWorks: user.startedWorks || 0, // 시작 작품 수
                    hearts: user.hearts || 0, // 좋아요 수
                }));
                setAuthors(authorsData);
            } catch (error) {
                console.error("Error fetching authors:", error);
                setAuthors(placeholderData); // 에러 발생 시 placeholder 데이터 사용
            }
        };

        const unsubscribe = subscribeToAuthors((updatedAuthors) => {
            // 실시간 업데이트 데이터 반영
            const authorsData = updatedAuthors.map((user) => ({
                id: user.id,
                name: user.name || "익명 저자",
                image: user.profileImage || "/path/to/default-image.png",
                participationCount: user.participationCount || 0,
                startedWorks: user.startedWorks || 0,
                hearts: user.hearts || 0,
            }));
            setAuthors(authorsData);
        });

        fetchAuthors();

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, []);


    return (
        <div className="container">
            <div className="sort-buttons">
                {['작성순', '인기순'].map((option) => (
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
