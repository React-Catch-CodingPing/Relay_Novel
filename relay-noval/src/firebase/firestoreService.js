// src/firebase/firestoreService.js

import { firestore } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// 컬렉션에 문서를 추가하는 함수
export const addNovelLine = async (novelData) => {
    try {
        const docRef = await addDoc(collection(firestore, "novels"), novelData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

// 컬렉션에서 모든 문서 가져오기
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

// 특정 문서 업데이트
export const updateNovel = async (novelId, updatedData) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);
        await updateDoc(novelRef, updatedData);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

// 특정 문서 삭제
export const deleteNovel = async (novelId) => {
    try {
        const novelRef = doc(firestore, "novels", novelId);
        await deleteDoc(novelRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
};
