// src/components/HallOfFame/HallOfFame.js
import React, { useEffect, useState } from 'react';
import { getUsers, getStartedNovels, getParticipatedNovels } from "../../../firebase/firestore/userService"; // userService의 함수 사용
import './HallOfFame.css';


function HallOfFame() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHallOfFameData = async () => {
        try {
            const usersData = await getUsers();

            const usersWithStats = await Promise.all(usersData.map(async (user) => {
                const participatedNovels = await getParticipatedNovels(user.id);
                const startedNovels = await getStartedNovels(user.id);

                return {
                    id: user.id,
                    name: user.name,
                    profileImage: user.profileImage || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png', // 핑크 테마 기본 이미지
                    novelsParticipated: participatedNovels.length,
                    novelsStarted: startedNovels.length,
                };
            }));

            const sortedUsers = usersWithStats.sort((a, b) => {
                if (b.novelsParticipated === a.novelsParticipated) {
                    return b.novelsStarted - a.novelsStarted;
                }
                return b.novelsParticipated - a.novelsParticipated;
            });

            const rankedUsers = sortedUsers.map((user, index) => ({
                ...user,
                rank: index + 1,
            }));

            setUsers(rankedUsers.slice(0, 3)); // 상위 3명
        } catch (error) {
            console.error("Error fetching Hall of Fame data:", error);
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
                        <p>🏅 순위: {user.rank}</p>
                        <p>참여 작품 수: {user.novelsParticipated}</p>
                        <p>시작한 작품 수: {user.novelsStarted}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HallOfFame;