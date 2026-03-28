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
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', background: '#ecf0f1' }}>
                <Suspense fallback={<LoadingSpinner />}>
                    {currentScreen === 'approvals' && (
                        <div style={{ padding: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '20px', fontWeight: 'bold' }}>📋 Approval Queue</h2>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{queueStats.pending} submissions pending review</p>
                            </div>

                            {/* Approval Queue */}
                            {adminQueue.length === 0 ? (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#999',
                                    border: '2px dashed #ddd'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>All caught up!</div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>No pending submissions to review</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {adminQueue.map(submission => (
                                        <div
                                            key={submission.id}
                                            style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                border: '1px solid #ddd',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {/* Student Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <div
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: avatarColor(submission.name),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    {submission.initials}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>{submission.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>{submission.time}</div>
                                                </div>
                                                <div style={{
                                                    background: '#f39c12',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontWeight: 'bold',
                                                    fontSize: '13px'
                                                }}>
                                                    +{submission.pts} pts
                                                </div>
                                            </div>

                                            {/* Task Info */}
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                                                    {submission.task}
                                                </div>
                                                <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                                                    {submission.desc}
                                                </div>
                                            </div>

                                            {/* Evidence Section */}
                                            {submission.hasImg && (
                                                <div style={{
                                                    background: '#e8f5e9',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    marginBottom: '12px',
                                                    textAlign: 'center',
                                                    color: '#27ae60',
                                                    fontSize: '13px',
                                                    fontWeight: '600'
                                                }}>
                                                    📸 Photo evidence attached
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <button
                                                    onClick={() => onQueueApprove(submission.id)}
                                                    style={{
                                                        background: '#27ae60',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '10px 16px',
                                                        borderRadius: '8px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#229954'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#27ae60'}
                                                >
                                                    ✓ APPROVE
                                                </button>
                                                <button
                                                    onClick={() => onQueueReject(submission.id)}
                                                    style={{
                                                        background: '#e74c3c',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '10px 16px',
                                                        borderRadius: '8px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#c0392b'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#e74c3c'}
                                                >
                                                    ✗ REJECT
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {currentScreen === 'paths' && (
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '20px', fontWeight: 'bold' }}>📋 Manage Learning Path</h2>
                            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>Configure the activity path for students</p>

                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px',
                                border: '1px solid #ddd'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#2c3e50' }}>✨ Path Overview</div>
                                {pathNodes.length === 0 ? (
                                    <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                        No activities in path yet
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {pathNodes.map((node, idx) => (
                                            <div
                                                key={node.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '12px',
                                                    background: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: `2px solid ${node.state === 'done' ? '#27ae60' : node.state === 'active' ? '#f39c12' : '#bdc3c7'}`
                                                }}
                                            >
                                                <div style={{ fontSize: '24px' }}>{node.icon}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2c3e50' }}>
                                                        {idx + 1}. {node.label}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {node.pts} • Status: <strong>{node.state}</strong>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onAddPathNode(node)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {currentScreen === 'users' && (
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '20px', fontWeight: 'bold' }}>👥 Student Management</h2>
                            <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>View and manage all registered students</p>
                            <UsersScreenComponent users={users} onUserClick={onUserClick} />
                        </div>
                    )}
                    {currentScreen === 'profile' && (
                        <div style={{ padding: '20px' }}>
                            <ProfileScreenComponent
                                userName={userName}
                                userInitials={userInitials}
                                isAdmin={true}
                            />
                        </div>
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
