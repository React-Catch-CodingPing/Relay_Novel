// src/components/NovelCreate.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { useSelector } from "react-redux";
import { addNovelLine } from "../../firebase/firestore/novelService";
import { addLineToNovel } from "../../firebase/firestore/lineService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 관련 메서드 추가
import { storage } from "../../firebase/firebase"; // Storage 객체 가져오기
import "./NovelCreate.css";
import {uploadImage} from "../../firebase/firestore/storageService"; // 일반 CSS 파일로 변경

const NovelCreate = () => {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("로맨스");
    const [firstLine, setFirstLine] = useState("");
    const [lineLimit, setLineLimit] = useState(true);
    const [coverImage, setCoverImage] = useState(null); // 이미지 파일 상태 추가
    const [imagePreview, setImagePreview] = useState(""); // 이미지 미리보기 URL



    const navigate = useNavigate(); // navigate 함수 정의
    const user = useSelector((state) => state.auth.user);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

   const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

       if (!title.trim() || !firstLine.trim()) {
           alert("제목과 첫 줄거리를 입력해주세요.");
           return;
       }

        let coverImageUrl = "";
       if (coverImage) {
           try {
               coverImageUrl = await uploadImage(coverImage, "novelCovers");
           } catch (error) {
               console.error("Error uploading cover image:", error);
               alert("이미지 업로드에 실패했습니다.");
               return;
           }
       }

        const novelData = {
            title: title.trim(),
            genre: genre.trim(),
            firstLine: firstLine.trim(),
            lineLimit: lineLimit ? 100 : null,
            coverImage: coverImageUrl,
            userId: user.uid,
            createdAt: new Date(),
        }

       try {
           // Firestore에 소설 추가
           const novelId = await addNovelLine(novelData);
           console.log("소설이 성공적으로 추가되었습니다. ID:", novelId);

           // 첫 줄 추가 (lines 하위 컬렉션)
           const firstLineData = {
               content: firstLine,
               createdBy: user.uid,
               createdAt: new Date(),
           };
           await addLineToNovel(novelId, firstLineData);
           console.log("첫 줄거리가 추가되었습니다.");

           // 메모리 정리
           if (imagePreview) {
               URL.revokeObjectURL(imagePreview);
           }

           // 페이지 이동
           navigate(`/novels/${novelId}`);
       } catch (error) {
           console.error("소설 추가 중 오류:", error);
           alert("소설 추가 중 문제가 발생했습니다. 다시 시도해주세요.");
       }
   };

    return (
        <div className="create-container">
            <h1 className="title">소설 시작하기</h1>
            <p className="date">{getCurrentDate()} 시작</p>


            <div className="imageUpload">
                <label htmlFor="coverImage">작품 표지</label>
                {imagePreview && (
                <img
                    src={imagePreview}
                    alt={title || "이미지 미리보기"}
                    className="imagePreview"
                />
                )}
                <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                />

            </div>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="작품 제목"
                    required
                    className="input"
                />
                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="select">
                    <option value="로맨스">로맨스</option>
                    <option value="판타지">판타지</option>
                    <option value="일상">일상</option>
                    <option value="공포">공포</option>
                    <option value="코믹">코믹</option>
                    <option value="미스터리">미스터리</option>
                    <option value="액션">액션</option>
                    <option value="스릴러">스릴러</option>
                </select>
                <textarea
                    value={firstLine}
                    onChange={(e) => setFirstLine(e.target.value)}
                    placeholder="첫 줄거리"
                    required
                    className="create-textarea"
                />
                <label className="label">
                    <input
                        type="checkbox"
                        checked={lineLimit}
                        onChange={() => setLineLimit(!lineLimit)}
                    />
                    100줄 제한
                </label>
                <button type="submit" className="start-button">집필 시작</button>
            </form>
        </div>
    );
};

export default NovelCreate;