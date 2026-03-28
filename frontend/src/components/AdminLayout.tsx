import React, { Suspense } from 'react';
import type { PathNode, UserData, AdminQueueItem, Event, SurpriseMission, TeamChallenge, LiveTickerItem, ModalState } from '../App';
import type { LeaderboardEntry } from '../data/mockData';

interface AdminLayoutProps {
    currentScreen: string;
    onNavigate: (screen: string) => void;
    pathNodes: PathNode[];
    users: UserData[];
    adminQueue: AdminQueueItem[];
    adminValidated: AdminQueueItem[];
    adminRejected: AdminQueueItem[];
    userName: string;
    userInitials: string;
    modal: ModalState;
    onModalClose: () => void;
    onPathNodeClick: (node: PathNode) => void;
    onUserClick: (user: UserData) => void;
    onQueueApprove: (id: string) => void;
    onQueueReject: (id: string) => void;
    onAddPathNode: (node: PathNode) => void;
    onEditPathNode: (node: PathNode) => void;
    onPathNodeProofUpload: (nodeId: number, file: File) => void;
    onCreateEvent: (event: Event) => void;
    AdminScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    ProfileScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
    UsersScreenComponent: React.LazyExoticComponent<React.ComponentType<any>>;
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
        color: '#2c3e50'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            Loading Admin Panel...
        </div>
    </div>
);

function AdminLayout({
    currentScreen,
    onNavigate,
    pathNodes,
    users,
    adminQueue,
    adminValidated,
    adminRejected,
    userName,
    userInitials,
    modal,
    onModalClose,
    onPathNodeClick,
    onUserClick,
    onQueueApprove,
    onQueueReject,
    onAddPathNode,
    onEditPathNode,
    onPathNodeProofUpload,
    onCreateEvent,
    AdminScreenComponent,
    ProfileScreenComponent,
    UsersScreenComponent,
    ModalComponent,
    NotifToastComponent,
}: AdminLayoutProps) {
    const queueStats = {
        pending: adminQueue.length,
        approved: adminValidated.length,
        rejected: adminRejected.length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5' }}>
            {/* Admin Header */}
            <div style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '15px 20px',
                boxShadow: '0 2px 8px rgba(44, 62, 80, 0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>🔐 Admin Dashboard</h1>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                            Admin: {userName}
                        </p>
                    </div>
                    {/* Queue Stats */}
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '18px', color: '#f39c12' }}>⏳</div>
                            <div>Pending: {queueStats.pending}</div>
                        </div>
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '18px', color: '#27ae60' }}>✓</div>
                            <div>Approved: {queueStats.approved}</div>
                        </div>
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '18px', color: '#e74c3c' }}>✗</div>
                            <div>Rejected: {queueStats.rejected}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
                <Suspense fallback={<LoadingSpinner />}>
                    {currentScreen === 'approvals' && (
                        <AdminScreenComponent
                            adminQueue={adminQueue}
                            adminValidated={adminValidated}
                            adminRejected={adminRejected}
                            onQueueApprove={onQueueApprove}
                            onQueueReject={onQueueReject}
                            onPathNodeClick={onPathNodeClick}
                        />
                    )}
                    {currentScreen === 'paths' && (
                        <div style={{ padding: '20px' }}>
                            <h2>📋 Manage Paths</h2>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '10px' }}>
                                <p>Path management feature coming soon...</p>
                            </div>
                        </div>
                    )}
                    {currentScreen === 'users' && (
                        <UsersScreenComponent users={users} onUserClick={onUserClick} />
                    )}
                    {currentScreen === 'profile' && (
                        <ProfileScreenComponent
                            userName={userName}
                            userInitials={userInitials}
                            isAdmin={true}
                        />
                    )}
                </Suspense>
            </div>

            {/* Admin Navigation - Dark theme */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: '2px solid #2c3e50',
                boxShadow: '0 -2px 10px rgba(44, 62, 80, 0.15)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 0',
                zIndex: 100
            }}>
                {[
                    { id: 'approvals', label: 'Approvals', icon: '✓' },
                    { id: 'paths', label: 'Paths', icon: '📋' },
                    { id: 'users', label: 'Users', icon: '👥' },
                    { id: 'profile', label: 'Profile', icon: '👤' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            flex: 1,
                            background: currentScreen === item.id ? '#e8ecf1' : 'transparent',
                            border: 'none',
                            color: currentScreen === item.id ? '#2c3e50' : '#666',
                            padding: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            borderTop: currentScreen === item.id ? '3px solid #2c3e50' : 'none',
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

export default React.memo(AdminLayout);
