import { firestore } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove,
    onSnapshot, // 실시간 업데이트를 위한 메서드 추가
} from "firebase/firestore";

/**
 * 실시간으로 모든 소설 문서를 구독하는 함수
 * @param {function} onUpdate - 데이터 업데이트 시 실행할 콜백 함수
 * @returns {function} unsubscribe - 구독 해제 함수
 */
export const subscribeToNovels = (onUpdate) => {
    const novelsRef = collection(firestore, "novels");

    // Firestore의 실시간 구독 설정
    const unsubscribe = onSnapshot(novelsRef, (snapshot) => {
        const novels = snapshot.docs.map((doc) => ({
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
        onUpdate(novels); // 콜백 함수로 데이터를 전달
    });

    return unsubscribe;
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


// 소설을 추가하는 함수
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

// 저자 정보를 가져오는 함수 ( 유저들 중 집필을 해 본적 있는 이들을 get )
export const getAuthors = async () => {
    try {
        // 1. 모든 소설 데이터를 가져와 userId 추출
        const novelsSnapshot = await getDocs(collection(firestore, "novels"));
        const authorIds = new Set();
        novelsSnapshot.forEach((doc) => {
            const novelData = doc.data();
            if (novelData.userId) {
                authorIds.add(novelData.userId); // 소설의 userId를 Set에 추가
            }
        });

        // 2. 모든 유저 데이터를 가져와 필터링
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        const authors = [];
        usersSnapshot.forEach((doc) => {
            if (authorIds.has(doc.id)) { // userId가 소설 작성자 목록에 포함된 경우만 추가
                authors.push({ id: doc.id, ...doc.data() });
            }
        });

        console.log("Filtered authors:", authors); // 디버깅용 로그
        return authors; // 필터링된 저자 데이터 반환
    } catch (error) {
        console.error("Error fetching authors:", error);
        throw error;
    }
};


// 유저 정보를 가져오는 함수
export const getUsers = async () => {
    try {
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched users:", users); // 디버깅용 로그
        return users; // 모든 사용자 데이터 반환
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// 특정 소설에 줄거리를 추가하는 함수
export const addLineToNovel = async (novelId, lineData) => {
    try {
        const linesCollection = collection(firestore, `novels/${novelId}/lines`);
        const lineRef = await addDoc(linesCollection, {
            ...lineData,
            createdAt: serverTimestamp(),
        });
        return lineRef.id;
    } catch (error) {
        console.error("Error adding line to novel: ", error);
        throw error;
    }
};

// 특정 소설의 모든 줄거리를 가져오는 함수
export const getLinesFromNovel = async (novelId) => {
    try {
        const linesCollection = collection(firestore, `novels/${novelId}/lines`);
        const querySnapshot = await getDocs(linesCollection);
        const lines = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || "작성 시간 없음", // 시간 변환 추가
        }));
        return lines;
    } catch (error) {
        console.error("Error fetching lines from novel: ", error);
        throw error;
    }
};
