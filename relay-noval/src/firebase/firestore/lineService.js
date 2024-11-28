// 소설 줄 관련 로직.
import {auth, firestore} from "../firebase";
import {addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc} from "firebase/firestore";


// 특정 소설에 줄거리를 추가하는 함수
export const addLineToNovel = async (novelId, lineData) => {
    try {
        const linesCollection = collection(firestore, `novels/${novelId}/lines`);
        const lineRef = await addDoc(linesCollection, {
            ...lineData,
            createdBy: auth.currentUser.uid, // 닉네임 대신 사용자 ID 저장
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
            updatedAt: doc.data().updatedAt?.toDate() || null, // 업데이트 시간 처리
        }));
        return lines;
    } catch (error) {
        console.error("Error fetching lines from novel: ", error);
        throw error;
    }
};


/**
 * 특정 소설의 줄 수를 반환하는 함수
 * @param {string} novelId - 소설 ID
 * @returns {Promise<number>} - 줄 수
 */
export const getLineCountForNovel = async (novelId) => {
    try {
        const linesCollection = collection(firestore, `novels/${novelId}/lines`);
        const querySnapshot = await getDocs(linesCollection);
        return querySnapshot.size; // 줄 수 반환
    } catch (error) {
        console.error("Error getting line count for novel: ", error);
        throw error;
    }
};


// 특정 소설의 특정 라인을 삭제하는 함수
export const deleteLineFromNovel = async (novelId, lineId) => {
    try {
        const lineRef = doc(firestore, `novels/${novelId}/lines`, lineId);
        await deleteDoc(lineRef);
    } catch (error) {
        console.error("Error deleting line:", error);
        throw error;
    }
};

// 특정 소설의 특정 라인을 업데이트하는 함수
export const updateLineInNovel = async (novelId, lineId, updatedContent) => {
    try {
        const lineRef = doc(firestore, `novels/${novelId}/lines`, lineId);
        await updateDoc(lineRef, {
            content: updatedContent,
            updatedAt: serverTimestamp(), // 수정 시간 저장
        });
    } catch (error) {
        console.error("Error updating line:", error);
        throw error;
    }
};
