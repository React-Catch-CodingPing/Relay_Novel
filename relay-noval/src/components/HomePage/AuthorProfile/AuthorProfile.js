// src/components/HomePage/AuthorProfile/AuthorProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore에서 좋아요 기능을 위해 사용
import { firestore, auth } from '../../../firebase/firebase'; // Firestore 및 현재 사용자 인증
import './AuthorProfile.css';

function AuthorProfile() {
    const { id } = useParams(); // URL에서 저자의 ID를 가져옵니다.
    const [author, setAuthor] = useState(null); // 저자 데이터를 관리하는 상태
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    // Firestore에서 저자 정보를 가져옵니다.
    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                const docRef = doc(firestore, 'users', id); // 'users' 컬렉션에서 해당 ID의 문서 참조
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setAuthor(docSnap.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching author data:', error);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchAuthorData();
    }, [id]);

    // 좋아요 버튼 클릭 시 Firestore에 좋아요 데이터 업데이트
    const handleLike = async () => {
        if (!auth.currentUser) {
            alert('좋아요를 누르려면 로그인해야 합니다.');
            return;
        }

        try {
            const userRef = doc(firestore, 'users', auth.currentUser.uid); // 현재 로그인된 사용자 문서
            await updateDoc(userRef, {
                likedAuthors: arrayUnion(id), // likedAuthors 배열에 저자 ID 추가
            });

            setLiked(true); // 좋아요 상태 업데이트
            alert('좋아요를 눌렀습니다!');
        } catch (error) {
            console.error('Error liking author:', error);
            alert('좋아요에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 로딩 중인 경우
    if (loading) return <p>Loading...</p>;

    // 저자 데이터가 없는 경우
    if (!author) return <p>Author not found.</p>;

    return (
        <div className="author-profile-container">
            <div className="author-profile-card">
                {/* 프로필 이미지 */}
                <img
                    src={author.image || '/path/to/default-image.jpg'}
                    alt={author.name}
                    className="author-profile-image"
                />

                {/* 저자 정보 */}
                <div className="author-profile-info">
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        <span className="profile-value">{author.nickname}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        <span className="profile-value">{author.name}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        <span className="profile-value">{author.email}</span>
                    </div>
                </div>

                {/* 좋아요 버튼 */}
                <button
                    className={`like-button ${liked ? 'liked' : ''}`} // 좋아요 상태에 따라 스타일 변경
                    onClick={handleLike}
                    disabled={liked} // 이미 좋아요를 눌렀다면 비활성화
                >
                    {liked ? '좋아요 완료' : '좋아요'}
                </button>
            </div>
        </div>
    );
}

export default AuthorProfile;