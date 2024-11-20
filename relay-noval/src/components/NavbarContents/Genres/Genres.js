import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    incrementNovelViews,
    toggleNovelLike,
    toggleNovelRecommendation,
    } from '../../../firebase/firestore/novelService'; // Firebase에서 소설 데이터를 가져오는 함수
import { subscribeToNovels } from '../../../firebase/firestore/realTimeService';
import './Genres.css';

function Genres() {
    const [novels, setNovels] = useState([]);
    const [filteredNovels, setFilteredNovels] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortOption, setSortOption] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const itemsPerPage = 4; // 한 페이지에 표시할 항목 수
    const pagesPerGroup = 4; // 한 그룹에 표시할 페이지 수

    // 실시간 Firestore 데이터 구독
    useEffect(() => {
        const unsubscribe = subscribeToNovels((updatedNovels) => {
            setNovels(updatedNovels);
            setFilteredNovels(sortNovels(updatedNovels, sortOption)); // 필터 및 정렬 반영
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, [sortOption]);

    // 장르 토글 기능
    const toggleGenre = (genre) => {
        const newSelectedGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter((g) => g !== genre)
            : [...selectedGenres, genre];

        setSelectedGenres(newSelectedGenres);

        const updatedNovels = newSelectedGenres.length === 0
            ? novels
            : novels.filter((novel) => newSelectedGenres.includes(novel.genre));

        setFilteredNovels(sortNovels(updatedNovels, sortOption));
    };

    // 소설 정렬 함수
    const sortNovels = (novels, option) => {
        if (!option) return novels;
        return [...novels].sort((a, b) => {
            if (option === '조회순') return b.views - a.views;
            if (option === '인기순') return b.likes - a.likes;
            if (option === '추천순') return b.recommendations - a.recommendations;
            return 0;
        });
    };

    const handleSortChange = (option) => {
        setSortOption(option); // 정렬 옵션 상태 업데이트
        const sortedNovels = sortNovels(filteredNovels, option); //  정렬된 데이터 가져오기
        setFilteredNovels(sortedNovels); //  상태에 반영
    };

    // 좋아요 핸들러
    const handleHeartClick = async (event, novelId) => {
        event.stopPropagation();

        const novel = novels.find((n) => n.id === novelId);
        const isLiked = novel.likedBy?.includes("currentUserId"); // 실제 사용자 ID 필요

        try {
            await toggleNovelLike(novelId, "currentUserId", isLiked); // Firestore에 좋아요 토글
            setNovels((prevNovels) =>
                prevNovels.map((n) =>
                    n.id === novelId
                        ? {
                            ...n,
                            likes: isLiked ? n.likes - 1 : n.likes + 1,
                            likedBy: isLiked
                                ? n.likedBy.filter((id) => id !== "currentUserId")
                                : [...(n.likedBy || []), "currentUserId"],
                        }
                        : n
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // 추천 클릭 핸들러
    const handleThumbsUpClick = async (event, novelId) => {
        event.stopPropagation();

        const novel = novels.find((n) => n.id === novelId);
        const isRecommended = novel.recommendedBy?.includes("currentUserId"); // 실제 사용자 ID 필요

        try {
            await toggleNovelRecommendation(novelId, "currentUserId", isRecommended); // Firestore에 추천 토글
            setNovels((prevNovels) =>
                prevNovels.map((n) =>
                    n.id === novelId
                        ? {
                            ...n,
                            recommendations: isRecommended ? n.recommendations - 1 : n.recommendations + 1,
                            recommendedBy: isRecommended
                                ? n.recommendedBy.filter((id) => id !== "currentUserId")
                                : [...(n.recommendedBy || []), "currentUserId"],
                        }
                        : n
                )
            );
        } catch (error) {
            console.error("Error toggling recommendation:", error);
        }
    };

    // 조회수 증가 핸들러
    const handleViewCount = async (event, novelId) => {
        event.preventDefault();

        try {
            await incrementNovelViews(novelId); // Firestore에 조회수 증가
            setNovels((prevNovels) =>
                prevNovels.map((n) =>
                    n.id === novelId ? { ...n, views: n.views + 1 } : n
                )
            );
        } catch (error) {
            console.error("Error incrementing view count:", error);
        }

        window.location.href = `/novels/${novelId}`; // 소설 상세 페이지로 이동
    };

    // 페이지네이션 관련 변수
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNovels.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNovels.length / itemsPerPage);
    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
    const startPage = (currentGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextGroup = () => {
        if (endPage < totalPages) {
            setCurrentPage(endPage + 1);
        }
    };

    const handlePreviousGroup = () => {
        if (startPage > 1) {
            setCurrentPage(startPage - pagesPerGroup);
        }
    };

    return (
        <div className="genres-container">
            <aside className="sidebar">
                <h2>추가된 필터</h2>
                <div className="filter-section">
                    <p>장르</p>
                    <div className="filter-tags">
                        {['로맨스', '미스터리', '코믹', '액션', '스릴러', '판타지'].map((genre) => (
                            <span
                                key={genre}
                                className={`tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                                onClick={() => toggleGenre(genre)}
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>
            <main className="genres-main-content">
                <div className="genres-header">
                    <h1>소설 모아보기 페이지</h1>
                    <div className="genres-sort-options">
                        {['조회순', '인기순', '추천순'].map((option) => (
                            <button
                                key={option}
                                className={`genres-sort-button ${sortOption === option ? 'active' : ''}`}
                                onClick={() => handleSortChange(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="genres-novels-grid">
                    {currentItems.map((novel) => (
                        <div key={novel.id} className="genres-novel-card">
                            <div className="view-count">조회수: {novel.views}</div>
                            <Link
                                to={`/novels/${novel.id}`}
                                className="novel-link"
                                onClick={(event) => handleViewCount(event, novel.id)}
                            >
                                <img src={novel.image} alt={novel.title} className="novel-image" />
                                <div className="novel-info">
                                    <h3>{novel.title}</h3>
                                    <p>{novel.lineCount}</p>
                                </div>
                            </Link>
                            <div className="genres-actions-container">
                                <button className="genres-participate-button">참여하기</button>
                                <div>
                                    <button
                                        className="genres-heart-button"
                                        onClick={(event) => handleHeartClick(event, novel.id)}
                                    >
                                        {novel.likedBy?.includes("currentUserId") ? '❤️' : '🤍'}
                                    </button>
                                    <span className="count">{novel.likes}</span>
                                </div>
                                <div>
                                    <button
                                        className="genres-thumbs-up-button"
                                        onClick={(event) => handleThumbsUpClick(event, novel.id)}
                                    >
                                        {novel.recommendedBy?.includes("currentUserId") ? '👍' : '👎'}
                                    </button>
                                    <span className="count">{novel.recommendations}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* 페이지네이션 */}
                <div className="genres-pagination">
                    {startPage > 1 && (
                        <button onClick={handlePreviousGroup} className="genres-pagination-button">
                            이전
                        </button>
                    )}
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className={`genres-pagination-button ${number === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <button onClick={handleNextGroup} className="genres-pagination-button">
                            다음
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Genres;
