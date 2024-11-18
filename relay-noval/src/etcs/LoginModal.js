// src/components/LoginModal.js
import React, { useState } from "react";
import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        // Firebase 로그인 로직 (예: signInWithEmailAndPassword 사용)
        try {
            // await signInWithEmailAndPassword(auth, email, password);
            onClose(); // 로그인 성공 시 모달 닫기
        } catch (error) {
            console.error("로그인 오류:", error);
            setError("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
            <div className="modal-content">
                <h2>로그인</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                    />
                    {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
                    <div className="button-group">
                        <button type="submit">로그인</button>
                        <button type="button" onClick={onClose}>닫기</button>
                    </div>
                </form>
            </div>
        </div>
);
};

export default LoginModal;
