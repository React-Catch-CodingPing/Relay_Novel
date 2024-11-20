// 소설 줄 관련 로직.
import { firestore } from "../firebase";
import {addDoc, collection, getDocs, serverTimestamp} from "firebase/firestore";


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
