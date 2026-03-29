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
    logoUrl: string;
    pathNodes: PathNode[];
    users: UserData[];
    events: Event[];
    lbData: Record<string, LeaderboardEntry[]>;
    badgesData: Array<{ icon: string; name: string; earned: boolean }>;
    activityData: Array<{ time: string; text: string; pts: string }>;
    points: number;
    animatedProfilePoints: number;
    streak: number;
    user: { name: string; rollNo: string; domain: string; role: 'student' | 'admin' } | null;
    userName: string;
    userInitials: string;
    surpriseMission: SurpriseMission;
    teamChallenges: TeamChallenge[];
    teamConfettiChallengeId: string | null;
    activeTickerItem: LiveTickerItem | null;
    tickerIndex: number;
    isSpinning: boolean;
    spinUsed: boolean;
    spinReward: number | null;
    bouncingNodeId: number | null;
    registeredSet: Set<number>;
    declinedSet: Set<number>;
    lbDomain: string;
    userSearch: string;
    userFilterDomain: string;
    modal: ModalState;
    notif: { msg: string; show: boolean };
    filteredUsers: UserData[];
    liveTickerItems: LiveTickerItem[];
    photoProof: File | null;
    fileProof: File | null;
    photoPreviewUrl: string;
    githubProofUrl: string;
    isUploadingProof: boolean;
    onPathNodeClick: (node: PathNode) => void;
    onUserClick: (user: UserData) => void;
    onModalClose: () => void;
    onLuckySpinClick: () => void;
    onTickerTap: () => void;
    onCompleteSurpriseMission: () => void;
    onRerollSurpriseMission: () => void;
    onEventRegister: (eventId: number, title: string) => void;
    onEventReject: (eventId: number, title: string) => void;
    onDomainChange: (domain: string) => void;
    onSearchChange: (value: string) => void;
    onFilterChange: (domain: string) => void;
    onAddTeamChallenge: (challenge: TeamChallenge) => void;
    onCompleteTeamChallenge: (id: string) => void;
    onAwardTeamBonus: (id: string) => void;
    onJoinTeamChallenge: (id: string) => void;
    onClaimBadge: (badge: string) => void;
    onShareLinkedIn: () => void;
    onLogout: () => void;
    onPathNodeProofUpload: () => void;
    onCameraProofChange: (file: File | null) => void;
    onFileProofChange: (file: File | null) => void;
    onGithubProofUrlChange: (value: string) => void;
    onUpdateTeamMember: (challengeId: string, name: string, initials: string) => void;
    onUpdateSurpriseMission: (mission: SurpriseMission) => void;
    avatarColor: (name: string) => string;
    pickNodeAnimation: (seed: number) => { label: string; src: string };
    nodeAnimationSide: (rowIndex: number) => 'left' | 'right';
    connectorState: (state: string) => 'done' | 'active' | 'locked';
    FlameIcon: React.ComponentType<{ hot: boolean }>;
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
            Loading AURA...
        </div>
    </div>
);

function StudentLayout({
    currentScreen,
    onNavigate,
    logoUrl,
    pathNodes,
    users,
    events,
    lbData,
    badgesData,
    activityData,
    points,
    animatedProfilePoints,
    streak,
    user,
    userName,
    userInitials,
    surpriseMission,
    teamChallenges,
    teamConfettiChallengeId,
    activeTickerItem,
    tickerIndex,
    isSpinning,
    spinUsed,
    spinReward,
    bouncingNodeId,
    registeredSet,
    declinedSet,
    lbDomain,
    userSearch,
    userFilterDomain,
    modal,
    notif,
    filteredUsers,
    liveTickerItems,
    photoProof,
    fileProof,
    photoPreviewUrl,
    githubProofUrl,
    isUploadingProof,
    onPathNodeClick,
    onUserClick,
    onModalClose,
    onLuckySpinClick,
    onTickerTap,
    onCompleteSurpriseMission,
    onRerollSurpriseMission,
    onEventRegister,
    onEventReject,
    onDomainChange,
    onSearchChange,
    onFilterChange,
    onAddTeamChallenge,
    onCompleteTeamChallenge,
    onAwardTeamBonus,
    onJoinTeamChallenge,
    onClaimBadge,
    onShareLinkedIn,
    onLogout,
    onPathNodeProofUpload,
    onCameraProofChange,
    onFileProofChange,
    onGithubProofUrlChange,
    onUpdateTeamMember,
    onUpdateSurpriseMission,
    avatarColor,
    pickNodeAnimation,
    nodeAnimationSide,
    connectorState,
    FlameIcon,
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
    const activeNode = modal.type === 'node' ? modal.data : null;
    const selectedUser = modal.type === 'user' ? modal.data : null;
    const requiresGithub = activeNode ? /github|repository/i.test(activeNode.proofType || '') : false;
    const githubUrlValid = !requiresGithub || /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/.*)?$/i.test(githubProofUrl.trim());
    const hasBinaryProof = Boolean(photoProof || fileProof);
    const canUploadProof = Boolean(activeNode && activeNode.state === 'active' && !isUploadingProof && (requiresGithub ? githubUrlValid : hasBinaryProof));

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
                <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>🌟 AURA</h1>
                <p style={{ margin: '8px 0 0 0', fontSize: '15px', opacity: 0.95 }}>
                    Welcome, <strong>{userName}</strong>! • <span style={{background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px'}}>{points} pts</span> • <span style={{fontSize: '16px'}}>{streak}🔥</span>
                </p>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', background: COLORS.background }}>
                <Suspense fallback={<LoadingSpinner />}>
                    {currentScreen === 'path' && (
                        <PathScreenComponent
                            currentScreen={currentScreen}
                            activeTickerItem={activeTickerItem}
                            tickerIndex={tickerIndex}
                            onTickerTap={onTickerTap}
                            isSpinning={isSpinning}
                            spinUsed={spinUsed}
                            spinReward={spinReward}
                            surpriseMission={surpriseMission}
                            logoUrl={logoUrl}
                            pathNodes={pathNodes}
                            bouncingNodeId={bouncingNodeId}
                            onPlayLuckySpin={onLuckySpinClick}
                            onCompleteSurpriseMission={onCompleteSurpriseMission}
                            onRerollSurpriseMission={onRerollSurpriseMission}
                            onNodeTap={onPathNodeClick}
                            pickNodeAnimation={pickNodeAnimation}
                            nodeAnimationSide={nodeAnimationSide}
                            connectorState={connectorState}
                        />
                    )}
                    {currentScreen === 'events' && (
                        <EventsScreenComponent
                            currentScreen={currentScreen}
                            events={events}
                            registeredSet={registeredSet}
                            declinedSet={declinedSet}
                            onRegister={onEventRegister}
                            onReject={onEventReject}
                        />
                    )}
                    {currentScreen === 'leaderboard' && (
                        <LeaderboardScreenComponent
                            currentScreen={currentScreen}
                            lbDomain={lbDomain}
                            lbData={lbData}
                            points={points}
                            userName={userName}
                            onDomainChange={onDomainChange}
                            avatarColor={avatarColor}
                        />
                    )}
                    {currentScreen === 'users' && (
                        <UsersScreenComponent
                            currentScreen={currentScreen}
                            userSearch={userSearch}
                            userFilterDomain={userFilterDomain}
                            filteredUsers={filteredUsers}
                            avatarColor={avatarColor}
                            onSearchChange={onSearchChange}
                            onFilterChange={onFilterChange}
                            onUserClick={onUserClick}
                        />
                    )}
                    {currentScreen === 'profile' && (
                        <ProfileScreenComponent
                            currentScreen={currentScreen}
                            user={user}
                            animatedProfilePoints={animatedProfilePoints}
                            streak={streak}
                            points={points}
                            badgesData={badgesData}
                            activityData={activityData}
                            onBadgeClick={onClaimBadge}
                            onShareLinkedIn={onShareLinkedIn}
                            onLogout={onLogout}
                            FlameIcon={FlameIcon}
                        />
                    )}
                    {currentScreen === 'settings' && (
                        <StudentSettingsScreenComponent
                            currentScreen={currentScreen}
                            user={user}
                            points={points}
                            onLogout={onLogout}
                        />
                    )}
                    {currentScreen === 'team' && (
                        <TeamScreenComponent
                            currentScreen={currentScreen}
                            teamChallenges={teamChallenges}
                            teamConfettiChallengeId={teamConfettiChallengeId}
                            avatarColor={avatarColor}
                            onJoinChallenge={onJoinTeamChallenge}
                        />
                    )}
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
            <ModalComponent isOpen={modal.isOpen} onClose={onModalClose}>
                {activeNode && (
                    <>
                        <div className="modal-title">{activeNode.icon} {activeNode.label}</div>
                        <div style={{ fontSize: '.86rem', color: '#666', marginBottom: '8px' }}>{activeNode.sub}</div>
                        <div style={{ fontSize: '.84rem', fontWeight: 700, color: '#444', marginBottom: '12px' }}>Reward: {activeNode.pts}</div>

                        {activeNode.state === 'active' && (
                            <>
                                <div style={{ fontSize: '.8rem', fontWeight: 800, marginBottom: '8px', color: '#444' }}>
                                    Upload verification proof
                                </div>

                                {requiresGithub ? (
                                    <>
                                        <input
                                            type="url"
                                            placeholder="https://github.com/username/repository"
                                            value={githubProofUrl}
                                            onChange={(e) => onGithubProofUrlChange(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.85rem' }}
                                        />
                                        <div className={`proof-hint ${githubUrlValid ? 'valid' : 'invalid'}`}>
                                            {githubUrlValid ? 'Valid GitHub URL' : 'Enter a valid public GitHub repository URL'}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="proof-options">
                                            <label className="proof-option-card">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => onCameraProofChange(e.target.files?.[0] || null)}
                                                />
                                                <div style={{ fontSize: '1.4rem' }}>📷</div>
                                                <div style={{ fontWeight: 800, fontSize: '.82rem' }}>Camera</div>
                                            </label>

                                            <label className="proof-option-card">
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => onFileProofChange(e.target.files?.[0] || null)}
                                                />
                                                <div style={{ fontSize: '1.4rem' }}>📎</div>
                                                <div style={{ fontWeight: 800, fontSize: '.82rem' }}>Attach File</div>
                                            </label>
                                        </div>

                                        {(photoPreviewUrl || fileProof) && (
                                            <div className="proof-preview-wrap">
                                                {photoPreviewUrl && (
                                                    <div className="proof-photo-preview">
                                                        <img src={photoPreviewUrl} alt="Proof preview" />
                                                    </div>
                                                )}
                                                {fileProof && (
                                                    <div className="proof-file-meta">
                                                        <div>Selected file: {fileProof.name}</div>
                                                        <div>{Math.max(1, Math.round(fileProof.size / 1024))} KB</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {!hasBinaryProof && <div className="proof-hint invalid">Please attach photo or file proof</div>}
                                    </>
                                )}

                                <button
                                    className="btn"
                                    style={{ width: '100%', marginTop: '14px', background: '#FFD600', color: '#2C3E50', opacity: canUploadProof ? 1 : 0.6 }}
                                    disabled={!canUploadProof}
                                    onClick={onPathNodeProofUpload}
                                >
                                    {isUploadingProof ? (
                                        <span className="proof-uploading-inline"><span className="proof-upload-spinner" />Uploading...</span>
                                    ) : (
                                        'Submit For Verification'
                                    )}
                                </button>
                            </>
                        )}

                        {activeNode.state === 'pending' && <div className="proof-hint valid">Already submitted. Awaiting admin verification.</div>}
                        {activeNode.state === 'done' && <div className="proof-hint valid">Already verified and completed.</div>}
                        {activeNode.state === 'locked' && <div className="proof-hint invalid">Locked. Complete previous activity first.</div>}
                    </>
                )}

                {selectedUser && (
                    <>
                        <div className="modal-title">👤 {selectedUser.name}</div>
                        <div style={{ fontSize: '.84rem', color: '#555' }}>Role: {selectedUser.role}</div>
                        <div style={{ fontSize: '.84rem', color: '#555' }}>Domain: {selectedUser.domain}</div>
                        <div style={{ fontSize: '.84rem', color: '#555', marginTop: '6px' }}>Points: {selectedUser.pts}</div>
                        <div style={{ fontSize: '.8rem', marginTop: '8px', color: '#777' }}>
                            Badges: {selectedUser.badges?.length ? selectedUser.badges.join(', ') : 'No badges yet'}
                        </div>
                    </>
                )}
            </ModalComponent>
            <NotifToastComponent show={notif.show} message={notif.msg} />
        </div>
    );
}

export default React.memo(StudentLayout);
