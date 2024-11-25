// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import {
    getStartedNovels,
    getParticipatedNovels,
    getLikedAuthors,
    getLikedNovels,
} from '../../firebase/firestore/userService';
import { setUser } from '../../store/authSlice';
import './Profile.css';
import {uploadImage} from "../../firebase/firestore/storageService";


function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux에서 현재 사용자 정보 가져오기
    const user = useSelector((state) => state.auth.user);

    // 현재 프로필 정보를 위한 상태
    const [profile, setProfile] = useState(user);
    const [editProfile, setEditProfile] = useState(user); // 편집 모드에서 임시로 사용하는 상태
    const [editMode, setEditMode] = useState(false); // 편집 모드 상태

    // 모달 상태 관리
    const [showStartedNovelsModal, setShowStartedNovelsModal] = useState(false);
    const [showParticipatedNovelsModal, setShowParticipatedNovelsModal] = useState(false);
    const [showLikedAuthorsModal, setShowLikedAuthorsModal] = useState(false);
    const [showLikedNovelsModal, setShowLikedNovelsModal] = useState(false);

    // 소설 및 좋아요 데이터 상태
    const [startedNovels, setStartedNovels] = useState([]);
    const [participatedNovels, setParticipatedNovels] = useState([]);
    const [likedAuthors, setLikedAuthors] = useState([]);
    const [likedNovels, setLikedNovels] = useState([]);

    // 데이터 가져오는 useEffect 추가
    useEffect(() => {
        if (user) {
            fetchNovelData();
            fetchLikedData();
        }
    }, [user]);

    const fetchNovelData = async () => {
        try {
            const started = await getStartedNovels(auth.currentUser.uid); // 내가 시작한 소설 가져오기
            const participated = await getParticipatedNovels(auth.currentUser.uid); // 내가 참여한 소설 가져오기

            setStartedNovels(started); // 상태 업데이트
            setParticipatedNovels(participated); // 상태 업데이트
        } catch (error) {
            console.error('소설 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const fetchLikedData = async () => {
        try {
            const authors = await getLikedAuthors(auth.currentUser.uid); // 내가 좋아요한 작가 가져오기
            const novels = await getLikedNovels(auth.currentUser.uid); // 내가 좋아요한 소설 가져오기

            setLikedAuthors(authors);
            setLikedNovels(novels);
        } catch (error) {
            console.error('좋아요 데이터를 가져오는 중 오류 발생:', error);
        }
    };


    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout');
    };

    // 프로필 편집 모드 시작
    const handleEdit = () => {
        setEditProfile(profile); // 현재 프로필 값을 임시 상태에 저장
        setEditMode(true);
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageUrl = await uploadImage(file, "profilePictures");
                setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));
            } catch (error) {
                console.error("Error uploading profile image:", error);
                alert("이미지 업로드에 실패했습니다.");
            }
        }
    };

    // 변경 사항 저장 후 Firebase에 업데이트
    const handleSave = async () => {
        try {
            // Firebase Firestore에 사용자 프로필 업데이트
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                profileImage: editProfile.profileImage || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png',
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

    // 모달 닫기 함수 추가
    const closeModal = () => {
        setShowStartedNovelsModal(false);
        setShowParticipatedNovelsModal(false);
    };

    // 소설 페이지로 이동하는 함수 추가
    const goToNovelDetail = (novelId) => {
        navigate(`/novels/${novelId}`);
    };

    // 작가 프로필 페이지로 이동하는 함수
    const goToAuthorProfile = (authorId) => {
        navigate(`/authors/${authorId}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                {/* 프로필 이미지 */}
                {editMode ? (
                    <div>
                        {editProfile.profileImage && (
                            <img
                                src={editProfile.profileImage}
                                alt="Profile Preview"
                                className="profile-image-preview"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange} // 파일 변경 핸들러
                            className="profile-input-file"
                        />
                    </div>
                ) : (
                    <img
                        src={profile.profileImage || 'images/home-icon.png'}
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
                            {/* 참여한 소설 모달 버튼 */}
                            <button
                                className="modal-button"
                                onClick={() => setShowParticipatedNovelsModal(true)}
                            >
                                {participatedNovels.length} 줄 참여 중...
                            </button>
                            {/* 시작한 소설 모달 버튼 */}
                            <button
                                className="modal-button"
                                onClick={() => setShowStartedNovelsModal(true)}
                            >
                                {startedNovels.length} 작품 시작...
                            </button>
                        </div>
                    </div>
                </div>


                {/* 좋아요 모달 버튼 */}
                <div className="profile-buttons">
                    <button className="modal-button" onClick={() => setShowLikedAuthorsModal(true)}>
                        좋아요한 작가 보기
                    </button>
                    <button className="modal-button" onClick={() => setShowLikedNovelsModal(true)}>
                        좋아요한 작품 보기
                    </button>
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

            {/* 좋아요한 작가 모달 */}
            {showLikedAuthorsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>좋아요한 작가</h3>
                        <button onClick={() => setShowLikedAuthorsModal(false)} className="close-modal">
                            닫기
                        </button>
                        <ul>
                            {likedAuthors.map((author) => (
                                <li
                                    key={author.id}
                                    onClick={() => goToAuthorProfile(author.id)}
                                    className="modal-novel-item"
                                >
                                    <strong>{author.name}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}


            {/* 좋아요한 작품 모달 */}
            {showLikedNovelsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>좋아요한 작품</h3>
                        <button onClick={() => setShowLikedNovelsModal(false)} className="close-modal">
                            닫기
                        </button>
                        <ul>
                            {likedNovels.map((novel) => (
                                <li
                                    key={novel.id}
                                    onClick={() => goToNovelDetail(novel.id)}
                                    className="modal-novel-item"
                                >
                                    <strong>{novel.title}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 참여한 소설 모달 */}
            {showParticipatedNovelsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>내가 참여한 소설</h3>
                        <button onClick={closeModal} className="close-modal">
                            닫기
                        </button>
                        <ul>
                            {participatedNovels.map((novel) => (
                                <li
                                    key={novel.id}
                                    onClick={() => goToNovelDetail(novel.id)} // NovelDetail 페이지로 이동
                                    className="modal-novel-item"
                                >
                                    <strong>{novel.title}</strong>
                                    <p>장르: {novel.genre}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 시작한 소설 모달 */}
            {showStartedNovelsModal && (
                <div className="modal">
                <div className="modal-content">
                        <h3>내가 시작한 소설</h3>
                        <button onClick={closeModal} className="close-modal">
                            닫기
                        </button>
                        <ul>
                            {startedNovels.map((novel) => (
                                <li
                                    key={novel.id}
                                    onClick={() => goToNovelDetail(novel.id)} // NovelDetail 페이지로 이동
                                    className="modal-novel-item"
                                >
                                    <strong>{novel.title}</strong>
                                    <p>장르: {novel.genre}</p>
                                    <p>첫 줄: {novel.firstLine}</p>
                                </li>
                            ))}
                        </ul>
                </div>
                </div>
            )}
        </div>
    );
}

export default Profile;