import React, { Suspense } from 'react';
import type { PathNode, UserData, AdminQueueItem, Event, SurpriseMission, TeamChallenge, LiveTickerItem, ModalState } from '../App';
import type { LeaderboardEntry } from '../data/mockData';

// Unified Yellow Color Palette
const COLORS = {
    primary: '#FFD600',      // Pure bright yellow
    secondary: '#FFC107',    // Amber yellow
    light: '#FEF8E7',        // Very light cream
    background: '#FFFEF0',   // Light warm background
    text: '#2C3E50',         // Dark text
    textLight: '#666',       // Light text
    border: '#FFB300',       // Dark yellow
    success: '#1ABB9C',      // Teal for success
    accent: '#3498DB',       // Blue for accent
    hover: '#FFC107'         // Bright amber yellow for hover
};

interface StudentLayoutProps {
    currentScreen: string;
    onNavigate: (screen: string) => void;
    pathNodes: PathNode[];
    users: UserData[];
    events: Event[];
    lbData: LeaderboardEntry[];
    points: number;
    streak: number;
    userName: string;
    userInitials: string;
    surpriseMission: SurpriseMission | null;
    teamChallenges: TeamChallenge[];
    modal: ModalState;
    filteredUsers: UserData[];
    liveTickerItems: LiveTickerItem[];
    onPathNodeClick: (node: PathNode) => void;
    onUserClick: (user: UserData) => void;
    onModalClose: () => void;
    onLuckySpinClick: () => void;
    onEventRegister: (eventId: number) => void;
    onAddTeamChallenge: (challenge: TeamChallenge) => void;
    onCompleteTeamChallenge: (id: string) => void;
    onAwardTeamBonus: (id: string) => void;
    onClaimBadge: (badge: string) => void;
    onPathNodeProofUpload: (nodeId: number, file: File) => void;
    onUpdateTeamMember: (challengeId: string, name: string, initials: string) => void;
    onUpdateSurpriseMission: (mission: SurpriseMission) => void;
    PathScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    EventsScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    LeaderboardScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    UsersScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    ProfileScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    StudentSettingsScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    TeamScreenComponent: React.ComponentType<any>;
    ModalComponent: React.ComponentType<any>;
    NotifToastComponent: React.ComponentType<any>;
}

const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        fontSize: '18px',
        color: COLORS.primary
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            Loading Student Hub...
        </div>
    </div>
);

function StudentLayout({
    currentScreen,
    onNavigate,
    pathNodes,
    users,
    events,
    lbData,
    points,
    streak,
    userName,
    userInitials,
    surpriseMission,
    teamChallenges,
    modal,
    filteredUsers,
    liveTickerItems,
    onPathNodeClick,
    onUserClick,
    onModalClose,
    onLuckySpinClick,
    onEventRegister,
    onAddTeamChallenge,
    onCompleteTeamChallenge,
    onAwardTeamBonus,
    onClaimBadge,
    onPathNodeProofUpload,
    onUpdateTeamMember,
    onUpdateSurpriseMission,
    PathScreenComponent,
    EventsScreenComponent,
    LeaderboardScreenComponent,
    UsersScreenComponent,
    ProfileScreenComponent,
    StudentSettingsScreenComponent,
    TeamScreenComponent,
    ModalComponent,
    NotifToastComponent,
}: StudentLayoutProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', background: COLORS.background }}>
            {/* Student Header - Unified Yellow Theme */}
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                color: 'white',
                padding: '20px 20px',
                textAlign: 'center',
                boxShadow: `0 4px 12px rgba(243, 156, 18, 0.3)`,
                borderBottom: `3px solid ${COLORS.border}`
            }}>
                <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>🌟 Student Hub</h1>
                <p style={{ margin: '8px 0 0 0', fontSize: '15px', opacity: 0.95 }}>
                    Welcome, <strong>{userName}</strong>! • <span style={{background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px'}}>{points} pts</span> • <span style={{fontSize: '16px'}}>{streak}🔥</span>
                </p>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', background: COLORS.background }}>
                <Suspense fallback={<LoadingSpinner />}>
                    {currentScreen === 'path' && <PathScreenComponent pathNodes={pathNodes} onPathNodeClick={onPathNodeClick} surpriseMission={surpriseMission} onLuckySpinClick={onLuckySpinClick} onUpdateSurpriseMission={onUpdateSurpriseMission} onPathNodeProofUpload={onPathNodeProofUpload} />}
                    {currentScreen === 'events' && <EventsScreenComponent events={events} onEventRegister={onEventRegister} />}
                    {currentScreen === 'leaderboard' && <LeaderboardScreenComponent lbData={lbData} />}
                    {currentScreen === 'users' && <UsersScreenComponent users={filteredUsers} onUserClick={onUserClick} />}
                    {currentScreen === 'profile' && <ProfileScreenComponent userName={userName} userInitials={userInitials} points={points} streak={streak} onClaimBadge={onClaimBadge} />}
                    {currentScreen === 'settings' && <StudentSettingsScreenComponent />}
                    {currentScreen === 'team' && <TeamScreenComponent teamChallenges={teamChallenges} onAddTeamChallenge={onAddTeamChallenge} onCompleteTeamChallenge={onCompleteTeamChallenge} onAwardTeamBonus={onAwardTeamBonus} onUpdateTeamMember={onUpdateTeamMember} />}
                </Suspense>
            </div>

            {/* Student Navigation - Unified Yellow Theme */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: `3px solid ${COLORS.primary}`,
                boxShadow: `0 -4px 16px rgba(243, 156, 18, 0.15)`,
                display: 'flex',
                justifyContent: 'space-around',
                padding: '10px 0',
                zIndex: 100,
                overflowX: 'auto'
            }}>
                {[
                    { id: 'path', label: 'Path', icon: '🧭' },
                    { id: 'events', label: 'Events', icon: '📅' },
                    { id: 'leaderboard', label: 'Board', icon: '🏆' },
                    { id: 'users', label: 'Users', icon: '👥' },
                    { id: 'team', label: 'Team', icon: '👨‍👩‍👧‍👦' },
                    { id: 'settings', label: 'Settings', icon: '⚙️' },
                    { id: 'profile', label: 'Profile', icon: '👤' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            flex: 1,
                            minWidth: '70px',
                            background: currentScreen === item.id ? `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)` : 'transparent',
                            border: 'none',
                            color: currentScreen === item.id ? COLORS.primary : COLORS.textLight,
                            padding: '10px 4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            borderTop: currentScreen === item.id ? `4px solid ${COLORS.primary}` : 'none',
                            transition: 'all 0.3s',
                            fontWeight: currentScreen === item.id ? '600' : 'normal'
                        }}
                        onMouseOver={(e) => {
                            if (currentScreen !== item.id) {
                                e.currentTarget.style.background = `${COLORS.primary}08`;
                                e.currentTarget.style.color = COLORS.primary;
                            }
                        }}
                        onMouseOut={(e) => {
                            if (currentScreen !== item.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = COLORS.textLight;
                            }
                        }}
                    >
                        <div style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</div>
                        <div style={{ fontSize: '11px' }}>
                            {item.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Modal & Toast */}
            <ModalComponent modal={modal} onModalClose={onModalClose} />
            <NotifToastComponent />
        </div>
    );
}

export default React.memo(StudentLayout);
