import React, {useEffect, useRef, useState} from 'react';
import './Authors.css';
import { getUsers, getAuthorLikeStatus, updateAuthorLike } from "../../../firebase/firestore/userService";
import { auth } from "../../../firebase/firebase";

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [likedByUser, setLikedByUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색 상태 추가
    const [filterTerm, setFilterTerm] = useState(''); // 실제 필터링에 사용될 상태
    const containerRef = useRef(null);

    // 좋아요 클릭 함수
    const handleHeartClick = async (authorId) => {
        if (!auth.currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        const liked = likedByUser.includes(authorId);

        try {
            await updateAuthorLike(auth.currentUser.uid, authorId, liked);
            const updatedAuthors = authors.map((author) => {
                if (author.id === authorId) {
                    return {
                        ...author,
                        hearts: liked ? author.hearts - 1 : author.hearts + 1,
                    };
                }
                return author;
            });
            setAuthors(updatedAuthors);

            if (liked) {
                setLikedByUser(likedByUser.filter((id) => id !== authorId));
            } else {
                setLikedByUser([...likedByUser, authorId]);
            }
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    // Firestore에서 저자 정보 가져오기
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const usersData = await getUsers();
                const currentUserId = auth.currentUser?.uid;

                if (currentUserId) {
                    const likedStatuses = await Promise.all(
                        usersData.map((user) =>
                            getAuthorLikeStatus(currentUserId, user.id)
                        )
                    );

                    const authorsData = usersData.map((user, index) => ({
                        id: user.id,
                        name: user.name || "익명 저자",
                        image: user.profileImage || "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png",
                        participationCount: user.participationCount || 0,
                        startedWorks: user.startedWorks || 0,
                        hearts: user.likes || 0,
                    }));

                    setLikedByUser(
                        authorsData
                            .filter((_, index) => likedStatuses[index])
                            .map((author) => author.id)
                    );

                    setAuthors(authorsData);
                } else {
                    setAuthors(usersData);
                }
            } catch (error) {
                console.error("Error fetching authors:", error);
            }
        };

        fetchAuthors();
    }, []);

    const handleWheelScroll = (event) => {
        const container = containerRef.current;
        if (container) {
            container.scrollLeft += event.deltaY * 1.5; // 마우스 휠로 가로로 스크롤
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheelScroll );
        }
        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheelScroll );
            }
        };
    }, []);

// 검색 입력 필드에서 엔터키 처리
const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        setFilterTerm(searchTerm); // 엔터를 누를 때만 필터 상태 업데이트
}
};

    const filteredAuthors = authors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="authors-container">
            <div className="list-container">
            {/* 검색창 */}
            <div className="search-container">
                <span className="search-icon">
          <i className="fa fa-search"></i>
                 </span>
                <input
                    type="text"
                    placeholder="저자 이름을 검색하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
            </div>

            {/* 저자 카드 슬라이더 */}
            <div className="authors-slider" ref={containerRef}>
                {filteredAuthors.map((author) => (
                    <div key={author.id} className="author-card">
                        <img src={author.image} alt={author.name} />
                        <h3>{author.name}</h3>
                        <p>{author.participationCount}줄 참여 중</p>
                        <p>{author.startedWorks}작품 시작</p>
                        <div className="interaction">
                            <button
                                className="heart-button"
                                onClick={() => handleHeartClick(author.id)}
                            >
                                {likedByUser.includes(author.id) ? '❤️' : '🤍'}
                            </button>
                            <span className="count">{author.hearts}</span>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Authors;
