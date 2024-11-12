// src/components/AuthorsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from '../ProfileCards/ProfileCard';
import './AuthorsSection.css';

function AuthorsSection() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        axios.get('/api/authors')
            .then(response => setAuthors(response.data))
            .catch(error => console.error("Error fetching authors:", error));
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

export default AuthorsSection;
