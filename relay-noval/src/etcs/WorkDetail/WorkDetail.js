import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './WorkDetail.css';

function WorkDetail() {
    const { id } = useParams(); // 작품 ID를 URL에서 가져옵니다.
    const [work, setWork] = useState(null);
    const [newSentence, setNewSentence] = useState(''); // 새 문장 입력

    useEffect(() => {
        // Placeholder 데이터
        const works = {
            1: {
                id: 1,
                title: '빨간머리 하츄핑',
                imageUrl: '/path/to/red-haired.png',
                content: [
                    { user: '유저1', text: '하츄핑은 고요한 숲 속 마을에서 평화로운 일상을 보내고 있었습니다. 그러나 어느 날 마을 광장 한가운데서 기묘한 빛이 하츄핑의 빨간 머리를 비추기 시작했습니다.' },
                    { user: '유저2', text: '마을 원로들은 그 빛이 오래된 전설에 나오는 "붉은 여명의 상징"이라며 하츄핑에게 경고했습니다.' },
                    { user: '유저3', text: '하츄핑은 그 말을 듣고 혼란스러웠지만, 마음 속 깊은 곳에서는 자신이 이 운명을 받아들여야 한다는 생각이 들었습니다.' },
                    { user: '유저4', text: '결국 하츄핑은 결심했습니다. 마을을 떠나 전설에 나오는 고대 사원의 비밀을 밝혀내기로 한 것입니다.' },
                    { user: '유저5', text: '여정의 첫 번째 목적지는 "에메랄드 폭포"였습니다. 전설에 따르면 폭포의 밑바닥에는 고대 사원으로 들어가는 숨겨진 길이 있다고 했습니다.' },
                    { user: '유저6', text: '길을 걷던 하츄핑은 우연히 숲 속에서 여행자 "알바르"를 만나게 됩니다. 알바르는 신비한 금색 활을 가진 사냥꾼이었고, 하츄핑의 이야기를 듣고 동행을 결심합니다.' },
                ],
            },
            2: {
                id: 2,
                title: '아기 티니핑 3형제',
                imageUrl: '/path/to/baby-tinyping.png',
                content: [
                    { user: '유저1', text: '아기 티니핑 3형제는 행복한 나날을 보내고 있었습니다. 하지만 갑작스러운 폭풍이 마을을 덮치면서 모든 것이 변하기 시작했습니다.' },
                    { user: '유저2', text: '3형제는 폭풍 속에서 가족들을 보호하기 위해 특별한 능력을 발휘하기 시작했습니다.' },
                    { user: '유저3', text: '그 과정에서 3형제는 자신의 능력이 단순한 힘이 아니라 고대 마법과 연결되어 있음을 알게 됩니다.' },
                    { user: '유저4', text: '마법의 비밀을 풀기 위해 그들은 "크리스탈 동굴"로 향했습니다. 그곳에서 그들의 부모님이 남긴 단서를 발견했습니다.' },
                    { user: '유저5', text: '그러나 동굴 깊은 곳에서 "어둠의 파수꾼"이 그들을 기다리고 있었습니다. 그는 그들의 마법을 이용해 세상을 장악하려 했습니다.' },
                    { user: '유저6', text: '티니핑 3형제는 협력하여 어둠의 파수꾼과 대결했습니다. 그들은 가족의 힘과 믿음이 가장 강한 마법이라는 것을 깨달았습니다.' },
                ],
            },
        };

        // ID에 따라 작품 선택
        setWork(works[id]);
    }, [id]);

    const handleAddSentence = () => {
        if (newSentence.trim() === '') {
            alert('내용을 입력해주세요!');
            return;
        }

        // 새로운 문장을 추가
        setWork((prev) => ({
            ...prev,
            content: [...prev.content, { user: '현재유저', text: newSentence }],
        }));
        setNewSentence(''); // 입력란 초기화
    };

    return (
        <div className="work-detail">
            {work ? (
                <div className="work-detail-container">
                    {/* 이미지 추가 */}
                    <img src={work.imageUrl} alt={work.title} className="work-image" />
                    <h2 className="work-title">{work.title}</h2>
                    <hr className="divider" />
                    <div className="work-content-area">
                        {/* 소설 내용 표시 */}
                        {work.content.map((sentence, index) => (
                            <p key={index} className="work-sentence">
                                <span className="sentence-user">{sentence.user}:</span> {sentence.text}
                            </p>
                        ))}
                    </div>
                    <hr className="divider" />
                    {/* 새 문장 추가 영역 */}
                    <div className="add-sentence-area">
                        <textarea
                            className="new-sentence-textarea"
                            value={newSentence}
                            onChange={(e) => setNewSentence(e.target.value)}
                            placeholder="새로운 문장을 입력하세요..."
                            rows="2"
                        />
                        <button className="add-sentence-button" onClick={handleAddSentence}>
                            문장 추가
                        </button>
                    </div>
                </div>
            ) : (
                <p>작품을 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default WorkDetail;
