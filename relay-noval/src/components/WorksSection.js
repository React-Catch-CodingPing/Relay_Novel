// src/components/WorksSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './WorksSection.css';

function WorksSection() {
    const [works, setWorks] = useState([]);

    useEffect(() => {
        // API 요청: 나중에 백엔드와 연결 예정
        axios.get('/api/works')
            .then(response => setWorks(response.data))
            .catch(error => console.error("Error fetching works:", error));
    }, []);

    // 임시 데이터 (백엔드 연결 전 사용)
    const placeholderData = [
        {
            id: 1,
            title: '빨간머리 하츄핑',
            description: '처음 본 순간, 하츄는 반해버렸어요! 설레는 운명이 시작된 우연의 첫 만남!',
            image: '/path/to/red-haired.png'
        },
        {
            id: 2,
            title: '아기 티니핑 3형제',
            description: '인생의 수많은 이야기를 함께 나누고 배우는 “우리”만의 특별한 여정!',
            image: '/path/to/baby-tinyping.png'
        }
    ];

    return (
        <section className="works-section">
            <h2>오늘의 작품</h2>
            <p>TOP {works.length || placeholderData.length}</p>
            <div className="works-list">
                {(works.length > 0 ? works : placeholderData).map(work => (
                    <Card
                        key={work.id}
                        title={work.title}
                        description={work.description}
                        image={work.image}
                        link={`/works/${work.id}`} // 작품 상세 페이지 링크
                    />
                ))}
            </div>
        </section>
    );
}

export default WorksSection;
