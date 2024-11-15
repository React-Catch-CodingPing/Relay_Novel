// src/components/HallOfFame/HallOfFame.js
import React, { useEffect, useState } from 'react';
import './HallOfFame.css';
import axios from 'axios';

function HallOfFame() {
    // 명예의 전당 사용자 목록 상태 관리
    const [users, setUsers] = useState([]);

    // 임시 데이터 (API 오류 시 표시)
    const placeholderData = [
        { id: 1, name: '에몽가', novelsParticipated: 26, novelsStarted: 3, profileImage: '/path/to/emonga.png' },
        { id: 2, name: '부끄핑', novelsParticipated: 15, novelsStarted: 5, profileImage: '/path/to/bukkeuping.png' },
        { id: 3, name: '하츄핑', novelsParticipated: 12, novelsStarted: 4, profileImage: '/path/to/hachuping.png' },
    ];

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        axios.get('/api/hall-of-fame') // API에서 명예의 전당 사용자 데이터 가져오기
            .then(response => setUsers(response.data))
            .catch(error => {
                console.error("Error fetching Hall of Fame data:", error);
                // 오류 발생 시 임시 데이터 사용
                setUsers(placeholderData);
            });
    }, []);

    return (
        <section className="hall-of-fame-container">
            <h1>👑 명예의 전당 👑</h1>
            <p>가장 활발하게 활동한 사용자들을 만나보세요!</p>

            <div className="users-grid">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <img src={user.profileImage} alt={user.name} className="user-image" />
                        <h3>{user.name}</h3>
                        <p>참여 작품 수: {user.novelsParticipated}</p>
                        <p>시작한 작품 수: {user.novelsStarted}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HallOfFame;