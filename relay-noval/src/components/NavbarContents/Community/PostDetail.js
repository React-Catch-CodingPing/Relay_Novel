// src/components/NavbarContents/Community/PostDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import "./PostDetail.css";

function PostDetail() {
    const { id } = useParams(); // URL에서 글 ID를 가져옵니다.
    const navigate = useNavigate(); // 뒤로 가기 버튼을 위한 네비게이션
    const [post, setPost] = useState(null); // 글 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 관리

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(firestore, "communityPosts", id); // Firestore에서 글 ID로 문서 참조
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost(docSnap.data()); // 문서 데이터를 상태에 저장
                } else {
                    console.error("해당 글을 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("글 데이터를 불러오는 중 오류가 발생했습니다:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>글 데이터를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="post-detail-container">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
                <p><strong>작성자:</strong> {post.author}</p>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>
                뒤로 가기
            </button>
        </div>
    );
}

export default PostDetail;