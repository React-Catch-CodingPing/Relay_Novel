// src/components/Novel/NovelItem.js
import React from "react";

const NovelItem = ({ novel, handleDelete }) => {
    return (
        <div>
            <h3>{novel.title}</h3>
            <p>장르: {novel.genre}</p>
            <p>첫 줄: {novel.firstLine}</p>
            <button onClick={() => handleDelete(novel.id)}>삭제</button>
        </div>
    );
};

export default NovelItem;
