import React, { useEffect, useMemo, useState } from 'react';
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
type AppMode = 'normal' | 'degraded' | 'offline';
type ActivityItem = { time: string; text: string; pts: string };
type RejectedSubmission = { reason?: string; desc: string };
type LiveMetrics = {
    engagement: number;
    activeUsers: number;
    validationRate: number;
    velocity: number;
};
type ConfettiPiece = {
    id: number;
    left: number;
    delay: number;
    drift: number;
    rotate: number;
    hue: number;
    duration: number;
    size: number;
};

type PersistedState = {
    isLoggedIn: boolean;
    user: { name: string; rollNo: string; domain: string; role: Role } | null;
    points: number;
    pathNodes: typeof initialPathNodes;
    approvedIds: string[];
    rejectedIds: string[];
    dailyQuestDone: boolean;
    activityFeed: ActivityItem[];
};

const avatarColor = (name: string) => {
    const colors = ['#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#3b82f6', '#ef4444', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % colors.length;
    return colors[Math.abs(hash)];
};

const parsePts = (value: string) => Number(value.replace(/\D/g, '')) || 0;

const createConfettiPieces = (count = 30): ConfettiPiece[] =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.floor(Math.random() * 260),
        drift: Math.floor(Math.random() * 140 - 70),
        rotate: Math.floor(Math.random() * 360 + 220),
        hue: [42, 48, 55, 22, 96][Math.floor(Math.random() * 5)],
        duration: Math.floor(Math.random() * 900 + 1200),
        size: Math.floor(Math.random() * 9 + 7),
    }));

const AURA_STORAGE_KEY = 'aura-state-v2';
const AURA_LOGO_URL = 'logo.png';

const toClockTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const jitter = (base: number, delta: number, min = 0, max = 100) => clamp(base + Math.floor(Math.random() * (delta * 2 + 1)) - delta, min, max);

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
    const [xpBurst, setXpBurst] = useState<{ id: number; amount: number } | null>(null);
    const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
    const [dailyQuestDone, setDailyQuestDone] = useState(false);
    const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(activityData);
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [lastSyncAt, setLastSyncAt] = useState(toClockTime(new Date()));
    const [isBooting, setIsBooting] = useState(true);
    const [appMode, setAppMode] = useState<AppMode>('normal');
    const [syncError, setSyncError] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [loadWarning, setLoadWarning] = useState<string | null>(null);
    const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
        engagement: 74,
        activeUsers: 22,
        validationRate: 88,
        velocity: 63,
    });
    const [liveEvents, setLiveEvents] = useState<string[]>([
        'Tech Circle posted a new sprint update',
        '2 submissions moved to validation queue',
        'Academic quest completion increased by 8%',
    ]);

    const showNotif = (msg: string) => {
        setNotif({ msg, show: true });
        setTimeout(() => setNotif((prev) => ({ ...prev, show: false })), 2600);
    };

    const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

    useEffect(() => {
        const bootTimer = setTimeout(() => setIsBooting(false), 900);

        try {
            if (typeof window === 'undefined') return;
            const rawState = localStorage.getItem(AURA_STORAGE_KEY);
            if (!rawState) return;

            const saved = JSON.parse(rawState) as PersistedState;
            setIsLoggedIn(saved.isLoggedIn ?? false);
            setUser(saved.user ?? null);
            setPoints(saved.points ?? 470);
            setPathNodes(saved.pathNodes ?? initialPathNodes);
            setApprovedSet(new Set(saved.approvedIds ?? []));
            setRejectedSet(new Set(saved.rejectedIds ?? []));
            setDailyQuestDone(saved.dailyQuestDone ?? false);
            setActivityFeed(saved.activityFeed?.length ? saved.activityFeed : activityData);
        } catch {
            setLoadWarning('Previous local data looked invalid. Aura started with safe defaults.');
        }

        return () => clearTimeout(bootTimer);
    }, []);

    useEffect(() => {
        const stateToSave: PersistedState = {
            isLoggedIn,
            user,
            points,
            pathNodes,
            approvedIds: [...approvedSet],
            rejectedIds: [...rejectedSet],
            dailyQuestDone,
            activityFeed,
        };

        try {
            if (typeof window === 'undefined') return;
            localStorage.setItem(AURA_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch {
            // Ignore storage errors on restricted mobile browsers/private tabs.
        }
    }, [isLoggedIn, user, points, pathNodes, approvedSet, rejectedSet, dailyQuestDone, activityFeed]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const markOnline = () => {
            setIsOnline(true);
            setLastSyncAt(toClockTime(new Date()));
        };

        const markOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', markOnline);
        window.addEventListener('offline', markOffline);

        return () => {
            window.removeEventListener('online', markOnline);
            window.removeEventListener('offline', markOffline);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (appMode === 'offline') {
                setIsOnline(false);
                setSyncError('Live sync paused in offline mode.');
                return;
            }

            setIsSyncing(true);
            const failChance = appMode === 'degraded' ? 0.35 : 0.08;
            if (Math.random() < failChance) {
                setSyncError('Realtime fetch delayed. Retrying...');
                setIsSyncing(false);
                return;
            }

            setIsOnline(true);
            setSyncError(null);
            setLiveMetrics((prev) => ({
                engagement: jitter(prev.engagement, 2, 40, 99),
                activeUsers: jitter(prev.activeUsers, 3, 6, 80),
                validationRate: jitter(prev.validationRate, 2, 50, 100),
                velocity: jitter(prev.velocity, 2, 30, 95),
            }));

            setLastSyncAt(toClockTime(new Date()));

            const eventPool = [
                'New club event trend detected in Tech domain',
                'Weekly leaderboard volatility increased',
                'Admin queue throughput is improving',
                'Peer review requests are spiking this hour',
                'Streak retention remains stable today',
            ];

            const eventText = eventPool[Math.floor(Math.random() * eventPool.length)];
            setLiveEvents((prev) => [eventText, ...prev].slice(0, 4));
            setIsSyncing(false);
        }, 6000);

        return () => clearInterval(timer);
    }, [appMode]);

    const retrySync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setSyncError(null);
            setIsOnline(true);
            setLastSyncAt(toClockTime(new Date()));
            setLiveEvents((prev) => ['Manual sync completed successfully', ...prev].slice(0, 4));
            setIsSyncing(false);
        }, 650);
    };

    const rewardXP = (amount: number, message: string, activityText: string) => {
        const burstId = Date.now();
        setPoints((p) => p + amount);
        setXpBurst({ id: burstId, amount });
        setConfettiPieces(createConfettiPieces());
        setActivityFeed((prev) => [
            { time: 'Just now', text: activityText, pts: `+${amount} pts` },
            ...prev,
        ]);
        showNotif(message);

        setTimeout(() => {
            setXpBurst((prev) => (prev?.id === burstId ? null : prev));
        }, 1250);

        setTimeout(() => {
            setConfettiPieces([]);
        }, 1900);
    };

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
    const earnedBadges = badgesData.filter((b) => b.earned).length;
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
        rewardXP(pts, `Approved successfully. +${pts} points`, 'Admin approved a club contribution');
    };

    const rejectSubmission = (id: string) => {
        setRejectedSet((prev) => new Set(prev).add(id));
        showNotif('Submission rejected.');
    };

    const completeNode = (id: number) => {
        const node = pathNodes.find((n) => n.id === id);
        if (!node || node.state !== 'active') return;
        const earned = parsePts(node.pts);

        const updatedNodes = pathNodes.map((n) => {
            if (n.id === id) return { ...n, state: 'done' as const };
            if (n.state === 'locked' && n.id === id + 1) return { ...n, state: 'active' as const };
            return n;
        });

        setPathNodes(updatedNodes);
        closeModal();
        rewardXP(earned, `${node.label} completed. ${node.pts} earned.`, node.label);
    };

    const completeDailyQuest = () => {
        if (dailyQuestDone) return;
        setDailyQuestDone(true);
        rewardXP(15, 'Daily quest completed. +15 XP', 'Daily quest completed');
    };

    if (!isLoggedIn) {
        return (
            <div className="auth-shell">
                <div className="glow-circle glow-one"></div>
                <div className="glow-circle glow-two"></div>

                <div className="auth-card">
                    <div className="brand-pill">
                        <img src={AURA_LOGO_URL} alt="Aura logo" className="brand-logo" />
                        <span>AURA</span>
                    </div>
                    <h1>Learn, Lead, Level Up</h1>
                    <p>
                        Aura turns campus life into a fun student quest where every contribution earns XP, streaks,
                        and squad recognition.
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
                            Start My Quest
                        </button>
                    </form>
                </div>

                <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
            </div>
        );
    }

    if (isBooting) {
        return (
            <div className="boot-screen">
                <div className="boot-logo"><img src={AURA_LOGO_URL} alt="Aura logo" /></div>
                <div className="boot-sub">Initializing realtime campus engine...</div>
                <div className="boot-loader"><span></span></div>
            </div>
        );
    }

    return (
        <div className="aura-shell">
            <header className="topbar">
                <div>
                    <div className="topbar-brand">
                        <img src={AURA_LOGO_URL} alt="Aura logo" className="topbar-logo-img" />
                        <span>Aura</span>
                    </div>
                    <div className="topbar-sub">{user?.role === 'admin' ? 'Admin Mode' : levelTitle}</div>
                </div>
                <div className="topbar-stats">
                    <div className="stat-chip">🔥 {streak}</div>
                    <div className="stat-chip accent">🪙 {points} pts</div>
                </div>
            </header>

            <section className="hero-strip">
                <div>
                    <h2>Welcome, {user?.name}</h2>
                    <p>
                        {user?.role === 'admin'
                            ? 'Manage validation queue and boost contributor momentum.'
                            : 'Crush mini missions, top the campus board, and collect shiny badges.'}
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
                <div className="sync-strip">
                    <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
                    <span>{isOnline ? 'Online sync active' : 'Offline mode'}</span>
                    {isSyncing && <span className="sync-pill">Syncing...</span>}
                    <strong>Last sync: {lastSyncAt}</strong>
                </div>
                {syncError && (
                    <div className="sync-error">
                        <span>{syncError}</span>
                        <button onClick={retrySync}>Retry now</button>
                    </div>
                )}
                {loadWarning && <div className="sync-warn">{loadWarning}</div>}
            </section>

            <main className="screen-wrap">
                {currentScreen === 'path' && (
                    <section className="screen show">
                        <article className="daily-mission">
                            <div className="daily-mission-head">
                                <h3>Daily Quest</h3>
                                <button className="mini-cta" onClick={completeDailyQuest} disabled={dailyQuestDone}>
                                    {dailyQuestDone ? 'Completed' : 'Mark Done'}
                                </button>
                            </div>
                            <p>Ask one smart seminar question, then drop a 2-line reflection.</p>
                            <span>{dailyQuestDone ? 'Reward claimed: +15 XP' : 'Reward +15 XP'}</span>
                        </article>

                        <h3 className="section-title">My Learning Trail</h3>
                        <div className="mode-switch">
                            <span>Simulation:</span>
                            {(['normal', 'degraded', 'offline'] as AppMode[]).map((mode) => (
                                <button key={mode} className={appMode === mode ? 'active' : ''} onClick={() => setAppMode(mode)}>
                                    {mode}
                                </button>
                            ))}
                        </div>
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

                        <h3 className="section-title">REAL-TIME ANALYSIS</h3>
                        <div className="analytics-grid">
                            <article className="analytics-card">
                                <small>Engagement</small>
                                <strong>{liveMetrics.engagement}%</strong>
                                <div className="metric-bar"><span style={{ width: `${liveMetrics.engagement}%` }}></span></div>
                            </article>
                            <article className="analytics-card">
                                <small>Active Users</small>
                                <strong>{liveMetrics.activeUsers}</strong>
                                <div className="metric-bar"><span style={{ width: `${Math.min(100, liveMetrics.activeUsers * 1.4)}%` }}></span></div>
                            </article>
                            <article className="analytics-card">
                                <small>Validation Rate</small>
                                <strong>{liveMetrics.validationRate}%</strong>
                                <div className="metric-bar"><span style={{ width: `${liveMetrics.validationRate}%` }}></span></div>
                            </article>
                            <article className="analytics-card">
                                <small>Learning Velocity</small>
                                <strong>{liveMetrics.velocity}%</strong>
                                <div className="metric-bar"><span style={{ width: `${liveMetrics.velocity}%` }}></span></div>
                            </article>
                        </div>

                        <div className="live-feed">
                            <h4>Live Signals</h4>
                            {liveEvents.map((eventText, idx) => (
                                <div key={`${eventText}-${idx}`} className="live-feed-item">{eventText}</div>
                            ))}
                        </div>

                        <div className="health-checks">
                            <h4>Health Checks</h4>
                            <div className="health-row">
                                <span>Network</span>
                                <strong className={isOnline ? 'ok' : 'bad'}>{isOnline ? 'PASS' : 'FAIL'}</strong>
                            </div>
                            <div className="health-row">
                                <span>Sync Pipeline</span>
                                <strong className={!syncError ? 'ok' : 'bad'}>{!syncError ? 'PASS' : 'WARN'}</strong>
                            </div>
                            <div className="health-row">
                                <span>Data Freshness</span>
                                <strong className={liveEvents.length >= 2 ? 'ok' : 'bad'}>{liveEvents.length >= 2 ? 'PASS' : 'WARN'}</strong>
                            </div>
                        </div>
                    </section>
                )}

                {currentScreen === 'leaderboard' && (
                    <section className="screen show">
                        <h3 className="section-title">LEADERBOARD - {lbDomain} Domain</h3>
                        <div className="leaderboard-select-row">
                            <label>
                                DOMAIN:
                                <select value={lbDomain} onChange={(e) => setLbDomain(e.target.value)}>
                                    {['Academic', 'Tech', 'Media', 'Events'].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="rank-list">
                            {(lbData[lbDomain] || []).map((item, i) => (
                                <div className={`rank-row ${item.you ? 'you' : ''}`} key={i}>
                                    <div className={`rank-num badge-${i + 1 > 3 ? 'n' : i + 1}`}>#{i + 1}</div>
                                    <div className="avatar small" style={{ background: avatarColor(item.name) }}>
                                        {item.name[0]}
                                    </div>
                                    <div className="rank-name">{item.name}</div>
                                    <div className="rank-pts">{item.pts} pts</div>
                                    {item.promo && <div className="promo-chip">Promotion</div>}
                                    {item.demo && <div className="demo-chip">Demotion</div>}
                                    {item.you && <div className="you-chip">YOU</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {currentScreen === 'users' && (
                    <section className="screen show">
                        <h3 className="section-title">Student Squad</h3>

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
                        <div className="profile-hero dark-home">
                            <div className="home-greeting">GOOD MORNING</div>
                            <h3>{user?.name}</h3>
                            <p>{user?.rollNo}</p>
                            <div className="points-rank-card">
                                <div>
                                    <small>AURA POINTS</small>
                                    <strong>{points.toLocaleString()}</strong>
                                    <span>+120 this week</span>
                                </div>
                                <div className="rank-panel">
                                    <small>Rank</small>
                                    <strong>#4</strong>
                                    <span>of 128</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="section-title">THIS MONTH</h3>
                        <div className="month-grid">
                            <article className="month-tile">
                                <strong>{completedNodes + 10}</strong>
                                <span>Events</span>
                            </article>
                            <article className="month-tile">
                                <strong>{earnedBadges}</strong>
                                <span>Badges</span>
                            </article>
                            <article className="month-tile">
                                <strong>{streak}</strong>
                                <span>Day streak</span>
                            </article>
                        </div>

                        <article className="card streak-card">
                            <div className="card-head">
                                <span>STREAK</span>
                                <strong>{streak} day streak</strong>
                            </div>
                            <div className="streak-dots">
                                {Array.from({ length: 7 }, (_, i) => (
                                    <span key={i} className={streak > i ? 'active' : ''}></span>
                                ))}
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

                        <h3 className="section-title">RECENT ACTIVITY</h3>
                        <div className="activity-list">
                            {activityFeed.slice(0, 5).map((a, i) => (
                                <article className="activity-row" key={i}>
                                    <div className="act-icon">◎</div>
                                    <div>
                                        <p>{a.text}</p>
                                        <span>{a.time}</span>
                                    </div>
                                    <strong>+{parsePts(a.pts)}</strong>
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
                        <h3 className="section-title">Coach Review Zone</h3>

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
                                        {s.hasImg && <div className="evidence-box">Evidence Preview</div>}
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
                                        <small>{(s as RejectedSubmission).reason || s.desc}</small>
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
                    <img src={AURA_LOGO_URL} alt="Aura" className="nav-logo" />
                    Home
                </button>
                <button className={currentScreen === 'leaderboard' ? 'active' : ''} onClick={() => setCurrentScreen('leaderboard')}>
                    <span>🛡️</span>
                    Ranks
                </button>
                <button className={currentScreen === 'users' ? 'active' : ''} onClick={() => setCurrentScreen('users')}>
                    <span>👥</span>
                    Users
                </button>
                {user?.role === 'admin' && (
                    <button className={currentScreen === 'admin' ? 'active' : ''} onClick={() => setCurrentScreen('admin')}>
                        <span>📋</span>
                        Approvals
                    </button>
                )}
                <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>
                    <span>👤</span>
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

            <div className={`confetti-layer ${confettiPieces.length ? 'show' : ''}`}>
                {confettiPieces.map((piece) => (
                    <span
                        key={`${piece.id}-${piece.delay}`}
                        className="confetti-piece"
                        style={{
                            left: `${piece.left}%`,
                            width: `${piece.size}px`,
                            height: `${Math.max(6, Math.floor(piece.size * 0.72))}px`,
                            animationDelay: `${piece.delay}ms`,
                            animationDuration: `${piece.duration}ms`,
                            ['--confetti-drift' as string]: `${piece.drift}px`,
                            ['--confetti-rotate' as string]: `${piece.rotate}deg`,
                            ['--confetti-hue' as string]: `${piece.hue}`,
                        } as React.CSSProperties}
                    ></span>
                ))}
            </div>

            {xpBurst && (
                <div key={xpBurst.id} className="xp-burst">
                    +{xpBurst.amount} XP
                </div>
            )}

            <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
        </div>
    );
}

export default App;
