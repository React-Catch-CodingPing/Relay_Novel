import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {auth, firestore} from "../../../firebase/firebase";
import "./PostDetail.css";
import {
    getComments,
    addComment,
    deleteComment,
    updateComment,
    getPostById,
    deletePost,
    updatePost,
} from "../../../firebase/firestore/communityService";
import {doc, getDoc} from "firebase/firestore";

function PostDetail() {
    const {id} = useParams(); // URL에서 글 ID를 가져옴
    const navigate = useNavigate();
    const [post, setPost] = useState(null); // 현재 글 정보
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isOwner, setIsOwner] = useState(false); // 수정/삭제 권한 여부
    const [editMode, setEditMode] = useState(false); // 수정 모드
    const [updatedContent, setUpdatedContent] = useState(""); // 수정 중인 내용 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가


    // Firestore에서 글 가져오기
    useEffect(() => {
        const loadPostAndComments = async () => {
            setLoading(true); // 로딩 상태 활성화
            try {

                if (!ensureLoggedIn()) return;

                const postData = await getPostById(id);
                if (!postData) {
                    throw new Error("게시물을 찾을 수 없습니다.");
                }
                setPost(postData);

                // 댓글 가져오기
                const fetchedComments = await getComments(id);
                setComments(fetchedComments);

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


                        const displayName = authorData.useNickname
                            ? authorData.nickname || "닉네임 없음"
                            : authorData.name || "이름 없음";

                        setPost((prev) => ({
                            ...prev,
                            author: displayName,
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

        loadPostAndComments();
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


    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("댓글을 입력해주세요.");
            return;
        }

        if (!ensureLoggedIn()) return;

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("로그인이 필요합니다.");

            const userRef = doc(firestore, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            let userIdentifier = currentUser.email.split("@")[0]; // 기본값: 이메일 앞부분

            if (userSnap.exists()) {
                const userData = userSnap.data();
                userIdentifier = userData.useNickname
                    ? userData.nickname || "닉네임 없음"
                    : userData.name || "이름 없음";
            }

            const commentData = {
                content: newComment,
                authorUid: currentUser.uid,
                author: userIdentifier,
            };

            await addComment(id, commentData); // Firestore에 추가
            // Firestore에서 댓글 최신 상태 가져오기
            const updatedComments = await getComments(id);
            setComments(updatedComments); // UI에 반영
            setNewComment(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(id, commentId); // Firestore에서 삭제
            // Firestore에서 댓글 최신 상태 가져오기
            const updatedComments = await getComments(id);
            setComments(updatedComments); // UI에 반영
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("댓글 삭제 중 오류가 발생했습니다.");
        }
    };

    const handleUpdateComment = async (commentId, updatedContent) => {
        try {
            await updateComment(id, commentId, { content: updatedContent }); // Firestore 업데이트
            // Firestore에서 댓글 최신 상태 가져오기
            const updatedComments = await getComments(id);
            setComments(updatedComments); // UI에 반영
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("댓글 수정 중 오류가 발생했습니다.");
        }
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
                                <button className="community-post-save-button" onClick={handleSave}>
                                    저장
                                </button>
                                <button className="community-post-cancel-button" onClick={handleCancel}>
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="community-post-edit-button" onClick={handleEdit}>
                                    수정
                                </button>
                                <button className="community-post-delete-button" onClick={handleDelete}>
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                )}

                <div className="comments-section">
                    <h3>댓글</h3>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                <p>{comment.content}</p>
                                <small>작성자: {comment.author}</small>
                                {comment.authorUid === auth.currentUser?.uid && (
                                    <div>
                                        <button onClick={() => handleDeleteComment(comment.id)}>
                                            삭제
                                        </button>
                                        <button
                                            onClick={() => {
                                                const updatedContent = prompt(
                                                    "댓글 수정:",
                                                    comment.content
                                                );
                                                if (updatedContent) {
                                                    handleUpdateComment(
                                                        comment.id,
                                                        updatedContent
                                                    );
                                                }
                                            }}
                                        >
                                            수정
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                    />
                    <button onClick={handleAddComment}>댓글 작성</button>
                </div>


                <button className="back-button" onClick={() => navigate("/community")}>
                    뒤로 가기
                </button>
            </div>
        </div>
    );
}

export default PostDetail;