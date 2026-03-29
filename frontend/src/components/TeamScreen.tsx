import React from 'react';

// Interfaces centralized in App.tsx

import type { TeamChallenge } from '../App';

export interface TeamScreenProps {
    currentScreen: string;
    teamChallenges: TeamChallenge[];
    teamConfettiChallengeId: string | null;
    avatarColor: (name: string) => string;
    onJoinChallenge: (challengeId: string) => void;
}

function TeamScreen({ currentScreen, teamChallenges, teamConfettiChallengeId, avatarColor, onJoinChallenge }: TeamScreenProps) {
    return (
        <div className={`screen ${currentScreen === 'team' ? 'active' : ''} fade-in`}>
            <div className="section-title">👥 Team Challenges</div>
            <div style={{ padding: '0 16px 6px', fontSize: '.82rem', color: '#666', fontWeight: 700 }}>
                Join mission squads, complete goals together, unlock bonus rewards.
            </div>

            <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {teamChallenges.map((challenge) => {
                    const progressPct = Math.min(100, (challenge.completed / challenge.target) * 100);

                    return (
                        <div className="card team-challenge-card" key={challenge.id} style={{ margin: 0, position: 'relative' }}>
                            {teamConfettiChallengeId === challenge.id && (
                                <div className="team-confetti-burst" aria-hidden="true">
{Array.from({ length: 18 }, (_, idx) => {
                                        const uniqueKey = `confetti-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`;
                                        return (
                                            <span
                                                className="team-confetti-dot"
                                                key={uniqueKey}
                                                style={{
                                                    left: `${10 + (idx * 5) % 80}%`,
                                                    animationDelay: `${(idx % 6) * 0.03}s`,
                                                    background: ['#2ecc71', '#ffd63f', '#f9a825', '#22c55e', '#ff8a00'][idx % 5],
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            <div className="card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                    <div style={{ fontWeight: 900, color: 'var(--dark)', fontSize: '.96rem' }}>{challenge.title}</div>
                                    <span className="badge-pill badge-yellow" style={{ margin: 0 }}>{challenge.domain}</span>
                                </div>

                                <div style={{ fontSize: '.74rem', color: '#666', fontWeight: 700 }}>Deadline: {challenge.deadline}</div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 800 }}>
                                    <span>Progress</span>
                                    <span>{challenge.completed}/{challenge.target} done</span>
                                </div>
                                <div style={{ background: '#f0f0f0', borderRadius: '10px', height: '10px', overflow: 'hidden', marginBottom: 0 }}>
                                    <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--yellow), var(--yellow-dark))', borderRadius: '10px', width: `${progressPct}%`, transition: 'width 0.8s ease' }}></div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {challenge.members.map((member) => (
                                        <div
                                            key={member.name}
                                            title={member.name}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: avatarColor(member.name),
                                                color: '#111',
                                                fontWeight: 900,
                                                fontSize: '.68rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #fff',
                                                boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                                            }}
                                        >
                                            {member.initials}
                                        </div>
                                    ))}
                                </div>

                                <button className="btn btn-yellow" style={{ width: '100%' }} onClick={() => onJoinChallenge(challenge.id)}>
                                    Join Challenge
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TeamScreen;
