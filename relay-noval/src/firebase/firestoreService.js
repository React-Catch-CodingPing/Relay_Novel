import { firestore } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

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

// 모든 소설 문서를 가져오는 함수
export const getAllNovels = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "novels"));
        const novels = [];
        querySnapshot.forEach((doc) => {
            novels.push({ id: doc.id, ...doc.data() });
        });
        return novels;
    } catch (error) {
        console.error("Error fetching documents: ", error);
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

// 저자 정보를 가져오는 함수
export const getAuthors = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "authors"));
        const authors = [];
        querySnapshot.forEach((doc) => {
            authors.push({ id: doc.id, ...doc.data() });
        });
        return authors;
    } catch (error) {
        console.error("Error fetching authors: ", error);
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
