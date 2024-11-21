// src/components/HallOfFame/HallOfFame.js
import React, { useEffect, useState } from 'react';
import { getUsers, getStartedNovels, getParticipatedNovels } from "../../../firebase/firestore/userService"; // userService의 함수 사용
import './HallOfFame.css';


function HallOfFame() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 명예의 전당 데이터를 가져오는 함수
    const fetchHallOfFameData = async () => {
        try {
            const usersData = await getUsers(); // 전체 사용자 데이터를 가져옴

            const usersWithStats = await Promise.all(usersData.map(async (user) => {
                // 각 사용자에 대해 참여한 소설과 시작한 소설 가져오기
                const participatedNovels = await getParticipatedNovels(user.id);
                const startedNovels = await getStartedNovels(user.id);

                // 사용자 통계 업데이트
                return {
                    id: user.id,
                    name: user.name,
                    profileImage: user.profileImage || "/path/to/default-image.png", // 기본 이미지
                    novelsParticipated: participatedNovels.length, // 전체 참여한 소설 수
                    novelsStarted: startedNovels.length, // 전체 시작한 소설 수
                };
            }));

            // 참여한 소설 수가 우선, 동점일 경우 시작한 소설 수 기준으로 정렬
            const sortedUsers = usersWithStats.sort((a, b) => {
                if (b.novelsParticipated === a.novelsParticipated) {
                    return b.novelsStarted - a.novelsStarted; // 시작한 소설 수로 정렬
                }
                return b.novelsParticipated - a.novelsParticipated; // 참여한 소설 수로 정렬
            });

            // 순위 부여
            const rankedUsers = sortedUsers.map((user, index) => ({
                ...user,
                rank: index + 1, // 1부터 시작하는 순위
            }));

            setUsers(rankedUsers.slice(0, 3)); // 상위 3명만 가져오기
        } catch (error) {
            console.error('Error fetching Hall of Fame data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHallOfFameData();
    }, []);

    if (loading) {
        return <p>명예의 전당 데이터를 불러오는 중입니다...</p>;
    }


    return (
        <section className="hall-of-fame-container">
            <h1>👑 명예의 전당 👑</h1>
            <p>가장 활발하게 활동한 사용자들을 만나보세요!</p>

            <div className="users-grid">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <img
                            src={user.profileImage}
                            alt={user.name || '익명 사용자'}
                            className="user-image"
                        />
                        <h3>{user.name || '익명 사용자'}</h3>
                        <p>참여 작품 수: {user.novelsParticipated}</p>
                        <p>시작한 작품 수: {user.novelsStarted}</p>
                        <p>🏅 순위: {user.rank}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HallOfFame;