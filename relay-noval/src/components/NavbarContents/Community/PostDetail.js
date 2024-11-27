import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {auth, firestore} from "../../../firebase/firebase";
import "./PostDetail.css";
import {deletePost, getPostById, updatePost} from "../../../firebase/firestore/communityService";
import {doc, getDoc} from "firebase/firestore";

function PostDetail() {
    const {id} = useParams(); // URL에서 글 ID를 가져옴
    const navigate = useNavigate();
    const [post, setPost] = useState(null); // 현재 글 정보
    const [isOwner, setIsOwner] = useState(false); // 수정/삭제 권한 여부
    const [editMode, setEditMode] = useState(false); // 수정 모드
    const [updatedContent, setUpdatedContent] = useState(""); // 수정 중인 내용 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가


    // Firestore에서 글 가져오기
    useEffect(() => {
        const loadPost = async () => {
            setLoading(true); // 로딩 상태 활성화
            try {
                const postData = await getPostById(id);
                if (!postData) {
                    throw new Error("게시물을 찾을 수 없습니다.");
                }
                setPost(postData);

                const currentUser = auth.currentUser;
                if (currentUser && postData.authorUid === currentUser.uid) {
                    setIsOwner(true); // UID로 작성자 식별
                }

// Firestore에서 작성자의 닉네임 또는 이름 불러오기
                if (postData.authorUid) {
                    const authorRef = doc(firestore, "users", postData.authorUid);
                    const authorSnap = await getDoc(authorRef);
                    if (authorSnap.exists()) {
                        const authorData = authorSnap.data();
                        setPost((prev) => ({
                            ...prev,
                            author: authorData.nickname || authorData.name || "알 수 없는 사용자",
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                alert("게시물을 찾을 수 없습니다.");
                navigate("/community");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
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

            await deletePost(id);
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
            await updatePost(id, {content: updatedContent});
            setPost((prev) => ({...prev, content: updatedContent}));
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

    if (loading) return <p>Loading...</p>; // 로딩 상태 표시

    if (!post) return <p>게시물을 찾을 수 없습니다.</p>; // 게시물이 없을 경우 메시지 표시


    return (
        <div className="post-detail-container">
            <div className="post-detail-card">
                {/* 제목과 조회수 같은 줄에 배치 */}
                <div className="title-row">
                    <h2>{post.title}</h2>
                    <span className="views">조회수: {post.views || 0}</span>
                </div>
                <div className="divider"></div>

                <div className="author">{post.author}</div>


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