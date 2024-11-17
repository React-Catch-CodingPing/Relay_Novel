import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ParticipateCard from '../ParticipateCard/ParticipateCard'; // 정확한 상대 경로 확인
import './WorksSection.css';

function WorksSection() {
    const [works, setWorks] = useState([]);

    useEffect(() => {
        axios.get('/api/works')
            .then(response => setWorks(response.data))
            .catch(error => console.error("Error fetching works:", error));
    }, []);

    const placeholderData = [
        { id: 1, title: '빨간머리 하츄핑', description: '설레는 첫 만남!', image: '/path/to/red-haired.png' },
        { id: 2, title: '아기 티니핑 3형제', description: '특별한 여정!', image: '/path/to/baby-tinyping.png' }
    ];

    return (
        <section className="works-section">
            <h2>오늘의 작품</h2>
            <div className="works-list">
                {(works.length > 0 ? works : placeholderData).map(work => (
                    <ParticipateCard
                        key={work.id}
                        title={work.title}
                        description={work.description}
                        image={work.image}
                        link={`/works/${work.id}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default WorksSection;
