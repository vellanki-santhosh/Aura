import React from 'react';

// Interfaces centralized in App.tsx

import type { UserData } from '../App';

export interface UsersScreenProps {
    currentScreen: string;
    userSearch: string;
    userFilterDomain: string;
    filteredUsers: UserData[];
    avatarColor: (name: string) => string;
    onSearchChange: (value: string) => void;
    onFilterChange: (domain: string) => void;
    onUserClick: (user: UserData) => void;
}

function UsersScreen({
    currentScreen,
    userSearch,
    userFilterDomain,
    filteredUsers,
    avatarColor,
    onSearchChange,
    onFilterChange,
    onUserClick,
}: UsersScreenProps) {
    return (
        <div className={`screen ${currentScreen === 'users' ? 'active' : ''} fade-in`}>
            <div className="section-title">👥 Contributors Directory</div>
            <div className="search-bar">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Search by Name, Domain, or Badge..."
                    value={userSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div style={{ padding: '4px 16px 8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Tech', 'Academic', 'Engagement'].map((d) => (
                    <div key={d} className={`domain-chip ${userFilterDomain === d ? 'active' : ''}`} onClick={() => onFilterChange(d)}>
                        {d}
                    </div>
                ))}
            </div>
            <div id="users-list">
                {filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '.9rem' }}>No contributors found 😕</div>
                ) : (
                    filteredUsers.map((u, i) => (
                        <div className="user-row" key={i} onClick={() => onUserClick(u)}>
                            <div className="avatar" style={{ background: avatarColor(u.name) }}>{u.initials}</div>
                            <div className="user-info">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div className="user-name">{u.name}</div>
                                    <div className="pts-chip">🪙 {u.pts}</div>
                                </div>
                                <div className="user-role">{u.role}</div>
                                <div className="user-badges">{u.badges.map((b, bi) => <span className="badge-pill badge-green" key={bi}>{b}</span>)}</div>
                                <div className={`avail-tag ${u.available ? 'avail-yes' : 'avail-no'}`}>
                                    {u.available ? '✅ Available for Peer Review' : '⛔ Not Available'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UsersScreen;
