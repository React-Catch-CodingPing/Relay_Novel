// 로그인 화면 및 기능을 담당하는 컴포넌트.

// src/components/Auth/SignIn.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom"; // 리디렉션 기능
import "./SignIn.css"; // 스타일링 파일


const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate(); // navigate 정의
    const { loading, error, user } = useSelector((state) => state.auth); // user 추가


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signIn({ email, password }));
    };

    // 로그인 성공 시 MainPage 페이지로 이동
    if (user) {
        navigate("/"); // 로그인 후 홈 페이지로 리디렉션
    }

    return (
        <div className="signin-wrapper">
            <div className="signin-container">
                <h2>로그인</h2>
                <form onSubmit={handleSubmit} className="signin-form">
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
                    <button type="submit" disabled={loading}>로그인</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {/* 회원가입 링크 추가 */}
                <Link to="/signup" className="signup-link">회원가입</Link>
            </div>
        </div>
    );
};

export default SignIn;
