import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNovels } from '../../../firebase/firestoreService'; // Firebase에서 소설 데이터를 가져오는 함수
import './Genres.css';

function Genres() {
    const [novels, setNovels] = useState([]);
    const [filteredNovels, setFilteredNovels] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortOption, setSortOption] = useState(null);
    const [likedNovels, setLikedNovels] = useState(new Set());
    const [recommendedNovels, setRecommendedNovels] = useState(new Set());

    useEffect(() => {
        const fetchNovels = async () => {
            try {
                const savedNovels = localStorage.getItem('novels');
                if (savedNovels) {
                    const parsedNovels = JSON.parse(savedNovels);
                    setNovels(parsedNovels);
                    setFilteredNovels(parsedNovels);
                } else {
                    const fetchedNovels = await getAllNovels();
                    const processedNovels = fetchedNovels.map((novel) => ({
                        id: novel.id,
                        title: novel.title || "제목 없음",
                        genre: novel.genre || "장르 미정",
                        progress: `${novel.lineCount || 0}줄 진행 중`,
                        views: novel.views || 0,
                        likes: novel.likes || 0,
                        recommendations: novel.recommendations || 0,
                        image: novel.imageUrl || '/placeholder-image.png',
                    }));
                    setNovels(processedNovels);
                    setFilteredNovels(processedNovels);
                    localStorage.setItem('novels', JSON.stringify(processedNovels));
                }
            } catch (error) {
                console.error("Error fetching novels:", error);
            }
        };

        fetchNovels();
    }, []);

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
        const sortedNovels = sortNovels(novels, option); // 정렬된 데이터 가져오기
        setFilteredNovels(sortedNovels); // 상태에 반영
    };


    const handleHeartClick = (event, novelId) => {
        event.stopPropagation();
        setLikedNovels((prevLikedNovels) => {
            const updatedLikedNovels = new Set(prevLikedNovels);
            updatedLikedNovels.has(novelId)
                ? updatedLikedNovels.delete(novelId)
                : updatedLikedNovels.add(novelId);
            return updatedLikedNovels;
        });
    };

    const handleThumbsUpClick = (event, novelId) => {
        event.stopPropagation();
        setRecommendedNovels((prevRecommendedNovels) => {
            const updatedRecommendedNovels = new Set(prevRecommendedNovels);
            updatedRecommendedNovels.has(novelId)
                ? updatedRecommendedNovels.delete(novelId)
                : updatedRecommendedNovels.add(novelId);
            return updatedRecommendedNovels;
        });
    };

    const handleViewCount = (event, novelId) => {
        event.preventDefault();
        setNovels((prevNovels) => {
            const updatedNovels = prevNovels.map((novel) =>
                novel.id === novelId ? {...novel, views: novel.views + 1} : novel
            );
            localStorage.setItem('novels', JSON.stringify(updatedNovels));
            return updatedNovels;
        });

        setFilteredNovels((prevFilteredNovels) =>
            prevFilteredNovels.map((novel) =>
                novel.id === novelId ? {...novel, views: novel.views + 1} : novel
            )
        );

        window.location.href = `/novels/${novelId}`;
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
                    {filteredNovels.map((novel) => (
                        <div key={novel.id} className="genres-novel-card">
                            {/* 조회수  */}
                            <div className="view-count">조회수: {novel.views}</div>

                            {/* 소설 이미지와 정보 */}
                            <Link
                                to={`/novels/${novel.id}`}
                                className="novel-link"
                                onClick={(event) => handleViewCount(event, novel.id)}
                            >
                                <img src={novel.image} alt={novel.title} className="novel-image"/>
                                <div className="novel-info">
                                    <h3>{novel.title}</h3>
                                    <p>{novel.progress}</p>
                                </div>
                            </Link>

                            {/* 참여하기, 하트, 따봉 버튼 */}
                            <div className="genres-actions-container">
                                {/* 참여하기 버튼 */}
                                <button className="genres-participate-button">참여하기</button>

                                {/* 하트 버튼 */}
                                <div>
                                    <button
                                        className="genres-heart-button"
                                        onClick={(event) => handleHeartClick(event, novel.id)}
                                    >
                                        {likedNovels.has(novel.id) ? '❤️' : '🤍'}
                                    </button>
                                    <span className="count">{likedNovels.has(novel.id) ? 1 : 0}</span>
                                </div>

                                {/* 따봉 버튼 */}
                                <div>
                                    <button
                                        className="genres-thumbs-up-button"
                                        onClick={(event) => handleThumbsUpClick(event, novel.id)}
                                    >
                                        {recommendedNovels.has(novel.id) ? '👍' : '👍'}
                                    </button>
                                    <span className="count">{recommendedNovels.has(novel.id) ? 1 : 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

    export default Genres;
