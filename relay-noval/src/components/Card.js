// src/components/Card.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

function Card({ title, description, image, link, buttonText }) {
    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                <Link to={link}>
                    <button className="view-button">{buttonText}</button>
                </Link>
            </div>
        </div>
    );
}

export default Card;
