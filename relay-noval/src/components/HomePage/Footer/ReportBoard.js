import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase/firebase';
import './ReportBoard.css';

function ReportBoard() {
    const [reportContent, setReportContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reportData = {
                reporter: auth.currentUser?.email || "익명 사용자", // 신고자 이메일
                content: reportContent, // 신고 내용
                createdAt: serverTimestamp(), // 신고 접수 시간
            };

            // Firestore에 데이터 추가
            await addDoc(collection(firestore, "reports"), reportData);

            setReportContent(""); // 입력 필드 초기화
            alert("신고가 접수되었습니다.");
        } catch (error) {
            console.error("신고 접수 중 오류:", error);
            alert("신고 접수에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="report-board">
            <h1>🚨 신고 게시판</h1>
            <form onSubmit={handleSubmit} className="report-form">
                <label htmlFor="reportText">신고 내용을 입력하세요:</label>
                <textarea
                    id="reportText"
                    placeholder="신고 사유를 상세히 작성해주세요."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    required
                ></textarea>
                <button type="submit">신고 접수</button>
            </form>
        </div>
    );
}

export default ReportBoard;
