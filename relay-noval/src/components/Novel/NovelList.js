// src/components/Novel/NovelList.js
import React, { useEffect, useState } from "react";
import { getAllNovels, deleteNovel } from "../../firebase/firestoreService";
import NovelItem from "./NovelItem";

const NovelList = () => {
    const [novels, setNovels] = useState([]);

    const fetchNovels = async () => {
        try {
            const novelsData = await getAllNovels();
            setNovels(novelsData);
        } catch (error) {
            console.error("소설 목록 불러오기 오류:", error);
        }
    };

    // 삭제 버튼 클릭 시 호출되는 함수
    const handleDelete = async (novelId) => {
        if (window.confirm("이 소설을 삭제하시겠습니까?")) {
            try {
                await deleteNovel(novelId);
                console.log("소설이 성공적으로 삭제되었습니다.");
                // 삭제 후 소설 목록을 갱신
                setNovels((prevNovels) => prevNovels.filter((novel) => novel.id !== novelId));
            } catch (error) {
                console.error("소설 삭제 중 오류:", error);
            }
        }
    }

    useEffect(() => {
        fetchNovels();
    }, []);

    return (
        <div>
            <h2>소설 목록</h2>
            <ul>
                {novels.map((novel) => (
                    <NovelItem key={novel.id} novel={novel} handleDelete={handleDelete} />
                ))}
            </ul>
        </div>
    );
};

export default NovelList;
