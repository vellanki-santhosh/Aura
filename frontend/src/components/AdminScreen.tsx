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
        <div className={`screen ${currentScreen === 'admin' ? 'active' : ''} fade-in`}>
            <div style={{ background: 'var(--dark)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.1rem', color: '#fff' }}>Approvals Mode</div>
            </div>
            <div className="admin-tabs">
                <div className={`admin-tab ${adminTab === 'queue' ? 'active' : ''}`} onClick={() => onAdminTabChange('queue')}>Queue</div>
                <div className={`admin-tab ${adminTab === 'path' ? 'active' : ''}`} onClick={() => onAdminTabChange('path')}>Path Edit</div>
            </div>

            {adminTab === 'queue' && (
                <div id="admin-queue">
                    {pendingQueue.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>All caught up! 🎉</div>
                    ) : (
                        pendingQueue.map((s) => (
                            <div className="submission-card" key={s.id}>
                                <div className="sub-header">
                                    <div className="avatar sm" style={{ background: avatarColor(s.name) }}>{s.initials}</div>
                                    <div><div style={{ fontWeight: 800, fontSize: '.88rem' }}>{s.name}</div><div style={{ fontSize: '.72rem', color: '#999' }}>{s.time}</div></div>
                                    <div style={{ marginLeft: 'auto' }}><span className="pts-chip">+{s.pts} pts</span></div>
                                </div>
                                <div className="sub-body">
                                    <div className="sub-task">{s.task}</div>
                                    <div className="sub-desc">{s.desc}</div>
                                    {s.hasImg && <div className="sub-evidence"><div style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', borderRadius: '8px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📸</div></div>}
                                </div>
                                <div className="sub-actions">
                                    <button className="btn btn-green" onClick={() => onApprove(s.id, s.pts)}>✓ Approve</button>
                                    <button className="btn btn-red" onClick={() => onReject(s.id)}>✗ Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {adminTab === 'validated' && (
                <div id="admin-validated">
                    {[...adminValidated, ...adminQueue.filter((s) => approvedSet.has(s.id))].map((s, i) => (
                        <div className="submission-card" key={i}>
                            <div className="sub-header">
                                <div className="avatar sm" style={{ background: avatarColor(s.name) }}>{s.initials}</div>
                                <div><div style={{ fontWeight: 800, fontSize: '.88rem' }}>{s.name}</div><div style={{ fontSize: '.72rem', color: '#999' }}>{s.time}</div></div>
                                <div style={{ marginLeft: 'auto' }}><span className="pts-chip">+{s.pts} pts</span></div>
                            </div>
                            <div className="sub-body"><div className="sub-task">{s.task}</div><div className="sub-desc">{s.desc}</div></div>
                            <div className="verified-badge">✅ Verified</div>
                        </div>
                    ))}
                </div>
            )}

            {adminTab === 'path' && (
                <div id="admin-path-editor" style={{ padding: '16px' }}>
                    <div className="section-title" style={{ padding: '0 0 16px' }}>🛠️ Manage Activity Path</div>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow)', marginBottom: '20px', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.9rem', marginBottom: '12px' }}>✨ Add New Activity</div>
                        <input type="text" placeholder="Activity Name (e.g. Design Challenge)" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} value={newNodeLabel} onChange={(e) => setNewNodeLabel(e.target.value)} />
                        <input type="text" placeholder="Points (e.g. +40 pts)" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} value={newNodePts} onChange={(e) => setNewNodePts(e.target.value)} />
                        <button className="btn btn-yellow" style={{ width: '100%' }} onClick={() => {
                            if (newNodeLabel && newNodePts) {
                                onAddActivity(newNodeLabel, newNodePts);
                                setNewNodeLabel('');
                                setNewNodePts('');
                            }
                        }}>➕ Add Activity</button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#999', marginBottom: '8px' }}>CURRENT PATH PREVIEW:</div>
                    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                        {pathNodes.map((n) => (
                            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #eee' }}>
                                <div style={{ fontSize: '1.2rem' }}>{n.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '.85rem' }}>{n.label}</div>
                                    <div style={{ fontSize: '.72rem', color: '#666' }}>{n.pts} · {n.state}</div>
                                </div>
                                <button style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', padding: '8px' }} onClick={() => onRemoveActivity(n.id, n.label)}>🗑️</button>
                                <div className={`badge-pill ${n.state === 'done' ? 'badge-green' : n.state === 'active' ? 'badge-yellow' : 'badge-gray'}`} style={{ fontSize: '.65rem' }}>
                                    {n.state}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {adminTab === 'events' && (
                <div id="admin-events-editor" style={{ padding: '16px' }}>
                    <div className="section-title" style={{ padding: '0 0 16px' }}>🛠️ Manage Events</div>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '12px', boxShadow: 'var(--shadow)', marginBottom: '20px', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.9rem', marginBottom: '12px' }}>✨ Create New Event</div>
                        <input type="text" placeholder="Event Title" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} value={evTitle} onChange={(e) => setEvTitle(e.target.value)} />
                        <input type="text" placeholder="Date/Time" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} value={evDate} onChange={(e) => setEvDate(e.target.value)} />
                        <input type="text" placeholder="Location" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} value={evLoc} onChange={(e) => setEvLoc(e.target.value)} />
                        <textarea placeholder="Details" className="search-bar" style={{ width: '100%', marginBottom: '10px', minHeight: '80px', padding: '12px', border: 'none', background: '#f5f5f5', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }} value={evDesc} onChange={(e) => setEvDesc(e.target.value)} />
                        <button className="btn btn-yellow" style={{ width: '100%' }} onClick={() => {
                            if (evTitle && evDate) {
                                onCreateEvent({ title: evTitle, date: evDate, loc: evLoc, desc: evDesc });
                                setEvTitle('');
                                setEvDate('');
                                setEvLoc('');
                                setEvDesc('');
                            }
                        }}>➕ Publish Event</button>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#999', marginBottom: '8px' }}>LIVE EVENTS:</div>
                    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                        {events.map((e) => (
                            <div key={e.id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 800, fontSize: '.85rem' }}>{e.title}</div>
                                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => onDeleteEvent(e.id)}>🗑️</button>
                                </div>
                                <div style={{ fontSize: '.72rem', color: 'var(--green-dark)', fontWeight: 700 }}>{e.date} · {e.loc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminScreen;
