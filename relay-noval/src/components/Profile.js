// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    // 초기 프로필 정보 상태 (기존 값)
    const initialProfile = {
        profileImage: '',
        nickname: '에몽가',
        name: '포켓몬',
        email: '12345@hansung.ac.kr',
    };

    // 현재 프로필 정보를 위한 상태
    const [profile, setProfile] = useState(initialProfile);

    // 편집 모드에서 임시로 값을 저장하는 상태
    const [editProfile, setEditProfile] = useState(initialProfile);

    // 편집 모드 상태
    const [editMode, setEditMode] = useState(false);

    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout');
    };

    // 편집 모드 시작 시 기존 값을 임시 상태에 복사
    const handleEdit = () => {
        setEditProfile(profile); // 현재 값을 임시 상태에 저장
        setEditMode(true);
    };

    // 변경 사항 저장 후 편집 모드 종료
    const handleSave = () => {
        setProfile(editProfile); // 임시 상태의 값을 실제 상태에 저장
        setEditMode(false);
    };

    // 편집 취소 시 임시 상태를 초기화하고 편집 모드 종료
    const handleCancel = () => {
        setEditProfile(profile); // 임시 상태를 원래 값으로 되돌림
        setEditMode(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">

                {/* 프로필 이미지 */}
                {editMode ? (
                    <input
                        type="text"
                        value={editProfile.profileImage}
                        onChange={(e) => setEditProfile({ ...editProfile, profileImage: e.target.value })}
                        placeholder="프로필 이미지 URL을 입력하세요"
                        className="profile-input"
                    />
                ) : (
                    <img
                        src={profile.profileImage || 'https://example.com/default-image.jpg'}
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
                                value={editProfile.nickname}
                                onChange={(e) => setEditProfile({ ...editProfile, nickname: e.target.value })}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{profile.nickname}</span>
                        )}
                    </div>

                    {/* 이름 */}
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        {editMode ? (
                            <input
                                type="text"
                                value={editProfile.name}
                                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{profile.name}</span>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        {editMode ? (
                            <input
                                type="email"
                                value={editProfile.email}
                                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{profile.email}</span>
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