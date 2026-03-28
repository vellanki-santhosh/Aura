import React from 'react';

export interface ProfileUser {
    name: string;
    rollNo: string;
    domain: string;
    role: 'student' | 'admin';
}

export interface BadgeItem {
    icon: string;
    name: string;
    earned: boolean;
}

export interface ActivityItem {
    time: string;
    text: string;
    pts: string;
}

export interface ProfileScreenProps {
    currentScreen: string;
    user: ProfileUser | null;
    animatedProfilePoints: number;
    streak: number;
    points: number;
    badgesData: BadgeItem[];
    activityData: ActivityItem[];
    onBadgeClick: (badgeName: string) => void;
    onShareLinkedIn: () => void;
    onLogout: () => void;
    FlameIcon: React.ComponentType<{ hot: boolean }>;
}

function ProfileScreen({
    currentScreen,
    user,
    animatedProfilePoints,
    streak,
    points,
    badgesData,
    activityData,
    onBadgeClick,
    onShareLinkedIn,
    onLogout,
    FlameIcon,
}: ProfileScreenProps) {
    return (
        <div className={`screen ${currentScreen === 'profile' ? 'active' : ''} fade-in`}>
            <div className="profile-hero">
                <div className="avatar lg" style={{ margin: '0 auto', background: 'rgba(0,0,0,.15)', color: 'var(--dark)' }}>{user?.name[0] || 'U'}</div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-title">{user?.rollNo} • {user?.domain} {user?.role === 'admin' ? '(Admin)' : ''}</div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>{animatedProfilePoints}</div><div style={{ fontSize: '.72rem', opacity: .7 }}>Points</div></div>
                    <div style={{ width: '1px', background: 'rgba(0,0,0,.15)' }}></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>3</div><div style={{ fontSize: '.72rem', opacity: .7 }}>Badges</div></div>
                    <div style={{ width: '1px', background: 'rgba(0,0,0,.15)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="profile-streak-value" style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}><FlameIcon hot={streak > 7} />{streak}</div>
                        <div style={{ fontSize: '.72rem', opacity: .7 }}>Streak</div>
                    </div>
                </div>
            </div>
            <div className="progress-block">
                <div className="progress-label"><span>Overall Progress → Level 2: Leader</span><span>{points}/1000 pts</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(points / 1000) * 100}%` }}></div></div>
                <div className="progress-label"><span>Current Domain: {user?.domain}</span><span>250/500 pts</span></div>
                <div className="progress-bar"><div className="progress-fill yellow" style={{ width: '50%' }}></div></div>
            </div>
            <div className="section-title">🎖️ Badges</div>
            <div className="badges-grid">
                {badgesData.map((b, i) => (
                    <div className={`badge-item ${b.earned ? '' : 'locked-badge'}`} key={i} onClick={() => b.earned && onBadgeClick(b.name)}>
                        <div className="badge-icon">{b.icon}</div>
                        <div className="badge-name">{b.name}</div>
                    </div>
                ))}
            </div>
            <div className="section-title">📋 Recent Validations</div>
            <div id="activity-list">
                {activityData.map((a, i) => (
                    <div className="activity-row" key={i}><div className="time">{a.time}</div><div className="act-text">✅ {a.text}</div><div className="act-pts">{a.pts}</div></div>
                ))}
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn" style={{ width: '100%', background: '#0A66C2', color: '#fff' }} onClick={onShareLinkedIn}>
                    Share Contribution on LinkedIn
                </button>
                <button className="btn btn-outline" style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }} onClick={onLogout}>🚪 Logout</button>
            </div>
        </div>
    );
}

export default ProfileScreen;
