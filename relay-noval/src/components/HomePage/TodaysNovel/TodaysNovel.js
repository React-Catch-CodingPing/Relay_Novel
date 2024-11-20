import React, { useEffect, useState } from 'react';
import { getAuthors } from '../../../firebase/firestore/userService'; // 제공된 유틸리티 함수
import { getAllNovels } from '../../../firebase/firestore/novelService'
import './TodaysNovel.css';
import {useNavigate} from "react-router-dom";


function TodaysNovel() {
    const [novels, setNovels] = useState([]);
    const [authors, setAuthors] = useState({}); // 사용자 데이터를 id 기반으로 매핑
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 모든 소설 데이터 가져오기
                const novels = await getAllNovels();

                // 모든 저자 데이터 가져오기
                const authorsArray = await getAuthors();
                const authorsMap = authorsArray.reduce((map, author) => {
                    console.log(`Mapping author: ${author.id} -> ${author.name || "익명 사용자"}`);
                    map[author.id] = author.name || "익명 사용자";
                    return map;
                }, {});

                console.log("Authors Map:", authorsMap); // 저자 매핑 디버깅

                setAuthors(authorsMap); // 저자 데이터 설정
                setNovels(novels); // 소설 데이터 설정
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
            <h2>오늘의 작품</h2>
            <div className="novels-list">
                {novels.map(novel => (
                    <div key={novel.id} className="novel-card">
                        <h3>{novel.title}</h3>
                        <h5>시작 첫 줄 : {novel.firstLine}</h5>
                        <p>{novel.genre}</p>
                        <p>저자: {authors[novel.userId] || "익명 사용자"}</p> {/* 저자 이름 출력 */}
                        {/* 참여하기 버튼 추가 */}
                        <button
                            className="participate-button"
                            onClick={() => handleParticipateClick(novel.id)} // 클릭 시 NovelDetail로 이동
                        >
                            참여하기
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TodaysNovel;
