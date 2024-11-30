import React from 'react';

const AuthorCard = ({ author }) => {
    const handleProfileClick = () => {
        alert(`${author.name}님의 프로필을 확인합니다.`);
    };

    return (
        <div style={styles.card}>
            <img src={author.image} alt={author.name} style={styles.image} />
            <h3>{author.name}</h3>
            <p>{author.description}</p>
            <button onClick={handleProfileClick} style={styles.button}>
                프로필 보기
            </button>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    image: {
        width: '100%',
        borderRadius: '50%',
        marginBottom: '8px',
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default AuthorCard;
