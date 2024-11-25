// src/firebase/firestore/storageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// 이미지 업로드 함수
export const uploadImage = async (file, folderName = "uploads") => {
    if (!file) throw new Error("No file provided");

    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `${folderName}/${fileName}`);

    try {
        // 파일 업로드
        await uploadBytes(fileRef, file);
        // 업로드된 파일의 다운로드 URL 반환
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
