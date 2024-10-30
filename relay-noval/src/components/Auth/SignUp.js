// 회원가입 화면 및 기능을 담당하는 컴포넌트.

// src/components/Auth/SignUp.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../store/authSlice";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signUp({ email, password }));
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                <button type="submit" disabled={loading}>회원가입</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignUp;
