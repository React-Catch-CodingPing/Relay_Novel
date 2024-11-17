// src/components/NovelUpdate.js
import React, { useState } from "react";
import { updateNovel } from "../../firebase/firestoreService";

const NovelUpdate = ({ novelId, existingData }) => {
    const [title, setTitle] = useState(existingData.title);
    const [genre, setGenre] = useState(existingData.genre);
    const [firstLine, setFirstLine] = useState(existingData.firstLine);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedData = {
            title,
            genre,
            firstLine,
        };

        try {
            await updateNovel(novelId, updatedData);
            console.log("소설이 성공적으로 업데이트되었습니다.");
            // 업데이트 후 추가 동작이 필요하면 여기에 작성
        } catch (error) {
            console.error("소설 업데이트 중 오류:", error);
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="작품 제목"
                required
            />
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="로맨스">로맨스</option>
                <option value="판타지">판타지</option>
            </select>
            <textarea
                value={firstLine}
                onChange={(e) => setFirstLine(e.target.value)}
                placeholder="첫 줄거리"
                required
            />
            <button type="submit">수정 완료</button>
        </form>
    );
};

export default NovelUpdate;
