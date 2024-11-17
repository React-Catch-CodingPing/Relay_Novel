// src/components/TodaysAuthors.js
import React, { useEffect, useState } from 'react';
import ProfileCard from '../ProfileCards/ProfileCard';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import "./TodaysAuthors.css";


function TodaysAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'users'))
                const authorsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAuthors(authorsData);
            } catch (error) {
                console.error("Error fetching authors:", error);
            }
        };

        fetchAuthors();
    }, []);

    const placeholderData = [
        { id: 1, name: '부끄핑', novels: 13, image: '/path/to/bukkeuping.png' },
        { id: 2, name: '차나핑', novels: 10, image: '/path/to/chanaping.png' },
        { id: 3, name: '하츄핑', novels: 4, image: '/path/to/hachuping.png' }
    ];

    return (
        <section className="authors-section">
            <h2>오늘의 저자</h2>
            <div className="authors-list">
                {(authors.length > 0 ? authors : placeholderData).map(author => (
                    <ProfileCard
                        key={author.id}
                        name={author.name}
                        novels={author.novels}
                        image={author.image}
                        link={`/authors/${author.id}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default TodaysAuthors;
