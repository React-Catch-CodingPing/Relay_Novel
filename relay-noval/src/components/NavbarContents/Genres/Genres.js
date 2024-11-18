// src/components/Genres.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNovels } from '../../../firebase/firestoreService'; // Firebase에서 소설 데이터를 가져오는 함수
import './Genres.css';

function Genres() {
    const [novels, setNovels] = useState([]);
    const [filteredNovels, setFilteredNovels] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortOption, setSortOption] = useState('조회순'); // 기본 정렬 옵션

    useEffect(() => {
        // 백엔드 API 연동 후 소설 데이터를 가져올 예정
        const placeholderData = [
            { id: 1, title: '소설 A', genre: '로맨스', progress: '24줄 진행 중', views: 120, likes: 50, recommendations: 30, image: '/path/to/image1.png' },
            { id: 2, title: '소설 B', genre: '미스터리', progress: '20줄 진행 중', views: 300, likes: 200, recommendations: 100, image: '/path/to/image2.png' },
            { id: 3, title: '소설 C', genre: '코믹', progress: '10줄 진행 중', views: 80, likes: 40, recommendations: 20, image: '/path/to/image3.png' },
            { id: 4, title: '소설 D', genre: '액션', progress: '15줄 진행 중', views: 150, likes: 70, recommendations: 50, image: '/path/to/image4.png' },
            { id: 5, title: '소설 E', genre: '스릴러', progress: '18줄 진행 중', views: 180, likes: 100, recommendations: 80, image: '/path/to/image5.png' },
            { id: 6, title: '소설 F', genre: '판타지', progress: '30줄 진행 중', views: 250, likes: 150, recommendations: 120, image: '/path/to/image6.png' },
            // 초기화 기본 데이터
        ];


        const fetchNovels = async () => {
            try {
                // Firebase에서 소설 데이터 가져오기
                const fetchedNovels = await getAllNovels();
                const processedNovels = fetchedNovels.map((novel) => ({
                    id: novel.id,
                    title: novel.title || "제목 없음",
                    genre: novel.genre || "장르 미정",
                    progress: `${novel.lineCount || 0}줄 진행 중`,
                    views: novel.views || 0,
                    likes: novel.likes || 0,
                    recommendations: novel.recommendations || 0,
                    image: novel.imageUrl || '/placeholder-image.png', // 기본 이미지
                }));

                setNovels(processedNovels); // 전체 데이터 저장
                setFilteredNovels(processedNovels); // 필터링 데이터 초기화
            } catch (error) {
                console.error("Error fetching novels:", error);
            }
        };

        // setNovels(placeholderData);
        // setFilteredNovels(placeholderData); // 초기 데이터 설정

        fetchNovels();

    }, []);

    // 장르 필터 토글 함수
    const toggleGenre = (genre) => {
        const isGenreSelected = selectedGenres.includes(genre);
        const newSelectedGenres = isGenreSelected
            ? selectedGenres.filter(g => g !== genre) // 선택 해제
            : [...selectedGenres, genre]; // 선택 추가

        setSelectedGenres(newSelectedGenres);

        // 필터링
        const updatedNovels = newSelectedGenres.length === 0
            ? novels
            : novels.filter(novel => newSelectedGenres.includes(novel.genre));

        setFilteredNovels(sortNovels(updatedNovels, sortOption));
    };

    // 정렬 함수
    const sortNovels = (novels, option) => {
        return [...novels].sort((a, b) => {
            if (option === '조회순') return b.views - a.views;
            if (option === '인기순') return b.likes - a.likes;
            if (option === '추천순') return b.recommendations - a.recommendations;
            return 0;
        });
    };

    // 정렬 옵션 변경 핸들러
    const handleSortChange = (option) => {
        setSortOption(option);
        setFilteredNovels(sortNovels(filteredNovels, option));
    };

    return (
        <div className="genres-container">
            <aside className="sidebar">
                <h2>추가된 필터</h2>
                <div className="filter-section">
                    <p>장르</p>
                    <div className="filter-tags">
                        {['로맨스', '미스터리', '코믹', '액션', '스릴러', '판타지'].map(genre => (
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
            <main className="main-content">
                <div className="header">
                    <h1>소설 모아보기 페이지</h1>
                    <div className="sort-options">
                        {['조회순', '인기순', '추천순'].map(option => (
                            <button
                                key={option}
                                className={`sort-button ${sortOption === option ? 'active' : ''}`}
                                onClick={() => handleSortChange(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="novels-grid">
                    {filteredNovels.map((novel) => (
                        <Link to={`/novels/${novel.id}`} key={novel.id} className="novel-card">
                            <img src={novel.image} alt={novel.title} className="novel-image" />
                            <div className="novel-info">
                                <h3>{novel.title}</h3>
                                <p>{novel.progress}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Genres;
