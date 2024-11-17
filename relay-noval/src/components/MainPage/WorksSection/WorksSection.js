import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import axios from 'axios';
import ParticipateCard from '../ParticipateCard/ParticipateCard'; // 정확한 상대 경로 확인
import './WorksSection.css';

function WorksSection() {
    const [works, setWorks] = useState([]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                // Firestore의 "novels" 컬렉션에서 데이터 가져오기
                const querySnapshot = await getDocs(collection(firestore, 'novels'));
                const worksData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setWorks(worksData);
            } catch (error) {
                console.error("Error fetching works:", error);
            }
        };

        fetchWorks();
    }, []);

    const placeholderData = [
        { id: 1, title: '빨간머리 하츄핑', description: '설레는 첫 만남!', image: '/path/to/red-haired.png' },
        { id: 2, title: '아기 티니핑 3형제', description: '특별한 여정!', image: '/path/to/baby-tinyping.png' }
    ];

    return (
        <section className="works-section">
            <h2>오늘의 작품</h2>
            <div className="works-list">
                {works.map(work => (
                    <div key={work.id} className="work-card">
                        <h3>{work.title}</h3>
                        <p>{work.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WorksSection;
