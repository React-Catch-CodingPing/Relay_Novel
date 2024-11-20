import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";
import { addLineToNovel, getLinesFromNovel } from "../../../firebase/firestoreService";
import "./NovelDetail.css";

const NovelDetail = () => {
    const { novelId } = useParams(); // URL에서 novelId 가져오기
    const [novel, setNovel] = useState(null); // 선택된 소설 데이터
    const [lines, setLines] = useState([]); // 현재 소설의 모든 줄거리
    const [newLine, setNewLine] = useState(""); // 추가할 줄거리
    const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태

    const user = auth.currentUser;

    useEffect(() => {
        const fetchNovel = async () => {
            try {
                // Firestore에서 소설 정보 가져오기
                const docRef = doc(firestore, "novels", novelId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNovel({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("소설 정보를 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("Error fetching novel:", error);
            }
        };

        const fetchLines = async () => {
            try {
                const fetchedLines = await getLinesFromNovel(novelId); // Firestore에서 줄거리 가져오기
                setLines(fetchedLines);
            } catch (error) {
                console.error("Error fetching lines:", error);
            }
        };

        fetchNovel();
        fetchLines();
    }, [novelId]);

    const handleAddLine = async () => {
        if (!newLine.trim()) {
            alert("줄거리를 입력하세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Firestore에서 사용자 nickname 가져오기
            const userDoc = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userDoc);

            let nickname = "익명 작성자"; // 기본값 설정
            if (userSnap.exists()) {
                nickname = userSnap.data().nickname || "익명 작성자";
            }

            const newLineData = {
                content: newLine,
                createdBy: nickname,
                createdAt: new Date(),
            };

            await addLineToNovel(novelId, newLineData); // Firestore에 줄 추가
            setLines([...lines, newLineData]); // UI 업데이트
            setNewLine(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error adding line:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!novel) {
        return <p>소설을 불러오는 중입니다...</p>;
    }

    return (
        <div className="novel-detail">
            {/* 상단: 소설 기본 정보 */}
            <div className="novel-detail-container">
                <img src={novel.imageUrl || "/placeholder-image.png"} alt={novel.title} className="novel-image"/>
                <h1 className="novel-title">{novel.title}</h1>
                <p>장르: {novel.genre || "미정"}</p>
                <p>총 줄 수: {lines.length}/{novel.lineLimit || "제한 없음"}</p>
                <hr className="divider"/>
            </div>
            {console.log(lines[0].createdAt)}
            {/* 중단: 소설 줄거리 표시 */}
            <div className="novel-content-area">
                <h2>소설 내용</h2>
                <ul className="lines-list">
                    {lines.map((line, index) => (
                        <li key={index} className="line-item">
                            <div className="line-header">
                                <span className="line-number">[{index + 1}/{novel.lineLimit || "제한 없음"}]</span>
                                <span className="line-author">{line.createdBy || "익명"}</span>
                                <span className="line-time">
                                {line.createdAt ? (
                                    (() => {
                                    const date = new Date(line.createdAt.toDate ? line.createdAt.toDate() : line.createdAt);
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(2, "0");
                                    const hours = String(date.getHours()).padStart(2, "0");
                                    const minutes = String(date.getMinutes()).padStart(2, "0");
                                    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
                                    })()
                                ) : (
                                "작성 시간 없음"
                                )}
</span>

                            </div>
                            <p className="line-content">{line.content}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 하단: 이어쓰기 영역 */}
            <div className="add-line">
                <textarea
                    className="add-line-input"
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    placeholder="새로 추가할 문장을 입력하세요..."
                    rows="2"
                    disabled={isSubmitting}
                ></textarea>
                <button className="add-line-button" onClick={handleAddLine} disabled={isSubmitting}>
                    {isSubmitting ? "추가 중..." : "내용 추가"}
                </button>
            </div>
        </div>
    );
};

export default NovelDetail;
