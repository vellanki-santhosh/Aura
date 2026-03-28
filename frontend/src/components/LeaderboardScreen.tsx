import React from 'react';

export interface LeaderboardItem {
    name: string;
    pts: number;
    you?: boolean;
    promo?: boolean;
    demo?: boolean;
}

export interface LeaderboardScreenProps {
    currentScreen: string;
    lbDomain: string;
    lbData: Record<string, LeaderboardItem[]>;
    points: number;
    userName?: string;
    onDomainChange: (domain: string) => void;
    avatarColor: (name: string) => string;
}

function LeaderboardScreen({
    currentScreen,
    lbDomain,
    lbData,
    points,
    userName,
    onDomainChange,
    avatarColor,
}: LeaderboardScreenProps) {
    return (
        <div className={`screen ${currentScreen === 'leaderboard' ? 'active' : ''} fade-in`}>
            <div className="lb-header">
                <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>🏆 Leaderboard</div>
            </div>
            <div className="lb-domain-select">
                {['Academic', 'Tech', 'Media', 'Events'].map((d) => (
                    <div key={d} className={`domain-chip ${lbDomain === d ? 'active' : ''}`} onClick={() => onDomainChange(d)}>
                        {d}
                    </div>
                ))}
            </div>
            <div id="lb-list">
                {lbData[lbDomain]
                    ?.map((item) => (item.you ? { ...item, name: userName || item.name, pts: points } : item))
                    .sort((a, b) => b.pts - a.pts)
                    .map((item, i) => (
                        <div className={`lb-row ${item.you ? 'you' : ''}`} key={i}>
                            <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}`}>{i + 1}</div>
                            <div style={{ position: 'relative' }}>
                                <div className="avatar sm" style={{ background: avatarColor(item.name) }}>{item.name[0]}</div>
                                {item.you && <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--yellow)', color: '#000', borderRadius: '3px', fontSize: '.5rem', fontWeight: 800, padding: '0 3px' }}>YOU</div>}
                            </div>
                            <div className="lb-name">
                                {item.name} {item.you && <span style={{ fontSize: '.7rem', color: '#999' }}>(you)</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="lb-pts">🪙 {item.pts}</div>
                                {item.promo && <div className="promo-tag">▲ Promo</div>}
                                {item.demo && <div className="demo-tag">▼ Demo</div>}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default LeaderboardScreen;
