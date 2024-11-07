// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // CSS 파일을 통해 디자인 스타일을 적용합니다.

function Profile() {
    const navigate = useNavigate();

    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout'); // "/signout" 경로로 이동
    };

    return (
        <div className="profile-container">
            {/* 프로필 카드 전체를 감싸는 컨테이너 */}
            <div className="profile-card">

                {/* 프로필 이미지 */}
                <img
                    src="" // 실제 이미지 URL로 변경해주세요.
                    alt="Profile"
                    className="profile-image"
                />

                {/* 프로필 정보 */}
                <div className="profile-info">

                    {/* 닉네임 */}
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        <span className="profile-value">에몽가</span>
                    </div>

                    {/* 이름 */}
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        <span className="profile-value">포켓몬</span>
                    </div>

                    {/* 이메일 */}
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        <span className="profile-value">12345@hansung.ac.kr</span>
                    </div>

                    {/* 집필 현황 */}
                    <div className="profile-field">
                        <span className="profile-label">집필 현황</span>
                        <div className="profile-value">
                            <div>26 줄 참여 중...</div>
                            <div>3 작품 시작...</div>
                        </div>
                    </div>
                </div>

                {/* 하단의 프로필 편집 및 로그아웃 버튼 */}
                <div className="profile-buttons">
                    <button className="edit-button">프로필 편집</button>
                    {/* 로그아웃 버튼 클릭 시 goToSignOut 함수 실행 */}
                    <button className="logout-button" onClick={goToSignOut}>
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
