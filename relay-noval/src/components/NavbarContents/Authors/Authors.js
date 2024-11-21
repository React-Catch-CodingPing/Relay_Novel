import React, { useEffect, useState } from 'react';
import './Authors.css';
import { getAuthorLikeStatus, updateAuthorLike, getUsers} from "../../../firebase/firestore/userService"; // userService 함수
import { subscribeToAuthors } from "../../../firebase/firestore/realTimeService";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase/firebase"; // 인증 정보 가져오기

const placeholderData = [
    { id: 1, name: '어진핑', image: '/images/author1.jpg', participationCount: 5, startedWorks: 12, hearts: 0 },
    { id: 2, name: '민금핑', image: '/images/author2.jpg', participationCount: 8, startedWorks: 8, hearts: 0 },
    { id: 3, name: '기환핑', image: '/images/author3.jpg', participationCount: 3, startedWorks: 15, hearts: 0 },
    { id: 4, name: '깜비핑', image: '/images/author4.jpg', participationCount: 3, startedWorks: 15, hearts: 0 },
];

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [likedByUser, setLikedByUser] = useState([]);
    const [sortOption, setSortOption] = useState(null);
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
        if (sortOption === option) {
            setSortOption(null);
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

    const handleHeartClick = async (authorId) => {
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const liked = likedByUser.includes(authorId);

        try {
            await updateAuthorLike(currentUserId, authorId, liked); // 좋아요 상태 업데이트
            const updatedAuthors = authors.map((author) => {
                if (author.id === authorId) {
                    return {
                        ...author,
                        hearts: liked ? author.hearts - 1 : author.hearts + 1,
                    };
                }
                return author;
            });
            setAuthors(updatedAuthors);

            if (liked) {
                setLikedByUser(likedByUser.filter((id) => id !== authorId));
            } else {
                setLikedByUser([...likedByUser, authorId]);
            }
        } catch (error) {
            console.error("Error updating like:", error);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const usersData = await getUsers();
                const currentUserId = auth.currentUser?.uid;

                if (currentUserId) {
                    const likedStatuses = await Promise.all(
                        usersData.map((user) =>
                            getAuthorLikeStatus(currentUserId, user.id)
                        )
                    );

                    const authorsData = usersData.map((user, index) => ({
                        id: user.id,
                        name: user.name || "익명 저자",
                        image: user.profileImage || "/path/to/default-image.png",
                        participationCount: user.participationCount || 0,
                        startedWorks: user.startedWorks || 0,
                        hearts: user.likes || 0,
                    }));

                    setLikedByUser(
                        authorsData
                            .filter((_, index) => likedStatuses[index])
                            .map((author) => author.id)
                    );

                    setAuthors(authorsData);
                } else {
                    setAuthors(usersData);
                }
            } catch (error) {
                console.error("Error fetching authors:", error);
                setAuthors(placeholderData);
            }
        };

        const unsubscribe = subscribeToAuthors((updatedAuthors) => {
            const authorsData = updatedAuthors.map((user) => ({
                id: user.id,
                name: user.name || "익명 저자",
                image: user.profileImage || "/path/to/default-image.png",
                participationCount: user.participationCount || 0,
                startedWorks: user.startedWorks || 0,
                hearts: user.likes || 0,
            }));
            setAuthors(authorsData);
        });

        fetchAuthors();

        return () => unsubscribe();
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
                            <Link
                                to={{
                                    pathname: `/authors/${author.id}`,
                                }}
                                state={{
                                    name: author.name,
                                    todayParticipatedNovels: author.participationCount,
                                    todayStartedNovels: author.startedWorks,
                                    image: author.image,
                                }}
                            >
                                <button className="button">프로필 보기</button>
                            </Link>
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
