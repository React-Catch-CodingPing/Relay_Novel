// src/components/NavbarContents/Community/Community.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import "./Community.css";
import {fetchPosts, incrementPostViews} from "../../../firebase/firestore/communityService";

function Community() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // 현재 로그인된 사용자 상태
    const [posts, setPosts] = useState([]); // 커뮤니티 글 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const itemsPerPage = 6; // 페이지당 항목 수

    // Firebase 인증 상태 변경 감지
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                // Firestore에서 사용자 세부 정보 가져오기
                setUser({
                    name: currentUser.displayName || "이름 없음",
                    nickname: currentUser.email.split("@")[0], // 이메일 앞부분을 닉네임으로 설정
                });
            } else {
                setUser(null); // 로그아웃 시 사용자 상태 초기화
            }
        });

        return () => unsubscribe();
    }, []);

    // Firestore에서 커뮤니티 글 가져오기
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true); // 로딩 상태 시작
            try {
                const fetchedPosts = await fetchPosts(); // Service 함수 호출
                setPosts(fetchedPosts);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);



    // 현재 페이지에 해당하는 글 필터링
    const currentPosts = posts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 텍스트 길이 제한 함수
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text; // 제한 길이보다 짧으면 그대로 반환
        return text.substring(0, maxLength) + "..."; // 길이를 제한하고 ... 추가
    };


    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지 상태 업데이트
    };

    return (
        <div className="community-container">
            {/* 헤더 영역 */}
            <header className="community-header">
                <h2> 커뮤니티 </h2>
            </header>


            {/* 게시물 리스트 영역 */}
            <main className="community-main">
                {loading ? (
                    // 로딩 상태 표시
                    <p>Loading...</p>
                ) : posts.length > 0 ? (
                    // 게시물 리스트
                    <div className="posts-grid">
                        {currentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="post-card"
                                onClick={async () => {
                                    if (!auth.currentUser) {
                                        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
                                        navigate("/login");
                                        return;
                                    }

                                    await incrementPostViews(post.id, posts); // Service 함수 호출
                                    navigate(`/community/${post.id}`);
                                }}
                            >
                                {/* 작성자 표시 */}
                                <div className="post-meta">
                                    <div className="post-author">{post.author}</div>
                                    <div className="post-date">{post.date}</div>
                                    {/*<div>조회수 : {post.views || 0} </div>*/}
                                </div>

                                {/* 구분선 */}


                                {/* 제목 */}
                                <h3>{post.title}</h3>
                                <hr className="post-divider"/>
                                {/* 본문 */}
                                <div className="post-content">
                                    <p>{truncateText(post.content, 45)}</p> {/* 글자를 제한함 */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // 데이터가 없을 때 표시
                    <p>데이터가 없습니다.</p>
                )}
            </main>
            <div className="footer-container">
                {/* 글쓰기 버튼 */}
                <button
                    className="write-button"
                    onClick={() => navigate("/community/write")}
                >
                    글쓰기
                </button>
                {/* 페이지네이션 영역 */}
                <div className="pagination">
                    {/* 이전 버튼 */}
                    <button
                        className="pagination-button"
                        disabled={currentPage === 1} // 첫 페이지에서는 비활성화
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        &laquo;
                    </button>
                    {/* 페이지 번호 */}
                    {Array.from(
                        {length: Math.ceil(posts.length / itemsPerPage)},
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            className={currentPage === page ? "active" : ""} // 활성화 상태 스타일 적용
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    {/* 다음 버튼 */}
                    <button
                        className="pagination-button"
                        disabled={currentPage === Math.ceil(posts.length / itemsPerPage)} // 마지막 페이지에서는 비활성화
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        &raquo;
                    </button>
                </div>
            </div>
        </div>

    );

}

export default Community;