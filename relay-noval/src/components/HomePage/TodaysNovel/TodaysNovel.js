import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import './TodaysNovel.css';

function TodaysNovel() {
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

export default TodaysNovel;
