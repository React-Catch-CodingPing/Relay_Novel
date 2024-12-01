import React, { useState, useEffect } from "react";
import ProfileCard from '../ProfileCards/ProfileCard';
import {
    getUsers,
    getTodayStartedNovels,
    getTodayParticipatedNovels,
} from "../../../firebase/firestore/userService";
import "./TodaysAuthors.css";

function TodaysAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchAuthorsData = async () => {
            try {
                const users = await getUsers();
                const authorsData = await Promise.all(
                    users.map(async (user) => {
                        const todayParticipatedNovels = await getTodayParticipatedNovels(user.id);
                        const todayStartedNovels = await getTodayStartedNovels(user.id);

                        return {
                            id: user.id,
                            name: user.nickname || user.name || "익명 저자",
                            todayParticipatedNovels: todayParticipatedNovels.length,
                            todayStartedNovels: todayStartedNovels.length,
                            image: user.profileImage || "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png",
                        };
                    })
                );

                const topAuthors = authorsData
                    .sort((a, b) => b.todayParticipatedNovels - a.todayParticipatedNovels)
                    .slice(0, 3);

                setAuthors(topAuthors);
            } catch (error) {
                console.error("Error fetching authors data:", error);
            }
        };

        fetchAuthorsData();
    }, []);

    return (
        <section className="authors-section">
            <div>
            <h2>✨오늘의 저자✨</h2>
            <div className="authors-list">
                {authors.map((author) => (
                    <ProfileCard
                        key={author.id}
                        name={author.name}
                        todayParticipatedNovels={author.todayParticipatedNovels}
                        todayStartedNovels={author.todayStartedNovels}
                        image={author.image}
                        link={`/authors/${author.id}`}
                    />
                ))}
            </div>
            </div>
        </section>
    );
}

export default TodaysAuthors;
