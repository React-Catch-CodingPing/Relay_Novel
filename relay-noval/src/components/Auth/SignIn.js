// 로그인 화면 및 기능을 담당하는 컴포넌트.

// src/components/Auth/SignIn.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/authSlice";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signIn({ email, password }));
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                <button type="submit" disabled={loading}>로그인</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignIn;
