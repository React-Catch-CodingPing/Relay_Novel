// 관리자 계정에 대해
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import './Admin.css';

function Admin() {
    const [reports, setReports] = useState([]);

    // 신고 목록 가져오기
    const fetchReports = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "reports"));
            const reportsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReports(reportsData);
        } catch (error) {
            console.error("신고 목록을 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchReports(); // 컴포넌트 로드 시 신고 목록 가져오기
    }, []);

    // 신고 삭제
    const handleDelete = async (reportId) => {
        try {
            await deleteDoc(doc(firestore, "reports", reportId));
            setReports(reports.filter((report) => report.id !== reportId)); // 상태 업데이트
            alert("신고가 삭제되었습니다.");
        } catch (error) {
            console.error("신고 삭제 중 오류 발생:", error);
            alert("신고 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="admin-page">
            <h1>📋 어드민 신고 관리</h1>
            {reports.length > 0 ? (
                <ul className="report-list">
                    {reports.map((report) => (
                        <li key={report.id} className="report-item">
                            <p><strong>신고자:</strong> {report.reporter}</p>
                            <p><strong>내용:</strong> {report.content}</p>
                            <p><strong>접수 시간:</strong> {report.createdAt?.toDate().toLocaleString() || "시간 정보 없음"}</p>
                            <button onClick={() => handleDelete(report.id)} className="delete-button">
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>현재 접수된 신고가 없습니다.</p>
            )}
        </div>
    );
}

export default Admin;
