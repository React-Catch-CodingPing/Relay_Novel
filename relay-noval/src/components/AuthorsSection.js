// src/components/AuthorsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './AuthorsSection.css';

function AuthorsSection() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        // API 요청: 나중에 백엔드와 연결 예정
        axios.get('/api/authors')
            .then(response => setAuthors(response.data))
            .catch(error => console.error("Error fetching authors:", error));
    }, []);

    // 임시 데이터 (백엔드 연결 전 사용)
    const placeholderData = [
        { id: 1, name: '부끄핑', novels: 13, image: '/path/to/bukkeuping.png' },
        { id: 2, name: '차나핑', novels: 10, image: '/path/to/chanaping.png' },
        { id: 3, name: '하츄핑', novels: 4, image: '/path/to/hachuping.png' }
    ];

    return (
        <section className="authors-section">
            <h2>오늘의 저자</h2>
            <p>TOP {authors.length || placeholderData.length}</p>
            <div className="authors-list">
                {(authors.length > 0 ? authors : placeholderData).map(author => (
                    <Card
                        key={author.id}
                        title={author.name}
                        description={`오늘 참여한 소설: ${author.novels}`}
                        image={author.image}
                        link={`/authors/${author.id}`} // 저자 상세 페이지 링크
                    />
                ))}
            </div>
        </section>
    );
}

export default AuthorsSection;
