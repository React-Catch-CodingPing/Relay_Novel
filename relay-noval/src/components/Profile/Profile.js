// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile/Profile.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import { setUser } from '../../store/authSlice'; // Redux의 setUser 액션을 사용하여 상태 업데이트
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux에서 현재 사용자 정보 가져오기
    const user = useSelector((state) => state.auth.user);

    // 현재 프로필 정보를 위한 상태
    const [profile, setProfile] = useState(user);
    const [editProfile, setEditProfile] = useState(user); // 편집 모드에서 임시로 사용하는 상태
    const [editMode, setEditMode] = useState(false); // 편집 모드 상태

    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout');
    };

    // 프로필 편집 모드 시작
    const handleEdit = () => {
        setEditProfile(profile); // 현재 프로필 값을 임시 상태에 저장
        setEditMode(true);
    };

    // 변경 사항 저장 후 Firebase에 업데이트
    const handleSave = async () => {
        try {
            // Firebase Firestore에 사용자 프로필 업데이트
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                profileImage: editProfile.profileImage,
                nickname: editProfile.nickname,
                name: editProfile.name,
                email: editProfile.email,
            });

            // 상태 업데이트 및 Redux에 반영
            setProfile(editProfile); // 임시 상태의 값을 실제 프로필 상태에 저장
            dispatch(setUser(editProfile)); // Redux 상태에 저장하여 전체 앱에서 업데이트
            setEditMode(false); // 편집 모드 종료

        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 편집 취소 시 임시 상태를 초기화하고 편집 모드 종료
    const handleCancel = () => {
        setEditProfile(profile); // 임시 상태를 원래 프로필 값으로 되돌림
        setEditMode(false); // 편집 모드 종료
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