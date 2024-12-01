

// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {doc, getDoc, onSnapshot, updateDoc} from 'firebase/firestore';
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
import {subscribeToAuthor} from "../../firebase/firestore/realTimeService";

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux에서 현재 사용자 정보 가져오기
    const user = useSelector((state) => state.auth.user);

    // 현재 프로필 정보를 위한 상태
    const [profile, setProfile] = useState( {});
    const [editProfile, setEditProfile] = useState({}); // 편집 모드에서 임시로 사용하는 상태
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
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) return;

        // 현재 사용자 ID로 실시간 구독
        const unsubscribe = subscribeToAuthor(auth.currentUser.uid, (authorData) => {
            setUserData(authorData);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, []);



    // 데이터 가져오는 useEffect 추가
    useEffect(() => {

        const fetchUserProfile = async () => {
            if (!auth.currentUser) return;

            try {
                const userRef = doc(firestore, 'users', auth.currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setProfile(userData);
                    // setEditProfile(userData); // 편집 상태 초기화
                    dispatch(setUser(userData)); // Redux 상태 업데이트
                }
            } catch (error) {
                console.error("사용자 데이터 불러오기 실패:", error);
            }
        };

        fetchUserProfile();

        if (user) {
            fetchNovelData();
            fetchLikedData();
        }

    }, [user]);

    // 프로필 이미지 기본값 처리 함수 추가
    const getProfileImage = () =>
        profile.profileImage ||
        'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png';


    const fetchNovelData = async () => {
        try {
            const started = await getStartedNovels(auth.currentUser?.uid); // 내가 시작한 소설 가져오기
            const participated = await getParticipatedNovels(auth.currentUser?.uid); // 내가 참여한 소설 가져오기

            setStartedNovels(started || []); // 상태 업데이트
            setParticipatedNovels(participated || []); // 상태 업데이트
        } catch (error) {
            console.error('소설 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const fetchLikedData = async () => {
        try {
            const authors = await getLikedAuthors(auth.currentUser.uid);
            const novels = await getLikedNovels(auth.currentUser.uid);

            setLikedAuthors(authors || []);
            setLikedNovels(novels || []);
        } catch (error) {
            console.error('좋아요 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 로그아웃 페이지로 이동하는 함수
    const goToSignOut = () => {
        navigate('/signout');
    };

    const handleEdit = () => {
        setEditProfile({ ...profile }); // 상태 초기화 시 명확히 복사
        setEditMode(true);
    };


    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // 이미지를 Storage에 업로드
                const imageUrl = await uploadImage(file, "profilePictures");

                // 업로드 성공 시, editProfile에 업데이트
                setEditProfile((prev) => ({ ...prev, profileImage: imageUrl }));

                // 업로드 성공 시, 즉시 미리보기로 반영
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    document.querySelector(".profile-image-preview").src = fileReader.result; // 미리보기 업데이트
                };
                fileReader.readAsDataURL(file);
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
            const userRef = doc(firestore, 'users', auth.currentUser?.uid);
          
            await updateDoc(userRef, {
                profileImage: editProfile.profileImage || profile.profileImage || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png',
                nickname: editProfile.nickname || profile.nickname || "익명 사용자",
                name: editProfile.name || profile.name || "",
            });

            setProfile(editProfile);
            dispatch(setUser(editProfile));
            setEditMode(false);
        } catch (error) {
            console.error("프로필 업데이트 실패:", error);
            alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 편집 취소 시 임시 상태를 초기화하고 편집 모드 종료
    const handleCancel = () => {
        setEditProfile(profile);
        setEditMode(false);
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
                        <img
                            src={editProfile.profileImage || 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png'}
                            alt="Profile Preview"
                            className="profile-image-preview"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange} // 파일 변경 핸들러
                            className="profile-input-file"
                        />
                    </div>
                ) : (
                    <img
                        src={getProfileImage()}
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
                                value={editProfile.nickname || ""}
                                onChange={(e) =>
                                    setEditProfile((prev) => ({
                                        ...prev,
                                        nickname: e.target.value,
                                    }))
                                }
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{profile.nickname || "익명 사용자"}</span>
                        )}
                    </div>

                    {/* 이름 */}
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        {editMode ? (
                            <input
                                type="text"
                                value={editProfile.name || ""}
                                onChange={(e) =>
                                    setEditProfile((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-value">{profile.name || "이름 없음"}</span>
                        )}
                    </div>

                    {/* 집필 현황 (편집 모드가 아닐 때만 표시) */}
                    {!editMode && (
                        <div className="profile-field">
                            <span className="profile-label">집필 현황</span>
                            <div className="profile-value">
                                {/* 참여한 소설 모달 버튼 */}
                                <button
                                    className="modal-button"
                                    onClick={() => setShowParticipatedNovelsModal(true)}
                                >
                                    {participatedNovels.length} 작품 참여 중...
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
                    )}

                    {/* 좋아요 모달 버튼 (편집 모드가 아닐 때만 표시) */}
                    {!editMode && (
                        <div className="profile-buttons">
                            <button className="modal-button" onClick={() => setShowLikedAuthorsModal(true)}>
                                좋아요한 작가 보기
                            </button>
                            <button className="modal-button" onClick={() => setShowLikedNovelsModal(true)}>
                                좋아요한 작품 보기
                            </button>
                        </div>
                    )}

                    {/* 하단의 버튼들 (편집 모드에 따라 다르게 표시) */}
                    <div className="profile-buttons">
                        {editMode ? (
                            <>
                                <button className="profile-save-button" onClick={handleSave}>저장</button>
                                <button className="profile-cancel-button" onClick={handleCancel}>취소</button>
                            </>
                        ) : (
                            <>
                                <button className="profile-edit-button" onClick={handleEdit}>프로필 편집</button>
                                <button className="logout-button" onClick={() => navigate('/signout')}>로그아웃</button>
                            </>
                        )}
                    </div>
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
                                    onClick={() => goToNovelDetail(novel.id)}
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
                                    onClick={() => goToNovelDetail(novel.id)}
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
