import React, { useState } from 'react';

export interface AdminSubmission {
    id: string;
    initials: string;
    name: string;
    time: string;
    task: string;
    desc: string;
    pts: number;
    hasImg?: boolean;
}

export interface AdminPathNode {
    id: number;
    icon: string;
    label: string;
    pts: string;
    state: string;
}

export interface AdminEvent {
    id: number;
    title: string;
    date: string;
    loc: string;
    desc: string;
}

export interface AdminScreenProps {
    currentScreen: string;
    adminTab: string;
    pendingQueue: AdminSubmission[];
    adminValidated: AdminSubmission[];
    adminQueue: AdminSubmission[];
    approvedSet: Set<string>;
    pathNodes: AdminPathNode[];
    events: AdminEvent[];
    avatarColor: (name: string) => string;
    onAdminTabChange: (tab: string) => void;
    onApprove: (id: string, pts: number) => void;
    onReject: (id: string) => void;
    onAddActivity: (label: string, pts: string) => void;
    onRemoveActivity: (id: number, label: string) => void;
    onCreateEvent: (event: Omit<AdminEvent, 'id'>) => void;
    onDeleteEvent: (id: number) => void;
}

function AdminScreen({
    currentScreen,
    adminTab,
    pendingQueue,
    adminValidated,
    adminQueue,
    approvedSet,
    pathNodes,
    events,
    avatarColor,
    onAdminTabChange,
    onApprove,
    onReject,
    onAddActivity,
    onRemoveActivity,
    onCreateEvent,
    onDeleteEvent,
}: AdminScreenProps) {
    const [newNodeLabel, setNewNodeLabel] = useState('');
    const [newNodePts, setNewNodePts] = useState('');
    const [evTitle, setEvTitle] = useState('');
    const [evDate, setEvDate] = useState('');
    const [evLoc, setEvLoc] = useState('');
    const [evDesc, setEvDesc] = useState('');

    return (
        <div className={`screen ${currentScreen === 'admin' ? 'active' : ''} fade-in`} style={{ paddingBottom: '80px' }}>
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '0',
                background: 'white',
                borderBottom: '2px solid #ecf0f1',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <button
                    onClick={() => onAdminTabChange('queue')}
                    style={{
                        flex: 1,
                        padding: '14px 16px',
                        border: 'none',
                        background: adminTab === 'queue' ? '#2c3e50' : 'transparent',
                        color: adminTab === 'queue' ? 'white' : '#666',
                        fontWeight: adminTab === 'queue' ? 'bold' : '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        borderBottom: adminTab === 'queue' ? '3px solid #e74c3c' : 'none'
                    }}
                >
                    📥 Queue ({pendingQueue.length})
                </button>
                <button
                    onClick={() => onAdminTabChange('validated')}
                    style={{
                        flex: 1,
                        padding: '14px 16px',
                        border: 'none',
                        background: adminTab === 'validated' ? '#2c3e50' : 'transparent',
                        color: adminTab === 'validated' ? 'white' : '#666',
                        fontWeight: adminTab === 'validated' ? 'bold' : '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        borderBottom: adminTab === 'validated' ? '3px solid #27ae60' : 'none'
                    }}
                >
                    ✅ Approved ({adminValidated.length})
                </button>
                <button
                    onClick={() => onAdminTabChange('path')}
                    style={{
                        flex: 1,
                        padding: '14px 16px',
                        border: 'none',
                        background: adminTab === 'path' ? '#2c3e50' : 'transparent',
                        color: adminTab === 'path' ? 'white' : '#666',
                        fontWeight: adminTab === 'path' ? 'bold' : '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        borderBottom: adminTab === 'path' ? '3px solid #f39c12' : 'none'
                    }}
                >
                    📋 Paths
                </button>
                <button
                    onClick={() => onAdminTabChange('events')}
                    style={{
                        flex: 1,
                        padding: '14px 16px',
                        border: 'none',
                        background: adminTab === 'events' ? '#2c3e50' : 'transparent',
                        color: adminTab === 'events' ? 'white' : '#666',
                        fontWeight: adminTab === 'events' ? 'bold' : '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        borderBottom: adminTab === 'events' ? '3px solid #3498db' : 'none'
                    }}
                >
                    🎉 Events
                </button>
            </div>

            {/* QUEUE TAB */}
            {adminTab === 'queue' && (
                <div style={{ padding: '16px' }}>
                    {pendingQueue.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#999'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>All Caught Up!</div>
                            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>No submissions awaiting review</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {pendingQueue.map((s) => (
                                <div
                                    key={s.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '2px solid #f39c12',
                                        boxShadow: '0 2px 6px rgba(243, 156, 18, 0.1)'
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '50%',
                                                background: avatarColor(s.name),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {s.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#2c3e50' }}>
                                                {s.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>{s.time}</div>
                                        </div>
                                        <div style={{
                                            background: '#2c3e50',
                                            color: 'white',
                                            padding: '8px 14px',
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            fontSize: '13px'
                                        }}>
                                            +{s.pts}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            color: '#2c3e50',
                                            marginBottom: '4px'
                                        }}>
                                            {s.task}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#666',
                                            lineHeight: '1.5'
                                        }}>
                                            {s.desc}
                                        </div>
                                    </div>

                                    {/* Evidence Badge */}
                                    {s.hasImg && (
                                        <div style={{
                                            background: '#e8f5e9',
                                            border: '1px solid #c8e6c9',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            color: '#27ae60',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            📸 Photo evidence attached
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <button
                                            onClick={() => onApprove(s.id, s.pts)}
                                            style={{
                                                background: '#27ae60',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#229954';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = '#27ae60';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            ✓ APPROVE
                                        </button>
                                        <button
                                            onClick={() => onReject(s.id)}
                                            style={{
                                                background: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#c0392b';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = '#e74c3c';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
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

            {/* VALIDATED TAB */}
            {adminTab === 'validated' && (
                <div style={{ padding: '16px' }}>
                    {adminValidated.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#999'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🕐</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>No Approvals Yet</div>
                            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Approve submissions in the queue</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {adminValidated.map((s) => (
                                <div
                                    key={s.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '2px solid #27ae60',
                                        boxShadow: '0 2px 6px rgba(39, 174, 96, 0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '50%',
                                                background: avatarColor(s.name),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {s.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#2c3e50' }}>
                                                {s.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>{s.time}</div>
                                        </div>
                                        <div style={{
                                            background: '#27ae60',
                                            color: 'white',
                                            padding: '8px 14px',
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            fontSize: '13px'
                                        }}>
                                            ✓ {s.pts}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                        {s.task}
                                    </div>
                                    <div style={{
                                        background: '#e8f5e9',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        color: '#27ae60',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        textAlign: 'center'
                                    }}>
                                        ✓ APPROVED & VERIFIED
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* PATHS TAB */}
            {adminTab === 'path' && (
                <div style={{ padding: '16px' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px', color: '#2c3e50' }}>
                            ➕ Add New Activity
                        </div>
                        <input
                            type="text"
                            placeholder="Activity name (e.g., Design Challenge)"
                            value={newNodeLabel}
                            onChange={(e) => setNewNodeLabel(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Points (e.g., +40 pts)"
                            value={newNodePts}
                            onChange={(e) => setNewNodePts(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button
                            onClick={() => {
                                if (newNodeLabel && newNodePts) {
                                    onAddActivity(newNodeLabel, newNodePts);
                                    setNewNodeLabel('');
                                    setNewNodePts('');
                                }
                            }}
                            style={{
                                width: '100%',
                                background: '#f39c12',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            ➕ ADD ACTIVITY
                        </button>
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px', color: '#2c3e50' }}>
                        📋 Existing Activities
                    </div>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #ddd'
                    }}>
                        {pathNodes.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                No activities yet
                            </div>
                        ) : (
                            pathNodes.map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px',
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: n.state === 'done' ? '#e8f5e9' : 'white'
                                    }}
                                >
                                    <div style={{ fontSize: '20px' }}>{n.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2c3e50' }}>
                                            {n.label}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {n.pts} • {n.state}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onRemoveActivity(n.id, n.label)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '18px',
                                            cursor: 'pointer',
                                            padding: '8px'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* EVENTS TAB */}
            {adminTab === 'events' && (
                <div style={{ padding: '16px' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px', color: '#2c3e50' }}>
                            ✨ Create New Event
                        </div>
                        <input
                            type="text"
                            placeholder="Event title"
                            value={evTitle}
                            onChange={(e) => setEvTitle(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Date/Time"
                            value={evDate}
                            onChange={(e) => setEvDate(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={evLoc}
                            onChange={(e) => setEvLoc(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <textarea
                            placeholder="Description"
                            value={evDesc}
                            onChange={(e) => setEvDesc(e.target.value)}
                            style={{
                                width: '100%',
                                marginBottom: '12px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                minHeight: '80px',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            onClick={() => {
                                if (evTitle && evDate) {
                                    onCreateEvent({ title: evTitle, date: evDate, loc: evLoc, desc: evDesc });
                                    setEvTitle('');
                                    setEvDate('');
                                    setEvLoc('');
                                    setEvDesc('');
                                }
                            }}
                            style={{
                                width: '100%',
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            ✨ PUBLISH EVENT
                        </button>
                    </div>

                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px', color: '#2c3e50' }}>
                        🎉 Live Events ({events.length})
                    </div>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #ddd'
                    }}>
                        {events.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                No events yet
                            </div>
                        ) : (
                            events.map((e) => (
                                <div
                                    key={e.id}
                                    style={{
                                        padding: '14px',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2c3e50', marginBottom: '4px' }}>
                                            {e.title}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            📅 {e.date}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            📍 {e.loc}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteEvent(e.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '18px',
                                            cursor: 'pointer',
                                            padding: '8px'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .admin-tabs {
                    display: flex;
                    gap: 0;
                    background: white;
                    border-bottom: 2px solid #ecf0f1;
                    overflow-x: auto;
                }

                .admin-tab {
                    flex: 1;
                    padding: 14px 16px;
                    border: none;
                    background: transparent;
                    color: #666;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .admin-tab.active {
                    background: #f8f9fa;
                    color: #2c3e50;
                    border-bottom: 3px solid #2c3e50;
                }
            `}</style>
        </div>
    );
}

export default AdminScreen;
