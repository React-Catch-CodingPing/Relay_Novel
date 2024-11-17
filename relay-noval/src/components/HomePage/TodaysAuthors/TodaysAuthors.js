// src/components/TodaysAuthors.js
import React, { useEffect, useState } from 'react';
import ProfileCard from '../ProfileCards/ProfileCard';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import "./TodaysAuthors.css";


function TodaysAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                // Firestore의 'users' 컬렉션 데이터를 비동기로 가져옴
                const querySnapshot = await getDocs(collection(firestore, "users"));
                const authorsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAuthors(authorsData); // 가져온 데이터를 상태에 저장
            } catch (error) {
                console.error("Error fetching authors:", error); // 에러 로그 추가
            }
        };

        fetchAuthors();
    }, []);

    // 기본 placeholder 데이터: authors가 비어있을 때 표시
    const placeholderData = [
        { id: 1, name: "부끄핑", novels: 13, image: "/path/to/bukkeuping.png" },
        { id: 2, name: "차나핑", novels: 10, image: "/path/to/chanaping.png" },
        { id: 3, name: "하츄핑", novels: 4, image: "/path/to/hachuping.png" },
    ];

    return (
        <section className="authors-section">
            <h2>오늘의 저자</h2>
            <div className="authors-list">
                {(authors.length > 0 ? authors : placeholderData).map(author => (
                    <ProfileCard
                        key={author.id} // 고유 ID 사용
                        name={author.name || "익명 저자"} // 이름이 없을 경우 기본값 제공
                        novels={author.novels || 0} // 소설 수가 없을 경우 기본값 제공
                        image={author.image || "/path/to/default.png"} // 이미지 없을 경우 기본 이미지 사용
                        link={`/authors/${author.id}`} // 프로필 링크
                    />
                ))}
            </div>
        </section>
    );
}

export default TodaysAuthors;
