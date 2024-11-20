// 실시간 데이터 관련 함수.

import { firestore } from "../firebase";
import {collection, onSnapshot} from "firebase/firestore";

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