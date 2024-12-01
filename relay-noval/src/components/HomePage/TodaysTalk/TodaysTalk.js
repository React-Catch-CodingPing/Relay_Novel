import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../firebase/firebase";
import "./TodaysTalk.css";

function TodaysTalk() {
    const [talks, setTalks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTalks = async () => {
            try {
                // Firestore에서 커뮤니티 글 3개만 가져오기
                const talksQuery = query(
                    collection(firestore, "communityPosts"),
                    orderBy("createdAt", "desc"),
                    limit(3)
                );
                const querySnapshot = await getDocs(talksQuery);
                const talksData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTalks(talksData);
            } catch (error) {
                console.error("Error fetching talks:", error);
            }
        };

        fetchTalks();
    }, []);

    return (
        <section className="talks-section">
            <h2>💬 오늘의 수다 💬</h2>
            <div className="talks-list">
                {talks.map((talk) => (
                    <div key={talk.id} className="talk-card">
                        <h3>{talk.title}</h3>
                        <p>{talk.author}</p>
                        <p>
                            {talk.content.length > 50
                                ? talk.content.substring(0, 50) + "..."
                                : talk.content}
                        </p>
                        <button
                            className="view-button"
                            onClick={() => navigate(`/community/${talk.id}`)}
                        >
                            보기
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TodaysTalk;
