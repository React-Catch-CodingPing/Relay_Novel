import React, { useEffect, useState } from 'react';
import { getAuthors } from '../../../firebase/firestore/userService'; // 제공된 유틸리티 함수
import { getAllNovels } from '../../../firebase/firestore/novelService';
import './TodaysNovel.css';
import { useNavigate } from 'react-router-dom';
import {getLineCountForNovel} from "../../../firebase/firestore/lineService";


function TodaysNovel() {
    const [novels, setNovels] = useState([]);
    const [authors, setAuthors] = useState({}); // 사용자 데이터를 id 기반으로 매핑
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 모든 소설 데이터 가져오기
                const allNovels = await getAllNovels();

                // 모든 저자 데이터 가져오기
                const authorsArray = await getAuthors();
                const authorsMap = authorsArray.reduce((map, author) => {
                    console.log(`Mapping author: ${author.id} -> ${author.name || "익명 사용자"}`);
                    map[author.id] = author.name || "익명 사용자";
                    return map;
                }, {});

                // 각 소설의 줄 수를 계산
                const novelsWithLineCounts = await Promise.all(
                    allNovels.map(async (novel) => {
                        const lineCount = await getLineCountForNovel(novel.id); // 줄 수 가져오기
                        return {
                            ...novel,
                            lineCount, // 줄 수 추가
                        };
                    })
                );

                // 줄 수를 기준으로 정렬 및 상위 4개 선택
                const topNovels = novelsWithLineCounts
                    .sort((a, b) => b.lineCount - a.lineCount) // 내림차순 정렬
                    .slice(0, 4); // 상위 4개 선택

                setAuthors(authorsMap); // 저자 데이터 설정
                setNovels(topNovels); // 소설 데이터 설정
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleParticipateClick = (novelId) => {
        navigate(`/novels/${novelId}`); // NovelDetail 페이지로 이동
    };

    return (
        <section className="novels-section">
            <h2 className="novels-h2">오늘의 작품</h2>
            <h4> Top 3 </h4>
            <div className="novels-list">
                {novels.map((novel) => (
                    <div key={novel.id} className="novel-card">
                        {/* 왼쪽 이미지 */}
                        <img
                            src={novel.coverImage || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png'} // 기본 이미지 처리
                            alt={`${novel.title} 표지`}
                        />
                        {/* 오른쪽 텍스트 및 버튼 */}
                        <div className="novel-card-content">
                            <h3>{novel.title}</h3>
                            <h5>시작 첫 줄 : {novel.firstLine}</h5>
                            <p>{novel.genre}</p>
                            <p>저자: {authors[novel.userId] || "익명 사용자"}</p>
                            <p>{novel.lineCount}줄 째 진행 중...</p>
                            <button
                                className="participate-button"
                                onClick={() => handleParticipateClick(novel.id)}
                            >
                                참여하기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TodaysNovel;
