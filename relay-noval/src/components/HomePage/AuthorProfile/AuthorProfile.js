// src/components/HomePage/AuthorProfile/AuthorProfile.js
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { getAuthorLikeStatus, updateAuthorLike } from "../../../firebase/firestore/userService";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import './AuthorProfile.css';
import {subscribeToAuthor} from "../../../firebase/firestore/realTimeService";

function AuthorProfile() {
    const { id : authorId } = useParams(); // URL 파라미터로 저자 ID 가져오기
    const [author, setAuthor] = useState(null); // 저자 데이터 상태
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const userId = auth.currentUser?.uid;



    // 실시간 구독 설정
    useEffect(() => {
        const unsubscribe = subscribeToAuthor(authorId, (updatedAuthor) => {
            setAuthor((prevAuthor) => ({
                ...prevAuthor,
                likes: updatedAuthor.likes || 0, // 실시간 좋아요 수 반영
            }));
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }, [authorId]);

    // Firestore에서 저자 데이터 및 좋아요 상태 가져오기
    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                const authorRef = doc(firestore, "users", authorId);
                const authorSnap = await getDoc(authorRef);

                if (authorSnap.exists()) {
                    setAuthor(authorSnap.data());
                } else {
                    console.error("Author not found");
                }

                if (userId) {
                    const isLiked = await getAuthorLikeStatus(userId, authorId);
                    setLiked(isLiked);
                }
            } catch (error) {
                console.error("Error fetching author data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, [authorId, userId]);

    // 로그인 여부 확인 함수
    const ensureLoggedIn = () => {
        if (!auth.currentUser) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/login"); // 로그인 페이지로 이동
            return false;
        }
        return true;
    };

    const toggleLike = async () => {
        if (!ensureLoggedIn()) return; // 로그인 확인

        try {
            // 좋아요 상태 업데이트
            const newLikedState = !liked;
            setLiked(newLikedState);

            // 좋아요 수 로컬 업데이트
            setAuthor((prevAuthor) => ({
                ...prevAuthor,
                likes: prevAuthor.likes + (newLikedState ? 1 : -1), // 좋아요 증가/감소
            }));

            // Firestore에 업데이트
            await updateAuthorLike(userId, authorId, liked);
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!author) return <p>Author not found.</p>;

    return (
        <div className="author-profile-container">
            <div className="author-profile-card">
                <img
                    src={author.profileImage || "/path/to/default-image.jpg"}
                    alt={author.name}
                    className="author-profile-image"
                />
                <div className="author-profile-info">
                    <div className="profile-field">
                        <span className="profile-label">닉네임</span>
                        <span className="profile-inform">{author.nickname}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이름</span>
                        <span className="profile-inform">{author.name}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">이메일</span>
                        <span className="profile-inform">{author.email}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-label">좋아요 수</span>
                        <span className="profile-value">{author.likes || 0}</span>
                    </div>
                </div>
                {/* 좋아요 하트 버튼 */}
                <button
                    className={`like-button ${liked ? "liked" : ""}`}
                    onClick={toggleLike}
                >
                    {liked ? "❤️" : "🤍"}
                </button>
            </div>
        </div>
    );
}

export default AuthorProfile;