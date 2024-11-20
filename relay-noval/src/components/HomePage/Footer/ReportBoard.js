import React, { useState } from 'react';
import './ReportBoard.css';

function ReportBoard() {
    const [reportContent, setReportContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // 신고 내용 제출 로직 (추후 서버와 연결 가능)
        console.log("신고 내용:", reportContent);
        setReportContent(""); // 입력 필드 초기화
        alert("신고가 접수되었습니다.");
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
