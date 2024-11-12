// src/components/ParticipateCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateCard.css';

function ParticipateCard({ title, description, image, link }) {
    return (
        <div className="participate-card">
            <img src={image} alt={title} className="participate-card-image" />
            <div className="participate-card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                <Link to={link}>
                    <button className="participate-button">참여하기</button>
                </Link>
            </div>
        </div>
    );
}

export default ParticipateCard;
