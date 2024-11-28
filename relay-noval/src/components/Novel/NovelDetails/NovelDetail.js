import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {firestore, auth} from "../../../firebase/firebase";
import {
    addLineToNovel,
    deleteLineFromNovel,
    getLinesFromNovel,
    updateLineInNovel
} from "../../../firebase/firestore/lineService";
import "./NovelDetail.css";
import {deleteNovel, updateNovel} from "../../../firebase/firestore/novelService";

const NovelDetail = () => {
    const navigate = useNavigate(); // 페이지 이동을 위해 사용

    const {novelId} = useParams(); // URL에서 novelId 가져오기
    const [novel, setNovel] = useState(null); // 선택된 소설 데이터
    const [lines, setLines] = useState([]); // 현재 소설의 모든 줄거리
    const [newLine, setNewLine] = useState(""); // 추가할 줄거리
    const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태
    const [authorName, setAuthorName] = useState("알 수 없는 사용자"); // 시작 저자 이름 상태 추가
    const [userCache, setUserCache] = useState({}); // 사용자 데이터를 캐싱하는 상태
    const [isEditingNovel, setIsEditingNovel] = useState(false); // 소설 편집 모드
    const [editedNovelTitle, setEditedNovelTitle] = useState(""); // 편집 중인 제목



    const user = auth.currentUser;

    const fetchAuthorName = async (userId) => {

        if (!userId) return "알 수 없는 사용자"; // 유효하지 않은 userId 처리

        if (userCache[userId]) return userCache[userId]; // 캐시된 데이터 반환

        try {
            const userDoc = doc(firestore, "users", userId);
            const userSnap = await getDoc(userDoc);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const displayName = userData.useNickname
                    ? userData.nickname || "익명 작성자"
                    : userData.name || "알 수 없는 사용자";

                setUserCache((prevCache) => ({...prevCache, [userId]: displayName})); // 캐시 저장
                return displayName;
            }
        } catch (error) {
            console.error("Error fetching author name:", error);
        }
        return "알 수 없는 사용자"; // 기본값
    };



    useEffect(() => {
        // 로그인 상태 확인
        if (!user) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/login");
            return;
        }

        const fetchNovel = async () => {
            try {
                // Firestore에서 소설 정보 가져오기
                const docRef = doc(firestore, "novels", novelId);
                const docSnap = await getDoc(docRef);


                if (docSnap.exists()) {
                    const novelData = {id: docSnap.id, ...docSnap.data()};

                    // 이미지 URL이 없는 경우 기본값으로 설정
                    if (!novelData.coverImage) {
                        novelData.coverImage = "/images/art-icon.png"; // 기본 이미지 경로
                    }

                    setNovel(novelData); // novel 상태 업데이트

                    setEditedNovelTitle(novelData.title); // 편집용 제목 초기화

                    const fetchedAuthorName = await fetchAuthorName(docSnap.data().userId);
                    setAuthorName(fetchedAuthorName); // 시작 저자 이름 상태 업데이트
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
                const updatedLines = await Promise.all(
                    fetchedLines.map(async (line) => {
                        const displayName = await fetchAuthorName(line.createdBy);
                        return {...line, displayName}; // displayName 필드 추가
                    })
                );


                updatedLines.sort((a, b) => {
                    const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                    const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                    return dateA - dateB; // 오름차순
                });
                setLines(updatedLines);
            } catch (error) {
                console.error("Error fetching lines:", error);
            }
        };

        fetchNovel();
        fetchLines();
    }, [novelId]);

// 소설 삭제 핸들러
    const handleDeleteNovel = async () => {
        if (!window.confirm("정말로 이 소설을 삭제하시겠습니까?")) return;

        try {
            await deleteNovel(novelId); // Firestore에서 소설 삭제
            alert("소설이 성공적으로 삭제되었습니다.");
            navigate("/"); // 홈으로 이동
        } catch (error) {
            console.error("Error deleting novel:", error);
        }
    };

    // 소설 제목 수정 핸들러
    const handleSaveNovelEdit = async () => {
        if (!editedNovelTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        try {
            await updateNovel(novelId, { title: editedNovelTitle }); // Firestore 업데이트
            setNovel((prevNovel) => ({ ...prevNovel, title: editedNovelTitle })); // UI 업데이트
            setIsEditingNovel(false); // 편집 모드 종료
        } catch (error) {
            console.error("Error updating novel:", error);
        }
    };


    const handleAddLine = async () => {
        if (!newLine.trim()) {
            alert("줄거리를 입력하세요.");
            return;
        }

        // 현재 줄 수가 제한을 초과하는지 확인
        if (novel.lineLimit && lines.length >= novel.lineLimit) {
            alert(`이 소설은 ${novel.lineLimit}줄로 제한되어 있습니다.`);
            return;
        }

        setIsSubmitting(true);

        try {
            // Firestore에서 사용자 nickname/name 가져오기
            const writername = await fetchAuthorName(user.uid); // 작성자 이름/닉네임 가져오기

            const newLineData = {
                content: newLine,
                createdBy: user.uid, // Firestore에 userId 저장
                createdAt: new Date(),
            };


            // Firestore에 줄 추가 및 ID 반환
            const lineId = await addLineToNovel(novelId, newLineData);
            setLines((prevLines) => [
                ...prevLines,
                {
                    ...newLineData,
                    id: lineId, // Firestore에서 반환된 ID 포함
                    displayName: writername,
                },
            ]); // 상태 업데이트
            setNewLine(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error adding line:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 삭제 핸들러
    const handleDeleteLine = async (lineId) => {
        if (!window.confirm("정말로 이 줄을 삭제하시겠습니까?")) return;

        try {
            await deleteLineFromNovel(novelId, lineId); // Firestore에서 삭제
            setLines((prevLines) => prevLines.filter((line) => line.id !== lineId)); // UI 업데이트
        } catch (error) {
            console.error("Error deleting line:", error);
        }
    };

// 수정 핸들러
    const handleEditLine = async (lineId, newContent) => {
        if (!newContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            await updateLineInNovel(novelId, lineId, newContent); // Firestore에서 업데이트
            setLines((prevLines) =>
                prevLines.map((line) =>
                    line.id === lineId ? {...line, content: newContent, updatedAt: new Date()} : line
                )
            ); // UI 업데이트
        } catch (error) {
            console.error("Error updating line:", error);
        }
    };


    if (!novel) {
        return <p>소설을 불러오는 중입니다...</p>;
    }

    return (
        <div className="novel-detail">
            {/* 상단: 소설 기본 정보 */}
            <div className="novel-detail-container">
                <img
                    src={novel.coverImage || "/images/art-icon.png"}
                    alt={novel.title}
                    className="novel-detail-image"
                    onError={(e) => {
                        e.target.onerror = null; // 무한 루프 방지
                        e.target.src = "/images/art-icon.png"; // 기본 이미지로 대체
                    }}
                />
                {isEditingNovel ? (
                    <div className="novel-edit-container">
                        <input
                            type="text"
                            value={editedNovelTitle}
                            onChange={(e) => setEditedNovelTitle(e.target.value)}
                            className="novel-edit-input"
                        />
                        <button onClick={handleSaveNovelEdit} className="save-novel-button">
                            저장
                        </button>
                        <button onClick={() => setIsEditingNovel(false)} className="cancel-novel-button">
                            취소
                        </button>
                    </div>
                ) : (
                    <h1 className="novel-title">{novel.title}</h1>
                )}
                {novel.userId === user.uid && (
                    <div className="novel-actions">
                        <button onClick={() => setIsEditingNovel(true)} className="edit-novel-button">
                            제목 수정
                        </button>
                        <button onClick={handleDeleteNovel} className="delete-novel-button">
                            소설 삭제
                        </button>
                    </div>
                )}
                {/*<h1 className="novel-title">{novel.title}</h1>*/}
                <p>장르 : {novel.genre || "미정"}</p>
                <p>총 줄 수: {lines.length}/{novel.lineLimit || "제한 없음"}</p>
                <p>
                    작성일:{" "}
                    {novel.createdAt
                        ? novel.createdAt.toDate().toLocaleDateString()
                        : "작성일 정보 없음"} {/* 수정된 부분: 안전한 createdAt 처리 */}
                </p>
                <p>시작 저자 : {authorName}</p>
                <hr className="divider"/>
            </div>
            {/* 중단: 소설 줄거리 표시 */}
            <div className="novel-content-area">
                <h2>소설 내용</h2>
                <ul className="lines-list">
                    {lines.map((line, index) => (
                        <li key={index} className="line-item">
                            <div className="line-header">
                                <span className="line-number">[{index + 1}/{novel.lineLimit || "제한 없음"}]</span>
                                <span className="line-author">{line.displayName || "익명"}</span>
                                {/*<span className="line-time">*/}
                                {/*{line.createdAt ? (*/}
                                {/*    (() => {*/}
                                {/*        const date = new Date(line.createdAt.toDate ? line.createdAt.toDate() : line.createdAt);*/}
                                {/*        const year = date.getFullYear();*/}
                                {/*        const month = String(date.getMonth() + 1).padStart(2, "0");*/}
                                {/*        const day = String(date.getDate()).padStart(2, "0");*/}
                                {/*        const hours = String(date.getHours()).padStart(2, "0");*/}
                                {/*        const minutes = String(date.getMinutes()).padStart(2, "0");*/}
                                {/*        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;*/}
                                {/*    })()*/}
                                {/*) : (*/}
                                {/*    "작성 시간 없음"*/}
                                {/*)}*/}
                                {/*</span>*/}
                                <span className="line-time">
                                    {line.updatedAt
                                        ? `수정됨: ${new Date(line.updatedAt).toLocaleString()}`
                                        : line.createdAt
                                            ? new Date(line.createdAt).toLocaleString()
                                            : "작성 시간 없음"}
                                </span>

                            </div>
                            <p className="line-content">{line.content}</p>

                            {/* 내가 작성한 라인만 수정/삭제 버튼 표시 */}
                            {line.createdBy === user.uid && (
                                <div className="line-actions">
                                    <button
                                        onClick={() => {
                                            const newContent = prompt("새 내용을 입력하세요:", line.content);
                                            if (newContent !== null) handleEditLine(line.id, newContent);
                                        }}
                                        className="edit-line-button"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLine(line.id)}
                                        className="delete-line-button"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}


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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // 기본 Enter 키 동작(줄바꿈) 방지
                            handleAddLine(); // 줄 추가 함수 호출
                        }
                    }}
                ></textarea>
                <button className="add-line-button" onClick={handleAddLine} disabled={isSubmitting}>
                    {isSubmitting ? "추가 중..." : "내용 추가"}
                </button>
            </div>
        </div>
    );
};

export default NovelDetail;
