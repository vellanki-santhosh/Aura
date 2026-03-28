import React from 'react';

export interface BottomNavProps {
    currentScreen: string;
    userRole?: 'student' | 'admin';
    onNavigate: (screen: string) => void;
}

function BottomNav({ currentScreen, userRole, onNavigate }: BottomNavProps) {
    return (
        <div className="bottom-nav">
            <button className={`nav-item ${currentScreen === 'path' ? 'active' : ''}`} onClick={() => onNavigate('path')}>
                <span className="nav-icon">🧭</span>Path
            </button>
            {userRole === 'student' && (
                <button className={`nav-item ${currentScreen === 'events' ? 'active' : ''}`} onClick={() => onNavigate('events')}>
                    <span className="nav-icon">📅</span>Events
                </button>
            )}
            <button className={`nav-item ${currentScreen === 'leaderboard' ? 'active' : ''}`} onClick={() => onNavigate('leaderboard')}>
                <span className="nav-icon">🏆</span>Leaderboard
            </button>
            <button className={`nav-item ${currentScreen === 'users' ? 'active' : ''}`} onClick={() => onNavigate('users')}>
                <span className="nav-icon">👥</span>Users
            </button>
            <button className={`nav-item ${currentScreen === 'team' ? 'active' : ''}`} onClick={() => onNavigate('team')}>
                <span className="nav-icon">👨‍👩‍👧‍👦</span>Team
            </button>
            {userRole === 'admin' && (
                <button className={`nav-item ${currentScreen === 'admin' ? 'active' : ''}`} onClick={() => onNavigate('admin')}>
                    <span className="nav-icon">🔑</span>Approvals
                </button>
            )}
            {userRole === 'student' && (
                <button className={`nav-item ${currentScreen === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}>
                    <span className="nav-icon">⚙️</span>Settings
                </button>
            )}
            <button className={`nav-item ${currentScreen === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
                <span className="nav-icon">👤</span>Profile
            </button>
        </div>
    );
}

export default React.memo(BottomNav);
