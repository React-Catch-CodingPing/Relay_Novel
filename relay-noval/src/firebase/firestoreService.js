import { firestore } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, query, where } from "firebase/firestore";

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

// 사용자가 시작한 소설 가져오기
export const getStartedNovels = async (userId) => {
    const novelsRef = collection(firestore, "novels");
    const q = query(novelsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 사용자가 참여한 소설 가져오기
export const getParticipatedNovels = async (userId) => {
    const novelsRef = collection(firestore, "novels");
    const querySnapshot = await getDocs(novelsRef);

    const participatedNovels = [];
    for (const novelDoc of querySnapshot.docs) {
        const linesRef = collection(firestore, `novels/${novelDoc.id}/lines`);
        const linesQuery = query(linesRef, where("createdBy", "==", userId));
        const linesSnapshot = await getDocs(linesQuery);

        if (!linesSnapshot.empty) {
            participatedNovels.push({ id: novelDoc.id, ...novelDoc.data() });
        }
    }

    return participatedNovels;
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
