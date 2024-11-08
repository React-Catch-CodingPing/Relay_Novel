// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    // 편집 모드 상태
    const [editMode, setEditMode] = useState(false);

    // 각 필드의 상태
    const [profileImage, setProfileImage] = useState(''); // 프로필 사진 URL
    const [nickname, setNickname] = useState('에몽가'); // 닉네임 초기값
    const [name, setName] = useState('포켓몬'); // 이름 초기값
    const [email, setEmail] = useState('12345@hansung.ac.kr'); // 이메일 초기값

    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout');
    };

    // 편집 모드로 전환하는 함수
    const handleEdit = () => {
        setEditMode(true);
    };

    // 변경 사항 저장 후 편집 모드 종료
    const handleSave = () => {
        setEditMode(false);
        // 여기에서 서버나 데이터베이스로 저장하는 로직 추가 가능
    };

    // 편집 취소 후 원래 상태로 돌아가기
    const handleCancel = () => {
        setEditMode(false);
        // 취소 시 초기 상태로 되돌리려면 추가 로직 필요
    };

    return (
        <div className="profile-container">
            <div className="profile-card">

                {/* 프로필 이미지 */}
                {editMode ? (
                    <input
                        type="text"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="프로필 이미지 URL을 입력하세요"
                        className="profile-input"
                    />
                ) : (
                    <img
                        src={profileImage || 'https://example.com/default-image.jpg'}
                        alt="Profile"
                        className="profile-image"
                    />
                )}

                {/* 프로필 정보 */}
                <div className="profile-info">

                    {/* 닉네임 */}
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        {editMode ? (
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{nickname}</span>
                        )}
                    </div>

                    {/* 이름 */}
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        {editMode ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{name}</span>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        {editMode ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{email}</span>
                        )}
                    </div>

                    {/* 집필 현황 (편집 불가) */}
                    <div className="profile-field">
                        <span className="profile-label">집필 현황</span>
                        <div className="profile-value">
                            <div>26 줄 참여 중...</div>
                            <div>3 작품 시작...</div>
                        </div>
                    </div>
                </div>

                {/* 하단의 버튼들 (편집 모드에 따라 다르게 표시) */}
                <div className="profile-buttons">
                    {editMode ? (
                        <>
                            <button className="save-button" onClick={handleSave}>저장</button>
                            <button className="cancel-button" onClick={handleCancel}>취소</button>
                        </>
                    ) : (
                        <>
                            <button className="edit-button" onClick={handleEdit}>프로필 편집</button>
                            <button className="logout-button" onClick={goToSignOut}>로그아웃</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;