// src/components/NavbarContents/Community/WritePost.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPostImage, savePostWithImages } from "../../../firebase/firestore/communityService";
import { auth, firestore } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./WritePost.css";

function WritePost() {
    const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅
    const [title, setTitle] = useState(""); // 글 제목 상태
    const [content, setContent] = useState(""); // 글 내용 상태
    const [authorType, setAuthorType] = useState("nickname"); // 작성자 선택 (닉네임 또는 이름)
    const [user, setUser] = useState({ nickname: "", name: "" }); // 사용자 정보 상태
    const [images, setImages] = useState([]); // 업로드된 사진 URL 리스트
    const [uploading, setUploading] = useState(false);

    // Firebase 인증 상태를 통해 로그인된 사용자 정보와 Firestore에서 프로필 데이터 가져오기
    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = auth.currentUser;

            if (currentUser) {
                try {
                    // Firestore에서 현재 사용자의 프로필 정보 가져오기
                    const userRef = doc(firestore, "users", currentUser.uid); // 'users' 컬렉션에서 현재 사용자의 문서
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        // 문서가 존재하면 nickname과 name을 상태에 저장
                        setUser({
                            nickname: userDoc.data().nickname || "닉네임 없음", // 닉네임
                            name: userDoc.data().name || "이름 없음", // 이름
                        });
                    } else {
                        console.error("사용자 프로필 문서를 찾을 수 없습니다.");
                    }
                } catch (error) {
                    console.error("사용자 프로필 로드 중 오류 발생:", error);
                }
            }
        };

        fetchUserProfile();
    }, []); // 컴포넌트가 처음 렌더링될 때 실행

    // 로그인 여부 확인 함수
    const ensureLoggedIn = () => {
        if (!auth.currentUser) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/login"); // 로그인 페이지로 이동
            return false;
        }
        return true;
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        try {
            const urls = await Promise.all(files.map((file) => uploadPostImage(file)));
            setImages((prev) => [...prev, ...urls]);
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("사진 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };


    // 글 저장 처리 함수
    const handleSavePost = async () => {
        // 제목과 내용을 입력했는지 확인
        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요!");
            return;
        }

        if (!ensureLoggedIn()) return; // 로그인 확인

        // 선택한 작성자 정보를 설정
        const author = authorType === "nickname" ? user.nickname : user.name;


        try {
            await savePostWithImages({ title, content, author, views: 0 }, images);
            navigate("/community");
        } catch (error) {
            alert("글 저장에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="write-post-wrapper">
            <div className="write-post-container">
                {/* 헤더 영역 */}
                <h2 className="write-post-header">새 글 작성</h2>

                {/* 제목 입력 */}
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // 입력값을 상태에 저장
                        placeholder="글 제목을 입력하세요"
                    />
                </div>

                {/* 내용 입력 */}
                <div className="form-group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {uploading && <p>사진 업로드 중...</p>}
                    <div className="image-preview">
                        {images.map((url, index) => (
                            <img key={index} src={url} alt={`Uploaded ${index}`}/>
                        ))}
                    </div>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)} // 입력값을 상태에 저장
                        placeholder="글 내용을 입력하세요"
                    ></textarea>

                </div>

                {/* 작성자 선택 */}
                <div className="form-group">
                    <label>작성자 표시 설정</label>
                    <div className="author-select">
                        <label>
                            <input
                                type="checkbox"
                                checked={authorType === "nickname"} // 닉네임 선택 여부
                                onChange={() => setAuthorType(authorType === "nickname" ? "" : "nickname")} // 상태 업데이트
                            />
                            닉네임으로 표시하기 ({user.nickname || "로그인 필요"}) {/* Firestore에서 가져온 닉네임 */}
                        </label>
                    </div>
                </div>

                {/* 저장 버튼 */}
                <button className="save-button" onClick={handleSavePost}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default WritePost;