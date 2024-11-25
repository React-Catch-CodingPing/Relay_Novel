// src/components/WritingGuide/WritingGuide.js
import React from 'react';
import './WritingGuide.css';

function WritingGuide() {
    // 가이드 카드에 표시될 내용
    const guides = [
        {
            title: '캐릭터 설정하기',
            description: '캐릭터의 배경, 목표, 성격을 설정하여 독자에게 매력적인 캐릭터를 소개하세요.',
        },
        {
            title: '스토리 구조화하기',
            description: '스토리의 시작, 중간, 끝을 잘 계획하여 독자가 몰입할 수 있도록 만드세요.',
        },
        {
            title: '시간 관리하기',
            description: '창작 시간을 정해두고 규칙적으로 창작해보세요. 꾸준함이 창작의 원동력입니다.',
        },
        {
            title: '독창적인 아이디어 찾기',
            description: '독창적인 아이디어는 일상 속에서 얻을 수 있습니다. 메모해두는 습관을 가지세요.',
        },
        {
            title: '피드백 받아들이기',
            description: '다른 사람의 피드백을 적극적으로 수용하고, 창작물에 반영해보세요.',
        },
        {
            title: '주제에 집중하기',
            description: '이야기에서 전달하고 싶은 메시지를 설정하고, 주제에 집중하여 일관성 있는 스토리를 만드세요.',
        },
        {
            title: '생생한 대화 만들기',
            description: '캐릭터의 개성을 반영한 자연스러운 대화를 작성하여 이야기의 현실감을 높이세요.',
        },
        {
            title: '감정 표현 강화하기',
            description: '감정 표현을 강화하여 독자가 캐릭터의 기쁨, 슬픔, 긴장 등을 공감할 수 있게 만드세요.',
        },
    ];

    return (
        <section className="writing-guide-container">
            <h1>창작 가이드 </h1>
            <p>한 줄 소설 창작에 도움이 되는 다양한 팁을 확인해보세요</p>

            <div className="guide-cards">
                {guides.map((guide, index) => (
                    <div key={index} className="guide-card">
                        <h3>{guide.title}</h3>
                        <p>{guide.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WritingGuide;