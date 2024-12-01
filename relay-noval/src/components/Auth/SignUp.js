// src/components/Auth/SignUp.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../store/authSlice";
import "./SignUp.css"; // 스타일링 파일

const SignUp = () => {
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [useNickname, setUseNickname] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signUp({ name, nickname, useNickname, email, password }));
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름"
                        required
                    />
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                        required
                    />
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={useNickname}
                            onChange={(e) => setUseNickname(e.target.checked)}
                        />
                        <label>닉네임으로 표시하기</label>
                    </div>
                    <p className="info-text">가입 후 프로필에서 변경가능.</p> {/* 안내 문구 수정 */}
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
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {name === "admin" && nickname === "admin" ? "관리자 계정 생성" : "회원가입"}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {user && <p>{user.email} 님 회원가입 성공입니다!</p>}
            </div>
        </div>
    );
};

export default SignUp;
