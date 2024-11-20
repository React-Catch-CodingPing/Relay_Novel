// 사용자 관련 함수

import { firestore } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

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

/**
 * 사용자가 시작한 소설을 가져오는 함수
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array<object>>} - 사용자가 시작한 소설 목록
 */
export const getStartedNovels = async (userId) => {
    try {
        const novelsRef = collection(firestore, "novels");

        // userId 필드가 특정 사용자와 일치하는 소설을 쿼리
        const userNovelsQuery = query(novelsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(userNovelsQuery);

        // 쿼리 결과를 배열로 변환
        const startedNovels = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return startedNovels;
    } catch (error) {
        console.error("Error fetching started novels:", error);
        throw error;
    }
};


/**
 * 사용자가 참여한 소설을 가져오는 함수
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array<object>>} - 사용자가 참여한 소설 목록
 */
export const getParticipatedNovels = async (userId) => {
    try {
        const novelsRef = collection(firestore, "novels");
        const querySnapshot = await getDocs(novelsRef);

        const participatedNovels = [];

        for (const novelDoc of querySnapshot.docs) {
            const novelId = novelDoc.id;
            const linesRef = collection(firestore, `novels/${novelId}/lines`);

            // 사용자 ID로 필터링된 줄 가져오기
            const linesQuery = query(linesRef, where("createdBy", "==", userId));
            const linesSnapshot = await getDocs(linesQuery);

            if (!linesSnapshot.empty) {
                participatedNovels.push({
                    id: novelId,
                    ...novelDoc.data(),
                });
            }
        }

        return participatedNovels;
    } catch (error) {
        console.error("Error fetching participated novels:", error);
        throw error;
    }
};
