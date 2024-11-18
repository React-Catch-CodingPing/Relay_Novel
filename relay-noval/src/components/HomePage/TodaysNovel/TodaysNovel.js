import React, { useEffect, useState } from 'react';
import { getAllNovels, getAuthors } from '../../../firebase/firestoreService'; // 제공된 유틸리티 함수
import './TodaysNovel.css';


function TodaysNovel() {
    const [works, setWorks] = useState([]);
    const [authors, setAuthors] = useState({}); // 사용자 데이터를 id 기반으로 매핑

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
                setWorks(novels); // 소설 데이터 설정
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="works-section">
            <h2>오늘의 작품</h2>
            <div className="works-list">
                {works.map(work => (
                    <div key={work.id} className="work-card">
                        <h3>{work.title}</h3>
                        <h5>시작 첫 줄 : {work.firstLine}</h5>
                        <p>{work.genre}</p>
                        <p>저자: {authors[work.userId] || "익명 사용자"}</p> {/* 저자 이름 출력 */}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TodaysNovel;
