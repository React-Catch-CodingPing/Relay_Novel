// src/components/TodaysAuthors.js
import React, { useEffect, useState } from 'react';
import ProfileCard from '../ProfileCards/ProfileCard';
import {
    getUsers,
    getTodayStartedNovels,
    getTodayParticipatedNovels
} from "../../../firebase/firestore/userService";
import "./TodaysAuthors.css";


function TodaysAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchAuthorsData = async () => {
            try {
                // 모든 사용자 정보를 가져옴
                const users = await getUsers();

                // 각 사용자에 대해 오늘 참여한 소설 수와 오늘 시작한 소설 수 계산
                const authorsData = await Promise.all(
                    users.map(async (user) => {
                        const todayParticipatedNovels = await getTodayParticipatedNovels(user.id);
                        const todayStartedNovels = await getTodayStartedNovels(user.id);
                        return {
                            id: user.id,
                            name: user.nickname || user.name || "익명 저자",
                            todayParticipatedNovels: todayParticipatedNovels.length,
                            todayStartedNovels: todayStartedNovels.length,
                            image: user.profileImage || "/path/to/default.png",
                        };
                    })
                );

                // 총 활동 수를 기준으로 정렬 후 상위 3명 선택
                const topAuthors = authorsData
                    .sort((a, b) => b.totalCount - a.totalCount) // 내림차순 정렬
                    .slice(0, 3); // 상위 3명 선택

                setAuthors(topAuthors); // 상태 업데이트
            } catch (error) {
                console.error("Error fetching authors data:", error);
            }
        };

        fetchAuthorsData();
    }, []);

    // 기본 placeholder 데이터: authors가 비어있을 때 표시
    const placeholderData = [
        { id: 1, name: "부끄핑", novels: 13, image: "/path/to/bukkeuping.png" },
        { id: 2, name: "차나핑", novels: 10, image: "/path/to/chanaping.png" },
        { id: 3, name: "하츄핑", novels: 4, image: "/path/to/hachuping.png" },
        { id: 4, name: "깜비핑", novels: 7, image: "/path/to/kkambi.png" },
    ];

    return (
        <section className="authors-section">
            <h2>오늘의 저자</h2>
            <div className="authors-list">
                {(authors.length > 0 ? authors : placeholderData).map((author) => (
                    <ProfileCard
                        key={author.id}
                        name={author.name}
                        todayParticipatedNovels={author.todayParticipatedNovels}
                        todayStartedNovels={author.todayStartedNovels}
                        image={ author.image || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png' }
                        link={`/authors/${author.id}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default TodaysAuthors;
