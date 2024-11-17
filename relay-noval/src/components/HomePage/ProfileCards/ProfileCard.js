// src/components/ProfileCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileCard.css';

function ProfileCard({ name, novels, image, link }) {
    return (
        <div className="profile-card">
            <img src={image} alt={name} className="profile-card-image" />
            <div className="profile-card-content">
                <h3>{name}</h3>
                <p>오늘 참여한 소설: {novels}</p>
                <Link to={link}>
                    <button className="profile-button">프로필보기</button>
                </Link>
            </div>
        </div>
    );
}

export default ProfileCard;
