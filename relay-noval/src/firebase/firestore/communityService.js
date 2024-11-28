// communityService.js
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import {auth, firestore} from "../firebase";

/**
 * Firestore에서 모든 게시물 데이터를 가져옵니다.
 * @returns {Promise<Array>} 게시물 데이터 배열
 */
export const fetchPosts = async () => {
    try {
        // communityPosts 컬렉션에서 createdAt 기준 내림차순으로 정렬된 문서를 가져옴
        const postsQuery = query(collection(firestore, "communityPosts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(postsQuery);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id, // 문서 ID
            ...doc.data(), // 문서 데이터
            date: doc.data().createdAt
                ? new Date(doc.data().createdAt.toDate()).toLocaleDateString("ko-KR") // Timestamp => 한국 날짜 형식 변환
                : "날짜 없음", // `createdAt`이 없다면 기본값 설정

        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("게시물을 불러오는 중 오류가 발생했습니다.");
    }
};

/**
 * Firestore에 새 게시물을 추가합니다.
 * @param {Object} newPost - 추가할 게시물 객체
 * @returns {Promise<void>} 성공적으로 추가되었을 경우 완료
 */
export const savePost = async (newPost) => {
    try {
        const { uid } = auth.currentUser; // 현재 사용자 UID 가져오기
        await addDoc(collection(firestore, "communityPosts"), {
            ...newPost,
            authorUid: uid, // UID 저장
            createdAt: serverTimestamp(), // Firestore 서버 시간
        });
    } catch (error) {
        console.error("Error saving post:", error);
        throw new Error("게시물을 저장하는 중 오류가 발생했습니다.");
    }
};

/**
 * Firestore에서 특정 ID의 게시물을 가져옵니다.
 * @param {string} postId - 가져올 게시물의 ID
 * @returns {Promise<Object>} 게시물 데이터
 */
export const getPostById = async (postId) => {
    try {
        const docRef = doc(firestore, "communityPosts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("해당 ID의 게시물을 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        throw error;
    }
};

/**
 * Firestore에서 특정 ID의 게시물을 삭제합니다.
 * @param {string} postId - 삭제할 게시물의 ID
 * @returns {Promise<void>} 성공적으로 삭제되었을 경우 완료
 */
export const deletePost = async (postId) => {
    try {
        const docRef = doc(firestore, "communityPosts", postId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("게시물을 삭제하는 중 오류가 발생했습니다.");
    }
};

/**
 * Firestore에서 특정 ID의 게시물을 업데이트합니다.
 * @param {string} postId - 업데이트할 게시물의 ID
 * @param {Object} updatedData - 업데이트할 데이터
 * @returns {Promise<void>} 성공적으로 업데이트되었을 경우 완료
 */
export const updatePost = async (postId, updatedData) => {
    try {
        const docRef = doc(firestore, "communityPosts", postId);
        await updateDoc(docRef, {
            ...updatedData,
            updatedAt: serverTimestamp(), // Firestore 서버 시간으로 업데이트
        });
    } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("게시물을 업데이트하는 중 오류가 발생했습니다.");
    }
};

/**
 * Firestore에서 특정 게시물의 조회수를 증가시킵니다.
 * @param {string} postId - 조회수를 증가시킬 게시물의 ID
 * @param {Array} posts - 현재 로드된 게시물 목록 (optional)
 * @returns {Promise<void>} 성공적으로 조회수가 증가되었을 경우 완료
 */
export const incrementPostViews = async (postId, posts = []) => {
    try {

        // 인증 여부 확인
        if (!auth.currentUser) {
            throw new Error("로그인이 필요합니다.");
        }


        const postRef = doc(firestore, "communityPosts", postId);

        // 현재 조회수 가져오기
        const currentPost = posts.find((post) => post.id === postId);
        const currentViews = currentPost?.views || 0;

        // 조회수 증가
        await updateDoc(postRef, { views: currentViews + 1 });
    } catch (error) {
        console.error("Error incrementing views:", error);
        throw new Error("조회수를 증가하는 중 오류가 발생했습니다.");
    }
};


/**
 * -----------------------------------------------------------------------------------
 */





/**
 * Firestore에서 댓글을 추가합니다.
 * @param {string} postId - 댓글이 달릴 게시물의 ID
 * @param {Object} newComment - 댓글 데이터 객체
 * @returns {Promise<void>}
 */
export const addComment = async (postId, newComment) => {
    try {
        const postRef = doc(firestore, "communityPosts", postId);
        const commentsRef = collection(postRef, "comments");
        await addDoc(commentsRef, {
            ...newComment,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("댓글 추가 중 오류가 발생했습니다.");
    }
};



/**
 * Firestore에서 게시물의 댓글을 가져옵니다.
 * @param {string} postId - 댓글을 가져올 게시물의 ID
 * @returns {Promise<Array>} 댓글 데이터 배열
 */
export const getComments = async (postId) => {
    try {
        const postRef = doc(firestore, "communityPosts", postId);
        const commentsRef = collection(postRef, "comments");
        const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(commentsQuery);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("댓글 가져오기 중 오류가 발생했습니다.");
    }
};



/**
 * Firestore에서 특정 댓글을 삭제합니다.
 * @param {string} postId - 댓글이 달린 게시물의 ID
 * @param {string} commentId - 삭제할 댓글의 ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (postId, commentId) => {
    try {
        const commentRef = doc(firestore, "communityPosts", postId, "comments", commentId);
        await deleteDoc(commentRef); // Firestore에서 댓글 삭제
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("댓글 삭제 중 오류가 발생했습니다.");
    }
};



/**
 * Firestore에서 특정 댓글을 수정합니다.
 * @param {string} postId - 댓글이 달린 게시물의 ID
 * @param {string} commentId - 수정할 댓글의 ID
 * @param {Object} updatedData - 수정할 데이터
 * @returns {Promise<void>}
 */
export const updateComment = async (postId, commentId, updatedData) => {
    try {
        const commentRef = doc(firestore, "communityPosts", postId, "comments", commentId);
        await updateDoc(commentRef, {
            ...updatedData,
            updatedAt: serverTimestamp(), // Firestore 서버 시간으로 업데이트
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        throw new Error("댓글 수정 중 오류가 발생했습니다.");
    }
};



