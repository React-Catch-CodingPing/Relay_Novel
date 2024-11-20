// src/components/HomePage/AuthorProfile/AuthorProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore, auth } from '../../../firebase/firebase';
import './AuthorProfile.css';

function AuthorProfile() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [loading, setLoading] = useState(true);

    // Firestore에서 저자 데이터를 가져옵니다.
    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                const docRef = doc(firestore, 'users', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setAuthor(docSnap.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching author data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, [id]);

    // 좋아요 버튼 클릭 시 Firestore 업데이트
    const handleLike = async () => {
        if (!auth.currentUser) {
            alert('좋아요를 누르려면 로그인해야 합니다.');
            return;
        }

        try {
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                likedAuthors: arrayUnion(id),
            });

            setLiked(true);
            alert('좋아요를 눌렀습니다!');
        } catch (error) {
            console.error('Error liking author:', error);
            alert('좋아요에 실패했습니다. 다시 시도해주세요.');
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!author) return <p>Author not found.</p>;

    return (
        <div className="author-profile-container">
            <div className="author-profile-card">
                <img
                    src={author.image || '/path/to/default-image.jpg'}
                    alt={author.name}
                    className="author-profile-image"
                />

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

                {/* 좋아요 하트 버튼 */}
                <button
                    className={`like-button ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={liked} // 좋아요를 누른 후 비활성화
                >
                    {liked ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    );
}

export default AuthorProfile;