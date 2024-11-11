// 로그아웃 화면 및 기능을 담당하는 컴포넌트.

// src/components/Auth/SignOut.js
import React from 'react';
import './SignOut.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase에서 로그아웃 수행
            dispatch(setUser(null)); // Redux 상태 초기화
            navigate('/login'); // 로그인 페이지로 이동
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <div className="signout-container">
            <div className="signout-card">
                <h2>로그아웃</h2>
                <p>로그아웃하시겠습니까?</p>
                <button className="signout-button" onClick={handleLogout}>
                    로그아웃
                </button>
                <button className="cancel-button" onClick={() => navigate(-1)}>
                    취소
                </button>
            </div>
        </div>
    );
};

export default SignOut;
