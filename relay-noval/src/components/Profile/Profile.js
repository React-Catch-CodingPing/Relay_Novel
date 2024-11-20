// 사용자 정보 및 로그아웃 기능을 제공하는 프로필 페이지.

// src/components/Profile/Profile.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {collection, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';
import { setUser } from '../../store/authSlice'; // Redux의 setUser 액션을 사용하여 상태 업데이트
import './Profile.css';
import { getStartedNovels, getParticipatedNovels } from "../../firebase/firestore/userService";


function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux에서 현재 사용자 정보 가져오기
    const user = useSelector((state) => state.auth.user);

    // 현재 프로필 정보를 위한 상태
    const [profile, setProfile] = useState(user);

    const [startedNovels, setStartedNovels] = useState([]); // 내가 시작한 소설
    const [participatedNovels, setParticipatedNovels] = useState([]); // 내가 참여한 소설

    const [editProfile, setEditProfile] = useState(user); // 편집 모드에서 임시로 사용하는 상태
    const [editMode, setEditMode] = useState(false); // 편집 모드 상태


    // const [isDragging1, setIsDragging1] = useState(false);
    // const [isDragging2, setIsDragging2] = useState(false);
    // const [startX1, setStartX1] = useState(0);
    // const [startX2, setStartX2] = useState(0);
    // const [scrollLeft1, setScrollLeft1] = useState(0);
    // const [scrollLeft2, setScrollLeft2] = useState(0);
    // const slider1Ref = useRef(null);
    // const slider2Ref = useRef(null);

    // const handleMouseDown1 = (e) => {
    //     setIsDragging1(true);
    //     setStartX1(e.pageX - slider1Ref.current.offsetLeft);
    //     setScrollLeft1(slider1Ref.current.scrollLeft);
    // };
    //
    // const handleMouseUp1 = () => {
    //     setIsDragging1(false);
    // };
    //
    // const handleMouseMove1 = (e) => {
    //     if (!isDragging1) return;
    //     e.preventDefault();
    //     const x = e.pageX - slider1Ref.current.offsetLeft;
    //     const walk = (x - startX1) * 2; // 스크롤 속도 조절
    //     slider1Ref.current.scrollLeft = scrollLeft1 - walk;
    // };
    //
    // const handleMouseDown2 = (e) => {
    //     setIsDragging2(true);
    //     setStartX2(e.pageX - slider2Ref.current.offsetLeft);
    //     setScrollLeft2(slider2Ref.current.scrollLeft);
    // };
    //
    // const handleMouseUp2 = () => {
    //     setIsDragging2(false);
    // };
    //
    // const handleMouseMove2 = (e) => {
    //     if (!isDragging2) return;
    //     e.preventDefault();
    //     const x = e.pageX - slider2Ref.current.offsetLeft;
    //     const walk = (x - startX2) * 2;
    //     slider2Ref.current.scrollLeft = scrollLeft2 - walk;
    // };
    //
    // const fetchUserProfile = async () => {
    //     setIsLoading(true);
    //     try {
    //         // Firestore에서 사용자 프로필 가져오기
    //         const userDoc = doc(firestore, 'users', auth.currentUser.uid);
    //         const userSnap = await getDoc(userDoc);
    //
    //         if (userSnap.exists()) {
    //             setProfile((prevProfile) => ({
    //                 ...prevProfile,
    //                 ...userSnap.data(), // 프로필 데이터 병합
    //             }));
    //         } else {
    //             console.error('사용자 프로필 데이터가 없습니다.');
    //         }
    //     } catch (error) {
    //         console.error('사용자 프로필 데이터를 가져오는 중 오류 발생:', error);
    //     } finally{
    //         setIsLoading(false);
    //     }
    // };
    // const fetchWritingStatus = async () => {
    //     try {
    //         // Firestore에서 사용자가 참여한 줄 수와 작품 수를 계산
    //         const linesQuerySnapshot = await getDocs(collection(firestore, `users/${auth.currentUser.uid}/lines`));
    //         const worksQuerySnapshot = await getDocs(collection(firestore, `users/${auth.currentUser.uid}/works`));
    //
    //         setProfile((prevProfile) => ({
    //             ...prevProfile,
    //             totalLines: linesQuerySnapshot.size,
    //             totalWorks: worksQuerySnapshot.size,
    //         }));
    //     } catch (error) {
    //         console.error('집필 현황 정보를 가져오는 중 오류 발생:', error);
    //     }
    // };
    //
    // const fetchUserData = useCallback(async () => {
    //     if (!user) return;
    //     setIsLoading(true);
    //     try {
    //         const userDoc = doc(firestore, "users", user.uid);
    //         const userSnap = await getDoc(userDoc);
    //
    //         let nickname = "익명 작성자"; // 기본값 설정
    //         if (userSnap.exists()) {
    //             nickname = userSnap.data().nickname || "익명 작성자";
    //         }
    //         await Promise.all([
    //             // 모든 데이터 fetch를 동시에 실행
    //             fetchUserProfile(),
    //             fetchWritingStatus(),
    //             (async () => {
    //                 const started = await getStartedNovels(auth.currentUser.uid);
    //                 setStartedNovels(started);
    //             })(),
    //             (async () => {
    //                 const participated = await getParticipatedNovels(nickname);
    //
    //                 setParticipatedNovels(participated);
    //                 console.log("awefawef",auth.currentUser)
    //             })()
    //         ]);
    //     } catch (error) {
    //         console.error("데이터 가져오기 실패:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [user]);
    //
    // useEffect(() => {
    //     if (user) {
    //         fetchUserData();
    //     }
    // }, [fetchUserData]);


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


                {/*/!* 내가 시작한 소설 *!/*/}
                {/*<div className="novels-section">*/}
                {/*    <h2>내가 시작한 소설</h2>*/}
                {/*    {isLoading ? (<p>불러오는 중 ...</p>) : (*/}
                {/*        startedNovels && startedNovels.length > 0 ? (*/}
                {/*            <ul*/}
                {/*                ref={slider1Ref}*/}
                {/*                onMouseDown={handleMouseDown1}*/}
                {/*                onMouseUp={handleMouseUp1}*/}
                {/*                onMouseLeave={handleMouseUp1}*/}
                {/*                onMouseMove={handleMouseMove1}*/}
                {/*            >*/}
                {/*                {startedNovels.map((novel) => (*/}
                {/*                    <div className='novel-card'>*/}
                {/*                        <li key={novel.id} className="novel-item">*/}
                {/*                            <h3>{novel.title}</h3>*/}
                {/*                            <p>장르: {novel.genre}</p>*/}
                {/*                            <p>첫 줄: {novel.firstLine}</p>*/}
                {/*                            <p>작성일: {novel.createdAt.toDate().toLocaleDateString()}</p>*/}
                {/*                        </li>*/}
                {/*                    </div>*/}

                {/*                ))}*/}
                {/*            </ul>*/}
                {/*        ) : (<p>시작한 소설이 없습니다.</p>)*/}

                {/*    )*/}
                {/*    }*/}
                {/*</div>*/}


                {/*/!* 내가 참여한 소설 *!/*/}
                {/*<div className="novels-section">*/}
                {/*    <h2>내가 참여한 소설</h2>*/}
                {/*    {isLoading ? (<p>불러오는 중 ...</p>) : (*/}
                {/*        participatedNovels && participatedNovels.length > 0 ? (*/}
                {/*                <ul*/}
                {/*                    ref={slider2Ref}*/}
                {/*                    onMouseDown={handleMouseDown2}*/}
                {/*                    onMouseUp={handleMouseUp2}*/}
                {/*                    onMouseLeave={handleMouseUp2}*/}
                {/*                    onMouseMove={handleMouseMove2}*/}
                {/*                >*/}
                {/*                    {participatedNovels.map((novel) => (*/}
                {/*                        <div className='novel-card'>*/}
                {/*                            <li key={novel.id} className="novel-item">*/}
                {/*                                <h3>{novel.title}</h3>*/}
                {/*                                <p>장르: {novel.genre}</p>*/}
                {/*                                <p>참여일: {novel.participatedAt && novel.participatedAt.toDate().toLocaleDateString()}</p>*/}
                {/*                            </li>*/}
                {/*                        </div>*/}
                {/*                    ))}*/}
                {/*                </ul>*/}
                {/*            ) :*/}
                {/*            (<p>참여한 소설이 없습니다.</p>)*/}

                {/*    )*/}
                {/*    }*/}
                {/*</div>*/}

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