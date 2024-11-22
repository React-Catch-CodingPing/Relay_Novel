import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../../firebase/firebase";
import "./PostDetail.css";

function PostDetail() {
    const { id } = useParams(); // URL에서 글 ID를 가져옴
    const navigate = useNavigate();
    const [post, setPost] = useState(null); // 현재 글 정보
    const [isOwner, setIsOwner] = useState(false); // 수정/삭제 권한 여부
    const [editMode, setEditMode] = useState(false); // 수정 모드
    const [updatedContent, setUpdatedContent] = useState(""); // 수정 중인 내용 상태

    // Firestore에서 글 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(firestore, "communityPosts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const postData = docSnap.data();
                    setPost(postData);

                    // 현재 로그인한 사용자 정보 가져오기
                    const currentUser = auth.currentUser;
                    if (currentUser) {
                        const fetchUserDetails = async () => {
                            try {
                                const userDocRef = doc(firestore, "users", currentUser.uid);
                                const userDocSnap = await getDoc(userDocRef);

                                if (userDocSnap.exists()) {
                                    const userData = userDocSnap.data();

                                    // Firestore의 author와 users의 name 또는 nickname 비교
                                    if (
                                        postData.author === userData.name ||
                                        postData.author === userData.nickname
                                    ) {
                                        setIsOwner(true); // 권한 부여
                                    }
                                } else {
                                    console.error("User document does not exist in Firestore.");
                                }
                            } catch (error) {
                                console.error("Error fetching user details:", error);
                            }
                        };

                        fetchUserDetails();
                    }
                } else {
                    console.error("No such document!");
                    navigate("/community"); // 문서가 없으면 커뮤니티로 리다이렉트
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [id, navigate]);

    // 로그인 여부 확인 함수
    const ensureLoggedIn = () => {
        if (!auth.currentUser) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/login"); // 로그인 페이지로 이동
            return false;
        }
        return true;
    };


    // 삭제 버튼 클릭 시 Firestore에서 문서를 삭제
    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
            if (!confirmDelete) return;

            const docRef = doc(firestore, "communityPosts", id);
            await deleteDoc(docRef);
            alert("글이 삭제되었습니다.");
            navigate("/community");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("글 삭제에 실패했습니다.");
        }
    };

    // 수정 버튼 클릭 시 수정 모드 활성화
    const handleEdit = () => {
        setEditMode(true);
        setUpdatedContent(post.content);
    };

    // 수정 저장 버튼 클릭 시 Firestore에 업데이트
    const handleSave = async () => {
        try {
            const docRef = doc(firestore, "communityPosts", id);
            await updateDoc(docRef, {
                content: updatedContent,
                updatedAt: new Date(),
            });
            setPost((prev) => ({ ...prev, content: updatedContent }));
            setEditMode(false);
            alert("글이 수정되었습니다.");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("글 수정에 실패했습니다.");
        }
    };

    // 수정 취소 버튼 클릭 시 수정 모드 종료
    const handleCancel = () => {
        setEditMode(false);
        setUpdatedContent("");
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div className="post-detail-container">
            <div className="post-detail-card">
                <h2>{post.title}</h2>
                <p>작성자: {post.author}</p>

                {editMode ? (
                    <textarea
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                        className="edit-textarea"
                    />
                ) : (
                    <p>{post.content}</p>
                )}

                {/* 수정/삭제 권한 여부에 따라 버튼 표시 */}
                {isOwner && (
                    <div className="owner-actions">
                        {editMode ? (
                            <>
                                <button className="save-button" onClick={handleSave}>
                                    저장
                                </button>
                                <button className="cancel-button" onClick={handleCancel}>
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="edit-button" onClick={handleEdit}>
                                    수정
                                </button>
                                <button className="delete-button" onClick={handleDelete}>
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                )}

                <button className="back-button" onClick={() => navigate("/community")}>
                    뒤로 가기
                </button>
            </div>
        </div>
    );
}

export default PostDetail;