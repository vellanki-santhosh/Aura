import React, { Suspense } from 'react';
import type { PathNode, UserData, AdminQueueItem, Event, SurpriseMission, TeamChallenge, LiveTickerItem, ModalState } from '../App';
import type { LeaderboardEntry } from '../data/mockData';

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
        color: '#2ECC71'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            Loading...
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fff9' }}>
            {/* Student Header */}
            <div style={{
                background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                color: 'white',
                padding: '15px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(46, 204, 113, 0.2)'
            }}>
                <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>🌟 Student Hub</h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                    Welcome, {userName}! • {points} pts • {streak}🔥
                </p>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
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

            {/* Student Navigation - Green theme */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: '2px solid #2ECC71',
                boxShadow: '0 -2px 10px rgba(46, 204, 113, 0.1)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 0',
                zIndex: 100
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
                            background: currentScreen === item.id ? '#e8f8f1' : 'transparent',
                            border: 'none',
                            color: currentScreen === item.id ? '#2ECC71' : '#666',
                            padding: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            borderTop: currentScreen === item.id ? '3px solid #2ECC71' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '18px' }}>{item.icon}</div>
                        <div style={{ fontSize: '11px', fontWeight: currentScreen === item.id ? 'bold' : 'normal' }}>
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
