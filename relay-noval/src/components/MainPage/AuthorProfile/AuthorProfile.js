// src/components/MainPage/AuthorProfile/AuthorProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AuthorProfile.css';

function AuthorProfile() {
    // URL에서 author의 id를 가져옵니다.
    const { id } = useParams();

    // 저자 정보를 상태로 관리합니다.
    const [author, setAuthor] = useState(null);

    /*
    // 컴포넌트가 처음 렌더링될 때 저자 정보를 불러옵니다.
    useEffect(() => {
        console.log("Fetching author with ID:", id);
        axios.get(`/api/authors/${id}`) // 해당 ID의 저자 정보를 가져오는 API 요청
            .then(response => setAuthor(response.data))
            .catch(error => console.error("Error fetching author data:", error));
    }, [id]);
    */


    useEffect(() => {
        // 임시 데이터 설정
        setAuthor({
            name: "에몽가",
            email: "12345@hansung.ac.kr",
            novelsParticipated: 26,
            novelsStarted: 3,
            image: "/path/to/default-image.jpg"
        });
    }, []);


    // author가 로드되지 않았다면 로딩 상태를 표시합니다.
    if (!author) return <p>Loading...</p>;

    return (
        <div className="author-profile-container">
            <div className="author-profile-card">
                {/* 저자의 프로필 이미지 */}
                <img src={author.image || '/path/to/default-image.jpg'} alt={author.name} className="author-profile-image" />

                {/* 저자 정보 표시 */}
                <div className="author-profile-info">
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        <span className="profile-value">{author.name}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        <span className="profile-value">{author.email}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">집필 현황</span>
                        <div className="profile-value">
                            <div>{author.novelsParticipated} 줄 참여 중...</div>
                            <div>{author.novelsStarted} 작품 시작...</div>
                        </div>
                    </div>
                </div>

                {/* 친구 추가 버튼 */}
                <button className="add-friend-button">친구추가</button>
            </div>
        </div>
    );
}

export default AuthorProfile;