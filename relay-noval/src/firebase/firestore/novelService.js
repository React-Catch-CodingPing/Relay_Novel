// 소설 관련 작업

import { firestore } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    getDoc,
    serverTimestamp,
    addDoc,
    deleteDoc
} from "firebase/firestore";

/**
 * 소설을 추가하는 함수
 */
export const addNovelLine = async (novelData) => {
    try {
        const docRef = await addDoc(collection(firestore, "novels"), {
            ...novelData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};


// 특정 소설 문서를 업데이트하는 함수
export const updateNovel = async (novelId, updatedData) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);
        await updateDoc(novelRef, updatedData);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

// 특정 소설 문서를 삭제하는 함수
export const deleteNovel = async (novelId) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);
        await deleteDoc(novelRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
};



/**
 * 모든 소설 문서를 가져오는 함수
 */
export const getAllNovels = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "novels"));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            title: doc.data().title || "없음", // 제목 기본값
            genre: doc.data().genre || "미정", // 장르 기본값
            lineCount: doc.data().lineCount || 0, // 진행된 줄 수 기본값
            views: doc.data().views || 0, // 조회수 기본값
            likes: doc.data().likes || 0, // 좋아요 기본값
            likedBy: doc.data().likedBy || [], // 좋아요한 사용자 목록
            recommendations: doc.data().recommendations || 0, // 추천 기본값
            recommendedBy: doc.data().recommendedBy || [], // 추천한 사용자 목록
            image: doc.data().imageUrl || "/placeholder-image.png", // 이미지 기본값
        }));
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
};

/**
 * 특정 소설의 조회수를 증가시키는 함수
 */
export const incrementNovelViews = async (novelId) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);
        await updateDoc(novelRef, { views: increment(1) }); // 조회수 +1
    } catch (error) {
        console.error("Error incrementing novel views:", error);
        throw error;
    }
};

/**
 * 특정 소설의 좋아요를 토글하는 함수
 * @param {string} novelId - 소설 ID
 * @param {string} userId - 사용자 ID
 * @param {boolean} isLiked - 현재 좋아요 상태
 * @returns {object} - 업데이트된 소설 데이터
 */
export const toggleNovelLike = async (novelId, userId, isLiked) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);

        if (isLiked) {
            // 좋아요 취소
            await updateDoc(novelRef, {
                likes: increment(-1),
                likedBy: arrayRemove(userId),
            });
        } else {
            // 좋아요 추가
            await updateDoc(novelRef, {
                likes: increment(1),
                likedBy: arrayUnion(userId),
            });
        }

        const updatedDoc = await getDoc(novelRef); // 업데이트된 문서 가져오기
        return { id: updatedDoc.id, ...updatedDoc.data() }; // 업데이트된 데이터 반환
    } catch (error) {
        console.error("Error toggling novel like:", error);
        throw error;
    }
};

/**
 * 특정 소설의 추천을 토글하는 함수
 * @param {string} novelId - 소설 ID
 * @param {string} userId - 사용자 ID
 * @param {boolean} isRecommended - 현재 추천 상태
 * @returns {object} - 업데이트된 소설 데이터
 */
export const toggleNovelRecommendation = async (novelId, userId, isRecommended) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);

        if (isRecommended) {
            // 추천 취소
            await updateDoc(novelRef, {
                recommendations: increment(-1),
                recommendedBy: arrayRemove(userId),
            });
        } else {
            // 추천 추가
            await updateDoc(novelRef, {
                recommendations: increment(1),
                recommendedBy: arrayUnion(userId),
            });
        }

        const updatedDoc = await getDoc(novelRef); // 업데이트된 문서 가져오기
        return { id: updatedDoc.id, ...updatedDoc.data() }; // 업데이트된 데이터 반환
    } catch (error) {
        console.error("Error toggling novel recommendation:", error);
        throw error;
    }
};