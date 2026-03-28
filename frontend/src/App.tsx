import React, { useMemo, useState } from 'react';
import './App.css';
import {
    pathNodes as initialPathNodes,
    lbData,
    usersData as initialUsersData,
    badgesData,
    activityData,
    adminQueue as initialAdminQueue,
    adminValidated as initialAdminValidated,
    adminRejected as initialAdminRejected,
} from './data/mockData';

type Role = 'student' | 'admin';
type Screen = 'path' | 'leaderboard' | 'users' | 'profile' | 'admin';

const avatarColor = (name: string) => {
    const colors = ['#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#3b82f6', '#ef4444', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % colors.length;
    return colors[Math.abs(hash)];
};

const parsePts = (value: string) => Number(value.replace(/\D/g, '')) || 0;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; rollNo: string; domain: string; role: Role } | null>(null);
    const [loginRole, setLoginRole] = useState<Role>('student');

    const [currentScreen, setCurrentScreen] = useState<Screen>('path');
    const [points, setPoints] = useState(470);
    const [streak] = useState(14);
    const [notif, setNotif] = useState({ msg: '', show: false });
    const [modal, setModal] = useState<{ isOpen: boolean; type: 'node' | 'user' | ''; data: any | null }>({
        isOpen: false,
        type: '',
        data: null,
    });

    const [pathNodes, setPathNodes] = useState(initialPathNodes);
    const [users] = useState(initialUsersData);
    const [adminQueue] = useState(initialAdminQueue);
    const [adminValidated] = useState(initialAdminValidated);
    const [adminRejected] = useState(initialAdminRejected);
    const [approvedSet, setApprovedSet] = useState(new Set<string>());
    const [rejectedSet, setRejectedSet] = useState(new Set<string>());

    const [lbDomain, setLbDomain] = useState('Academic');
    const [userSearch, setUserSearch] = useState('');
    const [userFilterDomain, setUserFilterDomain] = useState('All');
    const [adminTab, setAdminTab] = useState('queue');

    const showNotif = (msg: string) => {
        setNotif({ msg, show: true });
        setTimeout(() => setNotif((prev) => ({ ...prev, show: false })), 2600);
    };

    const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (u) =>
                    (userFilterDomain === 'All' || u.domain === userFilterDomain) &&
                    (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.badges.some((b) => b.toLowerCase().includes(userSearch.toLowerCase()))),
            ),
        [users, userFilterDomain, userSearch],
    );

    const pendingQueue = adminQueue.filter((s) => !approvedSet.has(s.id) && !rejectedSet.has(s.id));
    const completedNodes = pathNodes.filter((n) => n.state === 'done').length;
    const progressPercent = (completedNodes / pathNodes.length) * 100;
    const levelTitle = points >= 800 ? 'Campus Legend' : points >= 500 ? 'Club Leader' : 'Rising Contributor';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = (formData.get('name') as string) || '';
        const rollNo = (formData.get('rollNo') as string) || '';
        const domain = loginRole === 'admin' ? 'Operations' : ((formData.get('domain') as string) || '');

        if (!name || !rollNo || !domain) {
            showNotif('Please fill all fields to continue.');
            return;
        }

        setUser({ name, rollNo, domain, role: loginRole });
        setIsLoggedIn(true);
        setCurrentScreen('path');
        showNotif(`Welcome to Aura, ${name}.`);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        showNotif('You have logged out safely.');
    };

    const approveSubmission = (id: string, pts: number) => {
        setApprovedSet((prev) => new Set(prev).add(id));
        setPoints((p) => p + pts);
        showNotif(`Approved successfully. +${pts} points`);
    };

    const rejectSubmission = (id: string) => {
        setRejectedSet((prev) => new Set(prev).add(id));
        showNotif('Submission rejected.');
    };

    const completeNode = (id: number) => {
        const node = pathNodes.find((n) => n.id === id);
        if (!node || node.state !== 'active') return;

        const updatedNodes = pathNodes.map((n) => {
            if (n.id === id) return { ...n, state: 'done' as const };
            if (n.state === 'locked' && n.id === id + 1) return { ...n, state: 'active' as const };
            return n;
        });

        setPathNodes(updatedNodes);
        setPoints((p) => p + parsePts(node.pts));
        closeModal();
        showNotif(`${node.label} completed. ${node.pts} earned.`);
    };

    if (!isLoggedIn) {
        return (
            <div className="auth-shell">
                <div className="glow-circle glow-one"></div>
                <div className="glow-circle glow-two"></div>

                <div className="auth-card">
                    <div className="brand-pill">AURA</div>
                    <h1>Campus Contributions, Reimagined</h1>
                    <p>
                        Track impact, reward participation, and make every club activity visible through one gamified
                        command center.
                    </p>

                    <div className="role-toggle">
                        <button
                            type="button"
                            className={loginRole === 'student' ? 'active' : ''}
                            onClick={() => setLoginRole('student')}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className={loginRole === 'admin' ? 'active' : ''}
                            onClick={() => setLoginRole('admin')}
                        >
                            Admin
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <label>
                            Full Name
                            <input name="name" placeholder="ex: Priya S." required />
                        </label>
                        <label>
                            Roll Number
                            <input name="rollNo" placeholder="ex: 21X41A05XX" required />
                        </label>

                        {loginRole === 'student' && (
                            <label>
                                Primary Domain
                                <select name="domain" required defaultValue="">
                                    <option value="" disabled>
                                        Select domain
                                    </option>
                                    <option value="Academic">Academic</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Media">Media</option>
                                    <option value="Events">Events</option>
                                </select>
                            </label>
                        )}

                        <button className="cta" type="submit">
                            Enter Aura Dashboard
                        </button>
                    </form>
                </div>

                <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
            </div>
        );
    }

    return (
        <div className="aura-shell">
            <header className="topbar">
                <div>
                    <div className="topbar-brand">Aura</div>
                    <div className="topbar-sub">{levelTitle}</div>
                </div>
                <div className="topbar-stats">
                    <div className="stat-chip">Streak {streak}</div>
                    <div className="stat-chip accent">{points} pts</div>
                </div>
            </header>

            <section className="hero-strip">
                <div>
                    <h2>Welcome, {user?.name}</h2>
                    <p>
                        {user?.role === 'admin'
                            ? 'Manage validation queue and boost contributor momentum.'
                            : 'Complete missions, climb rankings, and unlock badges.'}
                    </p>
                </div>
                <div className="hero-progress">
                    <div className="hero-progress-head">
                        <span>Path Progress</span>
                        <strong>{Math.round(progressPercent)}%</strong>
                    </div>
                    <div className="bar">
                        <div style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </section>

            <main className="screen-wrap">
                {currentScreen === 'path' && (
                    <section className="screen show">
                        <article className="daily-mission">
                            <h3>Daily Quest</h3>
                            <p>Ask one meaningful question in a seminar and upload reflection.</p>
                            <span>Reward +15 pts</span>
                        </article>

                        <h3 className="section-title">Activity Journey</h3>
                        <div className="path-list">
                            {pathNodes.map((node, index) => (
                                <div className="path-item" key={node.id}>
                                    {index < pathNodes.length - 1 && (
                                        <div className={`connector ${pathNodes[index].state === 'done' ? 'done' : ''}`}></div>
                                    )}
                                    <button
                                        className={`path-node ${node.state}`}
                                        onClick={() =>
                                            node.state === 'active' || node.state === 'done'
                                                ? setModal({ isOpen: true, type: 'node', data: node })
                                                : showNotif('Complete previous missions to unlock this one.')
                                        }
                                    >
                                        <span>{node.icon}</span>
                                    </button>
                                    <div className="path-copy">
                                        <h4>{node.label}</h4>
                                        <p>{node.sub}</p>
                                        <strong>{node.pts}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {currentScreen === 'leaderboard' && (
                    <section className="screen show">
                        <h3 className="section-title">Leaderboard</h3>
                        <div className="domain-pills">
                            {['Academic', 'Tech', 'Media', 'Events'].map((d) => (
                                <button key={d} className={lbDomain === d ? 'active' : ''} onClick={() => setLbDomain(d)}>
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="rank-list">
                            {(lbData[lbDomain] || []).map((item, i) => (
                                <div className={`rank-row ${item.you ? 'you' : ''}`} key={i}>
                                    <div className="rank-num">#{i + 1}</div>
                                    <div className="avatar small" style={{ background: avatarColor(item.name) }}>
                                        {item.name[0]}
                                    </div>
                                    <div className="rank-name">{item.name}</div>
                                    <div className="rank-pts">{item.pts}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {currentScreen === 'users' && (
                    <section className="screen show">
                        <h3 className="section-title">Contributors Directory</h3>

                        <div className="search-row">
                            <input
                                type="text"
                                placeholder="Search by name, role, badge"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </div>

                        <div className="domain-pills">
                            {['All', 'Tech', 'Academic', 'Engagement'].map((d) => (
                                <button key={d} className={userFilterDomain === d ? 'active' : ''} onClick={() => setUserFilterDomain(d)}>
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="user-list">
                            {filteredUsers.length === 0 && <div className="empty">No contributors found.</div>}
                            {filteredUsers.map((u, i) => (
                                <article className="user-card" key={i} onClick={() => setModal({ isOpen: true, type: 'user', data: u })}>
                                    <div className="avatar" style={{ background: avatarColor(u.name) }}>
                                        {u.initials}
                                    </div>
                                    <div>
                                        <h4>{u.name}</h4>
                                        <p>{u.role}</p>
                                        <small>{u.pts} pts</small>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {currentScreen === 'profile' && (
                    <section className="screen show">
                        <div className="profile-hero">
                            <div className="avatar large" style={{ background: avatarColor(user?.name || 'Aura') }}>
                                {user?.name[0] || 'A'}
                            </div>
                            <h3>{user?.name}</h3>
                            <p>
                                {user?.rollNo} · {user?.domain}
                            </p>
                        </div>

                        <article className="card">
                            <div className="card-head">
                                <span>Total Progress</span>
                                <strong>{points}/1000</strong>
                            </div>
                            <div className="bar">
                                <div style={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}></div>
                            </div>
                        </article>

                        <h3 className="section-title">Badge Cabinet</h3>
                        <div className="badge-grid">
                            {badgesData.map((b, i) => (
                                <button
                                    key={i}
                                    className={`badge-item ${b.earned ? 'earned' : 'locked'}`}
                                    onClick={() => b.earned && showNotif(`${b.name} is already unlocked.`)}
                                >
                                    <span>{b.icon}</span>
                                    <small>{b.name}</small>
                                </button>
                            ))}
                        </div>

                        <h3 className="section-title">Recent Activity</h3>
                        <div className="activity-list">
                            {activityData.map((a, i) => (
                                <article className="activity-row" key={i}>
                                    <span>{a.time}</span>
                                    <p>{a.text}</p>
                                    <strong>{a.pts}</strong>
                                </article>
                            ))}
                        </div>

                        <button className="danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </section>
                )}

                {currentScreen === 'admin' && (
                    <section className="screen show">
                        <h3 className="section-title">Approvals Center</h3>

                        <div className="domain-pills">
                            {['queue', 'validated', 'rejected'].map((tab) => (
                                <button key={tab} className={adminTab === tab ? 'active' : ''} onClick={() => setAdminTab(tab)}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {adminTab === 'queue' && (
                            <div className="submission-list">
                                {pendingQueue.length === 0 && <div className="empty">Queue is clear.</div>}
                                {pendingQueue.map((s) => (
                                    <article className="submission" key={s.id}>
                                        <h4>{s.name}</h4>
                                        <p>{s.task}</p>
                                        <small>{s.desc}</small>
                                        <div className="action-row">
                                            <button onClick={() => approveSubmission(s.id, s.pts)}>Approve +{s.pts}</button>
                                            <button className="ghost" onClick={() => rejectSubmission(s.id)}>
                                                Reject
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {adminTab === 'validated' && (
                            <div className="submission-list">
                                {[...adminValidated, ...adminQueue.filter((s) => approvedSet.has(s.id))].map((s, i) => (
                                    <article className="submission" key={i}>
                                        <h4>{s.name}</h4>
                                        <p>{s.task}</p>
                                        <small>{s.desc}</small>
                                        <div className="ok-tag">Verified</div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {adminTab === 'rejected' && (
                            <div className="submission-list">
                                {[...adminRejected, ...adminQueue.filter((s) => rejectedSet.has(s.id))].map((s, i) => (
                                    <article className="submission" key={i}>
                                        <h4>{s.name}</h4>
                                        <p>{s.task}</p>
                                        <small>{(s as any).reason || s.desc}</small>
                                        <div className="bad-tag">Rejected</div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            <nav className="bottom-nav">
                <button className={currentScreen === 'path' ? 'active' : ''} onClick={() => setCurrentScreen('path')}>
                    Path
                </button>
                <button className={currentScreen === 'leaderboard' ? 'active' : ''} onClick={() => setCurrentScreen('leaderboard')}>
                    Board
                </button>
                <button className={currentScreen === 'users' ? 'active' : ''} onClick={() => setCurrentScreen('users')}>
                    People
                </button>
                {user?.role === 'admin' && (
                    <button className={currentScreen === 'admin' ? 'active' : ''} onClick={() => setCurrentScreen('admin')}>
                        Approvals
                    </button>
                )}
                <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>
                    Me
                </button>
            </nav>

            <div className={`modal-overlay ${modal.isOpen ? 'open' : ''}`} onClick={closeModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    {modal.type === 'node' && modal.data && (
                        <>
                            <h3>
                                {modal.data.icon} {modal.data.label}
                            </h3>
                            <p>
                                {modal.data.sub} · {modal.data.pts}
                            </p>
                            {modal.data.state === 'done' ? (
                                <div className="ok-tag">Mission already completed.</div>
                            ) : (
                                <button className="cta" onClick={() => completeNode(modal.data.id)}>
                                    Submit Proof and Complete
                                </button>
                            )}
                            <button className="ghost close" onClick={closeModal}>
                                Close
                            </button>
                        </>
                    )}

                    {modal.type === 'user' && modal.data && (
                        <>
                            <h3>{modal.data.name}</h3>
                            <p>{modal.data.role}</p>
                            <div className="mini-badges">
                                {modal.data.badges.map((b: string, i: number) => (
                                    <span key={i}>{b}</span>
                                ))}
                            </div>
                            {modal.data.available ? (
                                <button
                                    className="cta"
                                    onClick={() => {
                                        closeModal();
                                        showNotif(`Peer review requested from ${modal.data.name}.`);
                                    }}
                                >
                                    Request Peer Review
                                </button>
                            ) : (
                                <div className="bad-tag">Not available for peer review.</div>
                            )}
                            <button className="ghost close" onClick={closeModal}>
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
        </div>
    );
}

export default App;
