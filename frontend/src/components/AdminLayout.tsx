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

// Yellow Color Palette
const COLORS = {
    primary: '#FFD600',      // Pure bright yellow
    secondary: '#FFC107',    // Amber yellow
    light: '#FEF8E7',        // Very light cream
    background: '#FFFEF0',   // Light warm background
    text: '#2C3E50',         // Dark text
    textLight: '#666',       // Light text
    border: '#FFB300',       // Dark yellow
    success: '#1ABB9C',      // Teal for success
    danger: '#E74C3C',       // Red for danger
    hover: '#FFC107'         // Bright amber yellow for hover
};

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
            Loading Admin Dashboard...
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
    const [adminTab, setAdminTab] = React.useState('queue');

    const queueStats = {
        pending: adminQueue.length,
        approved: adminValidated.length,
        rejected: adminRejected.length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', background: COLORS.background }}>
            {/* Admin Header - Unified Yellow Theme */}
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                color: '#2C3E50',
                padding: '20px 20px',
                boxShadow: `0 4px 12px rgba(243, 156, 18, 0.3)`,
                borderBottom: `3px solid ${COLORS.border}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>Admin Dashboard</h1>
                        <p style={{ margin: '8px 0 0 0', fontSize: '15px', opacity: 0.95 }}>
                            Welcome back, <strong>{userName}</strong>!
                        </p>
                    </div>
                    {/* Queue Stats - Enhanced Design */}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '10px 15px', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ fontSize: '22px' }}>⏳</div>
                            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{queueStats.pending} Pending</div>
                        </div>
                        <div style={{ textAlign: 'center', background: 'rgba(26, 187, 156, 0.2)', padding: '10px 15px', borderRadius: '10px' }}>
                            <div style={{ fontSize: '22px' }}>✓</div>
                            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{queueStats.approved} Approved</div>
                        </div>
                        <div style={{ textAlign: 'center', background: 'rgba(231, 76, 60, 0.2)', padding: '10px 15px', borderRadius: '10px' }}>
                            <div style={{ fontSize: '22px' }}>✗</div>
                            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{queueStats.rejected} Rejected</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', background: COLORS.background }}>
                <Suspense fallback={<LoadingSpinner />}>
                    {currentScreen === 'approvals' && (
                        <div style={{ padding: '25px' }}>
                            <div style={{ marginBottom: '25px', borderBottom: `3px solid ${COLORS.primary}`, paddingBottom: '12px' }}>
                                <h2 style={{ margin: '0 0 8px 0', color: COLORS.text, fontSize: '22px', fontWeight: 'bold' }}>Approval Queue</h2>
                                <p style={{ margin: 0, color: COLORS.textLight, fontSize: '14px' }}>{queueStats.pending} submissions awaiting your review</p>
                            </div>

                            {/* Approval Queue */}
                            {adminQueue.length === 0 ? (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '50px 20px',
                                    textAlign: 'center',
                                    color: COLORS.primary,
                                    border: `2px dashed ${COLORS.border}`,
                                    boxShadow: `0 2px 8px rgba(243, 156, 18, 0.1)`
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text }}>All Caught Up!</div>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: COLORS.textLight }}>No pending submissions to review</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {adminQueue.map(submission => (
                                        <div
                                            key={submission.id}
                                            style={{
                                                background: 'white',
                                                borderRadius: '14px',
                                                padding: '18px',
                                                border: `2px solid ${COLORS.light}`,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s',
                                                borderLeft: `5px solid ${COLORS.primary}`
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                                            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                                        >
                                            {/* Student Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                                <div
                                                    style={{
                                                        width: '45px',
                                                        height: '45px',
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        boxShadow: `0 2px 8px rgba(243, 156, 18, 0.3)`
                                                    }}
                                                >
                                                    {submission.initials}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', color: COLORS.text, fontSize: '16px' }}>{submission.name}</div>
                                                    <div style={{ fontSize: '12px', color: COLORS.textLight }}>{submission.time}</div>
                                                </div>
                                                <div style={{
                                                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                                                    color: 'white',
                                                    padding: '8px 14px',
                                                    borderRadius: '24px',
                                                    fontWeight: 'bold',
                                                    fontSize: '13px',
                                                    boxShadow: `0 2px 6px rgba(243, 156, 18, 0.3)`
                                                }}>
                                                    +{submission.pts} pts
                                                </div>
                                            </div>

                                            {/* Task Info */}
                                            <div style={{ marginBottom: '14px' }}>
                                                <div style={{ fontWeight: 'bold', color: COLORS.text, fontSize: '15px', marginBottom: '5px' }}>
                                                    {submission.task}
                                                </div>
                                                <div style={{ color: COLORS.textLight, fontSize: '13px', lineHeight: '1.5' }}>
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
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <button
                                                    onClick={() => onQueueApprove(submission.id)}
                                                    style={{
                                                        background: COLORS.success,
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '12px 16px',
                                                        borderRadius: '10px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.3s',
                                                        boxShadow: `0 2px 6px rgba(26, 187, 156, 0.3)`
                                                    }}
                                                    onMouseOver={(e) => {e.currentTarget.style.background = '#148f77'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 187, 156, 0.4)';}}
                                                    onMouseOut={(e) => {e.currentTarget.style.background = COLORS.success; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 2px 6px rgba(26, 187, 156, 0.3)`;}}
                                                >
                                                    ✓ APPROVE
                                                </button>
                                                <button
                                                    onClick={() => onQueueReject(submission.id)}
                                                    style={{
                                                        background: COLORS.danger,
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '12px 16px',
                                                        borderRadius: '10px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.3s',
                                                        boxShadow: `0 2px 6px rgba(231, 76, 60, 0.3)`
                                                    }}
                                                    onMouseOver={(e) => {e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';}}
                                                    onMouseOut={(e) => {e.currentTarget.style.background = COLORS.danger; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 2px 6px rgba(231, 76, 60, 0.3)`;}}
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
                        <div style={{ padding: '25px' }}>
                            <div style={{ marginBottom: '25px', borderBottom: `3px solid ${COLORS.primary}`, paddingBottom: '12px' }}>
                                <h2 style={{ margin: '0 0 8px 0', color: COLORS.text, fontSize: '22px', fontWeight: 'bold' }}>Manage Learning Path</h2>
                                <p style={{ margin: 0, color: COLORS.textLight, fontSize: '14px' }}>Configure activities that students complete</p>
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '14px',
                                padding: '22px',
                                marginBottom: '20px',
                                border: `2px solid ${COLORS.light}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '18px', color: COLORS.text }}>Path Overview</div>
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
                        <div style={{ padding: '25px' }}>
                            <div style={{ marginBottom: '25px', borderBottom: `3px solid ${COLORS.primary}`, paddingBottom: '12px' }}>
                                <h2 style={{ margin: '0 0 8px 0', color: COLORS.text, fontSize: '22px', fontWeight: 'bold' }}>Student Management</h2>
                                <p style={{ margin: 0, color: COLORS.textLight, fontSize: '14px' }}>View and manage all registered students</p>
                            </div>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {users.map((user) => (
                                    <div
                                        key={user.name}
                                        onClick={() => onUserClick(user)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '16px',
                                            background: 'white',
                                            borderRadius: '12px',
                                            border: `2px solid ${COLORS.light}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 214, 0, 0.2)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.transform = 'none';
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#222',
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                boxShadow: `0 2px 8px rgba(255, 214, 0, 0.3)`
                                            }}
                                        >
                                            {user.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: COLORS.text, fontSize: '15px' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: COLORS.textLight }}>{user.domain} • {user.pts} pts</div>
                                            {user.badges && user.badges.length > 0 && (
                                                <div style={{ fontSize: '12px', marginTop: '4px' }}>{user.badges.join(', ')}</div>
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            background: user.available ? `${COLORS.primary}20` : '#f0f0f0',
                                            color: user.available ? COLORS.primary : '#999',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.available ? '✓ Active' : 'Offline'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {currentScreen === 'profile' && (
                        <div style={{ padding: '20px 16px 90px' }}>
                            <div style={{ marginBottom: '20px', borderBottom: `3px solid ${COLORS.primary}`, paddingBottom: '10px' }}>
                                <h2 style={{ margin: '0 0 8px 0', color: COLORS.text, fontSize: '22px', fontWeight: 'bold' }}>Admin Profile</h2>
                                <p style={{ margin: 0, color: COLORS.textLight, fontSize: '14px' }}>Manage your admin account</p>
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '14px',
                                border: `2px solid ${COLORS.light}`,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                padding: '18px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '20px',
                                        color: '#2C3E50',
                                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
                                    }}>
                                        {userInitials}
                                    </div>
                                    <div>
                                        <div style={{ color: COLORS.text, fontSize: '18px', fontWeight: 700 }}>{userName}</div>
                                        <div style={{ color: COLORS.textLight, fontSize: '13px' }}>Administrator</div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr',
                                    gap: '10px'
                                }}>
                                    <div style={{ background: COLORS.light, borderRadius: '10px', padding: '10px 12px' }}>
                                        <div style={{ fontSize: '12px', color: COLORS.textLight }}>Role</div>
                                        <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 700 }}>System Administrator</div>
                                    </div>
                                    <div style={{ background: COLORS.light, borderRadius: '10px', padding: '10px 12px' }}>
                                        <div style={{ fontSize: '12px', color: COLORS.textLight }}>Access Level</div>
                                        <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 700 }}>Full Access</div>
                                    </div>
                                    <div style={{ background: COLORS.light, borderRadius: '10px', padding: '10px 12px' }}>
                                        <div style={{ fontSize: '12px', color: COLORS.textLight }}>Capabilities</div>
                                        <div style={{ fontSize: '14px', color: COLORS.text, fontWeight: 700 }}>Approvals, Users, Path Management</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>

            {/* Admin Navigation - Unified Yellow Theme */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                background: 'white',
                borderTop: `2px solid ${COLORS.primary}`,
                boxShadow: `0 -2px 10px rgba(243, 156, 18, 0.14)`,
                display: 'flex',
                justifyContent: 'space-around',
                padding: '4px 0',
                zIndex: 100
            }}>
                {[
                    { id: 'approvals', label: 'Approvals', icon: 'AP' },
                    { id: 'paths', label: 'Paths', icon: 'PA' },
                    { id: 'users', label: 'Users', icon: 'US' },
                    { id: 'profile', label: 'Profile', icon: 'ME' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            flex: 1,
                            background: currentScreen === item.id ? `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)` : 'transparent',
                            border: 'none',
                            color: currentScreen === item.id ? COLORS.primary : COLORS.textLight,
                            padding: '6px 2px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            borderTop: currentScreen === item.id ? `3px solid ${COLORS.primary}` : 'none',
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
                        <div style={{ fontSize: '10px', marginBottom: '1px', fontWeight: 800, letterSpacing: '0.4px', lineHeight: 1 }}>{item.icon}</div>
                        <div style={{ fontSize: '10px', lineHeight: 1.1 }}>
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
