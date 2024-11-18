// src/components/HomePage/AuthorProfile/AuthorProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Firestore에서 문서를 읽기 위한 함수
import { firestore } from '../../../firebase/firebase'; // Firestore 인스턴스 가져오기
import './AuthorProfile.css';

function AuthorProfile() {
    // URL에서 `id`를 가져옵니다. (저자의 ID)
    const { id } = useParams();

    // 저자 정보를 저장할 상태
    const [author, setAuthor] = useState(null);

    // 로딩 상태를 저장할 상태
    const [loading, setLoading] = useState(true);

    // Firestore에서 저자 데이터를 가져오는 함수
    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                console.log("Fetching author with ID:", id); // URL에서 가져온 ID 확인

                // Firestore에서 `authors` 컬렉션의 해당 ID 문서 참조
                const docRef = doc(firestore, 'users', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // 문서가 존재하면 상태에 데이터를 저장
                    console.log("Author data:", docSnap.data());
                    setAuthor(docSnap.data());
                } else {
                    // 문서가 없을 경우 처리
                    console.error("No such document!");
                }
            } catch (error) {
                // Firestore 요청 중 에러 처리
                console.error("Error fetching author data:", error);
            } finally {
                setLoading(false); // 로딩 상태 종료
            }
        };

        fetchAuthorData();
    }, [id]); // `id`가 변경될 때마다 데이터를 새로 가져옵니다.

    // 로딩 상태 표시
    if (loading) return <p>Loading...</p>;

    // 저자 데이터가 없을 경우 에러 메시지 표시
    if (!author) return <p>Author not found.</p>;

    return (
        <div className="author-profile-container">
            <div className="author-profile-card">
                {/* 저자의 프로필 이미지 */}
                <img
                    src={author.profileImage || '/path/to/default-image.jpg'}
                    alt={author.name}
                    className="author-profile-image"
                />

                {/* 저자 정보 표시 */}
                <div className="author-profile-info">
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        <span className="profile-value">{author.nickname || "닉네임 없음"}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        <span className="profile-value">{author.name || "이름 없음"}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        <span className="profile-value">{author.email || "이메일 없음"}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">집필 현황</span>
                        <div className="profile-value">
                            <div>{author.novelsParticipated || 0} 줄 참여 중...</div>
                            <div>{author.novelsStarted || 0} 작품 시작...</div>
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