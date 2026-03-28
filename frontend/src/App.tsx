import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
    initialEvents
} from './data/mockData';

// --- HELPERS ---
const avatarColor = (name: string) => {
    const colors = ['#FFD600', '#A5D6A7', '#90CAF9', '#FFCC80', '#CE93D8', '#F48FB1', '#80CBC4'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % colors.length;
    return colors[Math.abs(hash)];
};

const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`;
const ONBOARDING_KEY = 'aura-onboarding-seen-v1';
const PATH_ANIMATIONS = [
    { label: 'Rocket Sprint', src: `${import.meta.env.BASE_URL}animations/cat-in-a-rocket.lottie` },
    { label: 'Run Cycle', src: `${import.meta.env.BASE_URL}animations/run-cycle.lottie` },
    { label: 'Skull Boy', src: `${import.meta.env.BASE_URL}animations/skull-boy.lottie` },
];
const SPIN_REWARDS = [10, 15, 20, 30, 40, 50];
const SURPRISE_MISSIONS = [
    { title: 'Help 1 junior with a doubt', reward: 12 },
    { title: 'Post one club update', reward: 15 },
    { title: 'Share one event in your group', reward: 10 },
    { title: 'Upload one learning snapshot', reward: 14 },
    { title: 'Invite one friend to Aura', reward: 18 },
];
const ONBOARDING_CARDS = [
    {
        title: 'Quest Path',
        icon: '🧭',
        text: 'Follow a gamified mission path, submit proofs, and level up with every contribution.',
    },
    {
        title: 'Leaderboard',
        icon: '🏆',
        text: 'Compete with your peers by domain and climb ranks through consistent high-impact activity.',
    },
    {
        title: 'Badges',
        icon: '🎖️',
        text: 'Unlock recognition badges that showcase your growth, teamwork, and campus leadership.',
    },
];
const TEAM_CHALLENGES_SEED = [
    {
        id: 'tc-1',
        title: 'Study Blitz',
        domain: 'Academic',
        deadline: 'Apr 05',
        target: 3,
        completed: 1,
        members: [
            { name: 'Kiran R.', initials: 'KR' },
        ],
    },
    {
        id: 'tc-2',
        title: 'Code Sprint',
        domain: 'Tech',
        deadline: 'Apr 08',
        target: 4,
        completed: 2,
        members: [
            { name: 'Aisha M.', initials: 'AM' },
            { name: 'Rahul D.', initials: 'RD' },
        ],
    },
    {
        id: 'tc-3',
        title: 'Poster Relay',
        domain: 'Media',
        deadline: 'Apr 11',
        target: 3,
        completed: 2,
        members: [
            { name: 'Riya P.', initials: 'RP' },
            { name: 'Yash K.', initials: 'YK' },
        ],
    },
];

const pickNodeAnimation = (seed: number) => {
    const index = Math.abs((seed * 9301 + 49297) % 233280) % PATH_ANIMATIONS.length;
    return PATH_ANIMATIONS[index];
};

const nodeAnimationSide = (rowIndex: number) => (rowIndex % 2 === 0 ? 'right' : 'left');
const connectorState = (state: string) => {
    if (state === 'done') return 'done';
    if (state === 'active' || state === 'pending') return 'active';
    return 'locked';
};

const FlameIcon = ({ hot }: { hot: boolean }) => (
    <svg className={`streak-flame ${hot ? 'hot' : ''}`} viewBox="0 0 24 24" aria-hidden="true" role="img">
        <path d="M12 2C13 5 17 6.5 17 11a5 5 0 1 1-10 0c0-2.2 1.2-3.7 2.6-5.1C10.8 4.7 11.5 3.6 12 2z" fill="#ff8a00" />
        <path d="M12.2 8c.3 1.3 1.8 1.8 1.8 3.6a2.7 2.7 0 1 1-5.4 0c0-1.3.8-2.1 1.6-2.9.7-.7 1.5-1.3 2-2.7z" fill="#ffd63f" />
    </svg>
);

function App() {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return localStorage.getItem(ONBOARDING_KEY) === '1';
        } catch {
            return false;
        }
    });
    const [onboardingIndex, setOnboardingIndex] = useState(0);
    const [onboardingExit, setOnboardingExit] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; rollNo: string; domain: string; role: 'student' | 'admin' } | null>(null);
    const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');

    const [currentScreen, setCurrentScreen] = useState('path');
    const [points, setPoints] = useState(470);
    const [streak] = useState(14);
    const [notif, setNotif] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });
    const [modal, setModal] = useState<{ isOpen: boolean; type: string; data: any }>({ isOpen: false, type: '', data: null });

    // Data States
    const [pathNodes, setPathNodes] = useState(initialPathNodes);
    const [users, setUsers] = useState(initialUsersData);
    const [adminQueue, setAdminQueue] = useState(initialAdminQueue);
    const [adminValidated, setAdminValidated] = useState(initialAdminValidated);
    const [adminRejected, setAdminRejected] = useState(initialAdminRejected);
    const [events, setEvents] = useState(initialEvents);
    const [approvedSet, setApprovedSet] = useState(new Set<string>());
    const [rejectedSet, setRejectedSet] = useState(new Set<string>());
    const [registeredSet, setRegisteredSet] = useState(new Set<number>());
    const [declinedSet, setDeclinedSet] = useState(new Set<number>());
    const [spinUsed, setSpinUsed] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinReward, setSpinReward] = useState<number | null>(null);
    const [tickerIndex, setTickerIndex] = useState(0);
    const [surpriseMission, setSurpriseMission] = useState(() => {
        const picked = SURPRISE_MISSIONS[Math.floor(Math.random() * SURPRISE_MISSIONS.length)];
        return { ...picked, done: false };
    });
    const [teamChallenges, setTeamChallenges] = useState(
        TEAM_CHALLENGES_SEED.map((c) => ({ ...c, bonusAwarded: false }))
    );
    const [teamConfettiChallengeId, setTeamConfettiChallengeId] = useState<string | null>(null);
    const [bouncingNodeId, setBouncingNodeId] = useState<number | null>(null);
    const [animatedTopPoints, setAnimatedTopPoints] = useState(0);
    const [animatedProfilePoints, setAnimatedProfilePoints] = useState(0);
    const [pointsDeltaToast, setPointsDeltaToast] = useState<{ id: number; delta: number } | null>(null);
    const pointsPrevRef = useRef(points);
    const pointsReadyRef = useRef(false);

    const showNotif = (msg: string) => {
        setNotif({ msg, show: true });
        setTimeout(() => setNotif(prev => ({ ...prev, show: false })), 2800);
    };

    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        const start = performance.now();
        const duration = 800;
        const from = 0;
        const step = (now: number) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            setter(Math.round(from + (target - from) * eased));
            if (elapsed < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % 4);
        }, 2600);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;
        animateCount(points, setAnimatedTopPoints);
    }, [isLoggedIn, points]);

    useEffect(() => {
        if (!isLoggedIn || currentScreen !== 'profile') return;
        animateCount(points, setAnimatedProfilePoints);
    }, [isLoggedIn, currentScreen, points]);

    useEffect(() => {
        if (!isLoggedIn) {
            pointsPrevRef.current = points;
            pointsReadyRef.current = false;
            return;
        }

        if (!pointsReadyRef.current) {
            pointsReadyRef.current = true;
            pointsPrevRef.current = points;
            return;
        }

        const delta = points - pointsPrevRef.current;
        if (delta > 0) {
            const id = Date.now();
            setPointsDeltaToast({ id, delta });
            setTimeout(() => {
                setPointsDeltaToast((prev) => (prev?.id === id ? null : prev));
            }, 1200);
        }

        pointsPrevRef.current = points;
    }, [points, isLoggedIn]);

    const closeModal = () => setModal({ ...modal, isOpen: false });

    const handleOnboardingSwipeStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleOnboardingSwipeEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) {
            if (delta < 0) {
                setOnboardingIndex((prev) => (prev + 1) % ONBOARDING_CARDS.length);
            } else {
                setOnboardingIndex((prev) => (prev - 1 + ONBOARDING_CARDS.length) % ONBOARDING_CARDS.length);
            }
        }
        setTouchStartX(null);
    };

    const completeOnboarding = () => {
        if (onboardingExit) return;
        setOnboardingExit(true);
        setTimeout(() => {
            setHasSeenOnboarding(true);
            try {
                localStorage.setItem(ONBOARDING_KEY, '1');
            } catch {
                // Ignore storage errors in restricted contexts.
            }
        }, 360);
    };

    // Login handler
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const rollNo = formData.get('rollNo') as string;
        const domain = formData.get('domain') as string;

        if (!name || !rollNo || (loginRole === 'student' && !domain)) {
            showNotif('⚠️ Please fill all fields');
            return;
        }

        setUser({ name, rollNo, domain, role: loginRole });
        setIsLoggedIn(true);
        showNotif(`👋 Welcome, ${name}!`);
        setCurrentScreen('path');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        showNotif('👋 Safely logged out');
    };

    const shareContributionOnLinkedIn = async () => {
        if (typeof window === 'undefined') return;

        const completedCount = pathNodes.filter((n) => n.state === 'done').length;
        const badgeCount = badgesData.filter((b) => b.earned).length;
        const rankData = lbData[user?.domain || 'Academic'] || [];
        const rankPosition =
            rankData
                .map((item) => (item.you ? { ...item, name: user?.name || item.name, pts: points } : item))
                .sort((a, b) => b.pts - a.pts)
                .findIndex((item) => item.you) + 1;

        const name = user?.name || 'AURA Contributor';
        const domain = user?.domain || 'Campus';
        const profileUrl = window.location.href;
        const imageUrl = new URL(LOGO_URL, window.location.origin).toString();

        const postText = [
            `Excited to share my latest progress on AURA!`,
            ``,
            `Name: ${name}`,
            `Domain: ${domain}`,
            `Points: ${points}`,
            `Streak: ${streak} days`,
            `Badges Earned: ${badgeCount}`,
            `Completed Activities: ${completedCount}`,
            `${rankPosition > 0 ? `Leaderboard Rank: #${rankPosition}` : ''}`,
            ``,
            `Explore AURA: ${profileUrl}`,
            `Logo: ${imageUrl}`,
            ``,
            `#Aura #StudentLeadership #CampusContributions #LearningByDoing`,
        ]
            .filter(Boolean)
            .join('\n');

        const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`;

        let copied = false;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(postText);
                copied = true;
            }
        } catch {
            copied = false;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        showNotif(copied ? '🔗 LinkedIn opened. Post text + image link copied.' : '🔗 LinkedIn opened. Copy post text manually if needed.');
    };

    // Leaderboard Domain logic
    const [lbDomain, setLbDomain] = useState('Academic');

    // User Filter logic
    const [userSearch, setUserSearch] = useState('');
    const [userFilterDomain, setUserFilterDomain] = useState('All');

    const filteredUsers = users.filter(u =>
        (userFilterDomain === 'All' || u.domain === userFilterDomain) &&
        (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.badges.some(b => b.toLowerCase().includes(userSearch.toLowerCase())))
    );

    // Admin Queue Filter
    const [adminTab, setAdminTab] = useState('queue');
    const pendingQueue = adminQueue.filter(s => !approvedSet.has(s.id) && !rejectedSet.has(s.id));

    const approveSubmission = (id: string, pts: number) => {
        setApprovedSet(new Set(approvedSet.add(id)));
        setPoints(p => p + pts);

        // Find and Finalize Node if linked
        const queueItem = adminQueue.find(s => s.id === id);
        if (queueItem && (queueItem as any).nodeId) {
            const nodeId = (queueItem as any).nodeId;
            setPathNodes(prev => {
                const updated = prev.map(n => {
                    if (n.id === nodeId) return { ...n, state: 'done' as const };
                    // Unlock next
                    if (n.state === 'locked' && n.id === nodeId + 1) return { ...n, state: 'active' as const };
                    return n;
                });
                return updated;
            });
        }
        showNotif(`✅ Approved! +${pts} pts awarded`);
    };

    const rejectSubmission = (id: string) => {
        setRejectedSet(new Set(rejectedSet.add(id)));
        showNotif('❌ Submission rejected');
    };

    const completeNode = (id: number) => {
        const node = pathNodes.find(n => n.id === id);
        if (node && node.state === 'active') {
            const updatedNodes = pathNodes.map(n => {
                if (n.id === id) return { ...n, state: 'pending' as const };
                return n;
            });
            setPathNodes(updatedNodes as any);

            // Add to admin queue
            const newSub = {
                initials: user?.name.split(' ').map(n => n[0]).join('') || 'U',
                name: user?.name || 'User',
                time: 'Just now',
                task: `[${node.label}] (${user?.domain})`,
                desc: `Submission for ${node.label} activity.`,
                pts: parseInt(node.pts),
                hasImg: true,
                id: `node-${id}-${Date.now()}`,
                nodeId: id
            };
            setAdminQueue([newSub, ...adminQueue]);

            closeModal();
            showNotif(`📤 Submitted! Pending Admin Approval...`);
        }
    };

    const handleNodeTap = (node: any) => {
        setBouncingNodeId(node.id);
        setTimeout(() => {
            setBouncingNodeId((prev) => (prev === node.id ? null : prev));
            if (node.state !== 'locked') {
                setModal({ isOpen: true, type: 'node', data: node });
            } else {
                showNotif('🔒 Complete previous activities first!');
            }
        }, 220);
    };

    const playLuckySpin = () => {
        if (spinUsed || isSpinning) {
            showNotif('🎰 Lucky spin already used today.');
            return;
        }

        setIsSpinning(true);
        setTimeout(() => {
            const reward = SPIN_REWARDS[Math.floor(Math.random() * SPIN_REWARDS.length)];
            setPoints((p) => p + reward);
            setSpinReward(reward);
            setSpinUsed(true);
            setIsSpinning(false);
            showNotif(`🎉 Lucky Spin reward: +${reward} pts`);
        }, 1500);
    };

    const completeSurpriseMission = () => {
        if (surpriseMission.done) return;
        setPoints((p) => p + surpriseMission.reward);
        setSurpriseMission((prev) => ({ ...prev, done: true }));
        showNotif(`✨ Surprise mission done! +${surpriseMission.reward} pts`);
    };

    const rerollSurpriseMission = () => {
        const picked = SURPRISE_MISSIONS[Math.floor(Math.random() * SURPRISE_MISSIONS.length)];
        setSurpriseMission({ ...picked, done: false });
        showNotif('🔄 Surprise mission refreshed.');
    };

    const joinTeamChallenge = (challengeId: string) => {
        if (!user) return;

        const initials = user.name
            .split(' ')
            .map((chunk) => chunk[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        let awardedBonus = false;

        setTeamChallenges((prev) =>
            prev.map((challenge) => {
                if (challenge.id !== challengeId) return challenge;

                const alreadyJoined = challenge.members.some((member) => member.name === user.name);
                if (alreadyJoined) {
                    showNotif('✅ You already joined this challenge.');
                    return challenge;
                }

                const nextCompleted = Math.min(challenge.target, challenge.completed + 1);
                const reachedGoal = nextCompleted >= challenge.target;

                if (reachedGoal && !challenge.bonusAwarded) {
                    awardedBonus = true;
                }

                return {
                    ...challenge,
                    completed: nextCompleted,
                    members: [...challenge.members, { name: user.name, initials }],
                    bonusAwarded: challenge.bonusAwarded || reachedGoal,
                };
            })
        );

        showNotif('🤝 Joined challenge team!');

        if (awardedBonus) {
            setPoints((p) => p + 50);
            setTeamConfettiChallengeId(challengeId);
            showNotif('🎉 Team challenge completed! +50 bonus pts');
            setTimeout(() => setTeamConfettiChallengeId((prev) => (prev === challengeId ? null : prev)), 1200);
        }
    };

    // --- ONBOARDING RENDER ---
    if (!hasSeenOnboarding) {
        return (
            <div className={`onboarding-shell ${onboardingExit ? 'exit' : ''}`}>
                <div className="onboarding-top">
                    <img src={LOGO_URL} alt="AURA Logo" className="onboarding-logo" />
                    <div className="onboarding-tagline" aria-label="Earn. Rise. Lead.">
                        <span>Earn.</span>
                        <span>Rise.</span>
                        <span>Lead.</span>
                    </div>
                </div>

                <div
                    className="onboarding-slider"
                    onTouchStart={handleOnboardingSwipeStart}
                    onTouchEnd={handleOnboardingSwipeEnd}
                >
                    <div className="onboarding-track" style={{ transform: `translateX(-${onboardingIndex * 100}%)` }}>
                        {ONBOARDING_CARDS.map((card, idx) => (
                            <div
                                className={`onboarding-card ${idx === onboardingIndex ? 'active' : ''}`}
                                key={card.title}
                                onClick={() => setOnboardingIndex(idx)}
                            >
                                <div className="onboarding-card-icon">{card.icon}</div>
                                <div className="onboarding-card-title">{card.title}</div>
                                <div className="onboarding-card-text">{card.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="onboarding-controls">
                    <button
                        type="button"
                        className="onboarding-nav"
                        onClick={() => setOnboardingIndex((prev) => (prev - 1 + ONBOARDING_CARDS.length) % ONBOARDING_CARDS.length)}
                    >
                        ‹
                    </button>

                    <div className="onboarding-dots">
                        {ONBOARDING_CARDS.map((card, idx) => (
                            <button
                                type="button"
                                key={card.title}
                                className={`onboarding-dot ${idx === onboardingIndex ? 'active' : ''}`}
                                onClick={() => setOnboardingIndex(idx)}
                                aria-label={`Go to ${card.title}`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="onboarding-nav"
                        onClick={() => setOnboardingIndex((prev) => (prev + 1) % ONBOARDING_CARDS.length)}
                    >
                        ›
                    </button>
                </div>

                <button type="button" className="btn btn-yellow onboarding-cta" onClick={completeOnboarding}>
                    Get Started
                </button>
            </div>
        );
    }

    // --- LOGIN SCREEN RENDER ---
    if (!isLoggedIn) {
        return (
            <div className="app-shell" style={{ justifyContent: 'center' }}>
                <div className="login-screen">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <img src={LOGO_URL} alt="AURA Logo" style={{ width: '240px', height: 'auto' }} />
                        <div className="login-subtitle" style={{ marginTop: '10px' }}>Powering Student Contributions</div>
                    </div>

                    <div className="login-card">
                        <div className="login-toggle">
                            <button
                                className={`toggle-btn ${loginRole === 'student' ? 'active' : ''}`}
                                onClick={() => setLoginRole('student')}
                            >Student</button>
                            <button
                                className={`toggle-btn ${loginRole === 'admin' ? 'active' : ''}`}
                                onClick={() => setLoginRole('admin')}
                            >Admin</button>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label className="input-label">FULL NAME</label>
                                <input type="text" name="name" className="login-input" placeholder="e.g. John Doe" required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">ROLL NO</label>
                                <input type="text" name="rollNo" className="login-input" placeholder="e.g. 21X41A05XX" required />
                            </div>

                            {loginRole === 'student' && (
                                <div className="input-group">
                                    <label className="input-label">PRIMARY DOMAIN</label>
                                    <select name="domain" className="login-select" required>
                                        <option value="">Select Domain</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Tech">Tech</option>
                                        <option value="Media">Media</option>
                                        <option value="Events">Events</option>
                                    </select>
                                </div>
                            )}

                            <button type="submit" className="btn btn-yellow" style={{ width: '100%', marginTop: '12px', padding: '14px' }}>
                                Login to Dashboard
                            </button>
                        </form>
                    </div>
                </div>
                <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
            </div>
        );
    }

    // --- MAIN APP RENDER ---
    return (
        <div className="app-shell">
            {/* TOP BAR */}
            <div className="topbar">
                <div className="topbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={LOGO_URL} alt="AURA" style={{ height: '32px', width: 'auto' }} />
                    <span>AURA</span>
                </div>
                <div className="topbar-stats">
                    <div className="stat-pill streak-pill"><FlameIcon hot={streak > 7} /><span className="streak-count">{streak}</span></div>
                    <div className="stat-pill"><span className="icon">🪙</span> {animatedTopPoints} pts</div>
                </div>
            </div>

            {/* PATH SCREEN */}
            <div className={`screen ${currentScreen === 'path' ? 'active' : ''} fade-in`}>
                <div className="quest-bar">
                    <div className="quest-title">⚡ DAILY QUEST: Ask 1 question in a seminar!</div>
                    <div className="quest-sub">Reward: +15 pts &nbsp;|&nbsp; Progress: 0/1</div>
                    <div className="quest-progress"><div className="quest-progress-fill" style={{ width: '0%', transition: 'width 1s ease' }}></div></div>
                </div>

                <div className="wow-strip">
                    <div className="wow-card spin-card">
                        <div className="wow-title">🎰 Lucky Spin</div>
                        <div className={`spin-wheel ${isSpinning ? 'spinning' : ''}`}>🎡</div>
                        <div className="wow-sub">Daily random reward for active members</div>
                        <button className="btn btn-yellow" onClick={playLuckySpin} disabled={spinUsed || isSpinning}>
                            {isSpinning ? 'Spinning...' : spinUsed ? 'Used Today' : 'Spin Now'}
                        </button>
                        {spinReward && <div className="wow-reward">+{spinReward} pts unlocked</div>}
                    </div>

                    <div className="wow-card mission-card">
                        <div className="wow-title">🧩 Surprise Mission</div>
                        <div className="wow-mission-text">{surpriseMission.title}</div>
                        <div className="wow-sub">Reward: +{surpriseMission.reward} pts</div>
                        <div className="wow-actions">
                            <button className="btn btn-green" onClick={completeSurpriseMission} disabled={surpriseMission.done}>
                                {surpriseMission.done ? 'Completed' : 'Claim'}
                            </button>
                            <button className="btn btn-outline" onClick={rerollSurpriseMission}>Reroll</button>
                        </div>
                    </div>
                </div>

                <div className="achievement-ticker">
                    {[
                        `🏆 Rank momentum: +${Math.max(1, Math.floor(points / 120))} positions this week`,
                        `🔥 Streak power: ${streak} day consistency`,
                        `🗺️ Path progress: ${pathNodes.filter(n => n.state === 'done').length}/${pathNodes.length} nodes done`,
                        `⚡ Community pulse: ${users.filter(u => u.available).length} peers available now`,
                    ][tickerIndex]}
                </div>

                <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
                    <img src={LOGO_URL} alt="AURA" style={{ width: '100px', height: 'auto', opacity: 0.9 }} />
                </div>

                <div className="section-title">🧭 Your Activity Path</div>
                <div className="path-nodes">
                    {pathNodes.map((node, i) => (
                        <div className="path-node-wrap" key={node.id}>
                            {i > 0 && (
                                <div
                                    className={`path-connector-simple ${i % 2 === 0 ? 'to-left' : 'to-right'} ${connectorState(pathNodes[i - 1].state)}`}
                                    aria-hidden="true"
                                >
                                    <span className="path-arrow-head"></span>
                                </div>
                            )}
                            <div
                                className={`path-node ${node.state} ${bouncingNodeId === node.id ? 'tap-bounce' : ''}`}
                                onClick={() => handleNodeTap(node)}
                            >
                                <span className="node-icon">{node.icon}</span>
                                {node.state === 'done' && (
                                    <div className="done-check" aria-label="Completed">
                                        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                                            <circle cx="12" cy="12" r="12" fill="#2ECC71" />
                                            <path d="M7.2 12.4l3 3.2 6.6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                                {node.state === 'pending' && <div className="done-check" style={{ background: '#2196F3' }}>⏳</div>}
                                {node.state === 'locked' && (
                                    <div className="lock-icon" aria-label="Locked">
                                        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                                            <path d="M8 10V7a4 4 0 1 1 8 0v3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                            <rect x="5" y="10" width="14" height="10" rx="2" fill="#7d7d7d" stroke="#fff" strokeWidth="1.2" />
                                            <circle cx="12" cy="15" r="1.2" fill="#fff" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="path-node-label">{node.label}</div>
                            <div className="path-node-sub">{node.sub}</div>
                            <div className="path-node-pts">{node.pts}</div>

                            <div className={`path-node-animation ${nodeAnimationSide(i)}`}>
                                <DotLottieReact
                                    src={pickNodeAnimation(node.id + i).src}
                                    loop
                                    autoplay
                                    style={{ width: '78px', height: '78px' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EVENTS SCREEN */}
            <div className={`screen ${currentScreen === 'events' ? 'active' : ''} fade-in`}>
                <div className="section-title">📅 Upcoming Campus Events</div>
                <div id="events-list" style={{ padding: '0 16px' }}>
                    {events.filter(e => !registeredSet.has(e.id) && !declinedSet.has(e.id)).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No more events found. You've answered all calls! 🔔</div>
                    ) : (
                        events.filter(e => !registeredSet.has(e.id) && !declinedSet.has(e.id)).map(e => (
                            <div key={e.id} className="card" style={{ margin: '0 0 16px 0', border: '1px solid #f0f0f0', background: '#fff' }}>
                                <div className="card-inner">
                                    <div style={{ fontWeight: 900, color: 'var(--dark)' }}>{e.title}</div>
                                    <div style={{ fontSize: '.75rem', color: 'var(--green-dark)', fontWeight: 800, margin: '4px 0' }}>📍 {e.loc} · 📅 {e.date} · Cost: 🪙 15 pts</div>
                                    <div style={{ fontSize: '.82rem', color: '#666' }}>{e.desc}</div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <button className="btn btn-green" style={{ flex: 1, fontSize: '.75rem', padding: '8px' }} onClick={() => {
                                            if (points >= 15) {
                                                setRegisteredSet(new Set(registeredSet.add(e.id)));
                                                setPoints(p => p - 15);
                                                showNotif(`📅 Registered for ${e.title}! -15 pts`);
                                            } else {
                                                showNotif('⚠️ Not enough points to register!');
                                            }
                                        }}>Register (15 pts)</button>
                                        <button className="btn btn-red" style={{ flex: 1, fontSize: '.75rem', padding: '8px' }} onClick={() => {
                                            setDeclinedSet(new Set(declinedSet.add(e.id)));
                                            showNotif(`❌ You declined ${e.title}`);
                                        }}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* LEADERBOARD SCREEN */}
            <div className={`screen ${currentScreen === 'leaderboard' ? 'active' : ''} fade-in`}>
                <div className="lb-header">
                    <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>🏆 Leaderboard</div>
                </div>
                <div className="lb-domain-select">
                    {['Academic', 'Tech', 'Media', 'Events'].map(d => (
                        <div key={d} className={`domain-chip ${lbDomain === d ? 'active' : ''}`} onClick={() => setLbDomain(d)}>{d}</div>
                    ))}
                </div>
                <div id="lb-list">
                    {lbData[lbDomain]?.map(item => (item.you ? { ...item, name: user?.name || item.name, pts: points } : item))
                        .sort((a, b) => b.pts - a.pts)
                        .map((item, i) => (
                            <div className={`lb-row ${item.you ? 'you' : ''}`} key={i}>
                                <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}`}>{i + 1}</div>
                                <div style={{ position: 'relative' }}>
                                    <div className="avatar sm" style={{ background: avatarColor(item.name) }}>{item.name[0]}</div>
                                    {item.you && <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--yellow)', color: '#000', borderRadius: '3px', fontSize: '.5rem', fontWeight: 800, padding: '0 3px' }}>YOU</div>}
                                </div>
                                <div className="lb-name">{item.name} {item.you && <span style={{ fontSize: '.7rem', color: '#999' }}>(you)</span>}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div className="lb-pts">🪙 {item.pts}</div>
                                    {item.promo && <div className="promo-tag">▲ Promo</div>}
                                    {item.demo && <div className="demo-tag">▼ Demo</div>}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* USERS SCREEN */}
            <div className={`screen ${currentScreen === 'users' ? 'active' : ''} fade-in`}>
                <div className="section-title">👥 Contributors Directory</div>
                <div className="search-bar">
                    <span>🔍</span>
                    <input type="text" placeholder="Search by Name, Domain, or Badge..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
                <div style={{ padding: '4px 16px 8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['All', 'Tech', 'Academic', 'Engagement'].map(d => (
                        <div key={d} className={`domain-chip ${userFilterDomain === d ? 'active' : ''}`} onClick={() => setUserFilterDomain(d)}>{d}</div>
                    ))}
                </div>
                <div id="users-list">
                    {filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '.9rem' }}>No contributors found 😕</div>
                    ) : (
                        filteredUsers.map((u, i) => (
                            <div className="user-row" key={i} onClick={() => setModal({ isOpen: true, type: 'user', data: u })}>
                                <div className="avatar" style={{ background: avatarColor(u.name) }}>{u.initials}</div>
                                <div className="user-info">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div className="user-name">{u.name}</div>
                                        <div className="pts-chip">🪙 {u.pts}</div>
                                    </div>
                                    <div className="user-role">{u.role}</div>
                                    <div className="user-badges">{u.badges.map((b, bi) => <span className="badge-pill badge-green" key={bi}>{b}</span>)}</div>
                                    <div className={`avail-tag ${u.available ? 'avail-yes' : 'avail-no'}`}>
                                        {u.available ? '✅ Available for Peer Review' : '⛔ Not Available'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* TEAM CHALLENGES SCREEN */}
            <div className={`screen ${currentScreen === 'team' ? 'active' : ''} fade-in`}>
                <div className="section-title">👥 Team Challenges</div>
                <div style={{ padding: '0 16px 6px', fontSize: '.82rem', color: '#666', fontWeight: 700 }}>
                    Join mission squads, complete goals together, unlock bonus rewards.
                </div>

                <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {teamChallenges.map((challenge) => {
                        const progressPct = Math.min(100, (challenge.completed / challenge.target) * 100);

                        return (
                            <div className="card team-challenge-card" key={challenge.id} style={{ margin: 0, position: 'relative' }}>
                                {teamConfettiChallengeId === challenge.id && (
                                    <div className="team-confetti-burst" aria-hidden="true">
                                        {Array.from({ length: 18 }, (_, idx) => (
                                            <span
                                                className="team-confetti-dot"
                                                key={idx}
                                                style={{
                                                    left: `${10 + (idx * 5) % 80}%`,
                                                    animationDelay: `${(idx % 6) * 0.03}s`,
                                                    background: ['#2ecc71', '#ffd63f', '#f9a825', '#22c55e', '#ff8a00'][idx % 5],
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                        <div style={{ fontWeight: 900, color: 'var(--dark)', fontSize: '.96rem' }}>{challenge.title}</div>
                                        <span className="badge-pill badge-yellow" style={{ margin: 0 }}>{challenge.domain}</span>
                                    </div>

                                    <div style={{ fontSize: '.74rem', color: '#666', fontWeight: 700 }}>Deadline: {challenge.deadline}</div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 800 }}>
                                        <span>Progress</span>
                                        <span>{challenge.completed}/{challenge.target} done</span>
                                    </div>
                                    <div className="progress-bar" style={{ marginBottom: 0 }}>
                                        <div className="progress-fill yellow" style={{ width: `${progressPct}%` }}></div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        {challenge.members.map((member) => (
                                            <div
                                                key={member.name}
                                                title={member.name}
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    background: avatarColor(member.name),
                                                    color: '#111',
                                                    fontWeight: 900,
                                                    fontSize: '.68rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,.12)',
                                                }}
                                            >
                                                {member.initials}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-yellow"
                                        style={{ width: '100%' }}
                                        onClick={() => joinTeamChallenge(challenge.id)}
                                    >
                                        Join Challenge
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PROFILE SCREEN */}
            <div className={`screen ${currentScreen === 'profile' ? 'active' : ''} fade-in`}>
                <div className="profile-hero">
                    <div className="avatar lg" style={{ margin: '0 auto', background: 'rgba(0,0,0,.15)', color: 'var(--dark)' }}>{user?.name[0] || 'U'}</div>
                    <div className="profile-name">{user?.name}</div>
                    <div className="profile-title">{user?.rollNo} • {user?.domain} {user?.role === 'admin' ? '(Admin)' : ''}</div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>{animatedProfilePoints}</div><div style={{ fontSize: '.72rem', opacity: .7 }}>Points</div></div>
                        <div style={{ width: '1px', background: 'rgba(0,0,0,.15)' }}></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}>3</div><div style={{ fontSize: '.72rem', opacity: .7 }}>Badges</div></div>
                        <div style={{ width: '1px', background: 'rgba(0,0,0,.15)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="profile-streak-value" style={{ fontFamily: "'Fredoka One'", fontSize: '1.3rem' }}><FlameIcon hot={streak > 7} />{streak}</div>
                            <div style={{ fontSize: '.72rem', opacity: .7 }}>Streak</div>
                        </div>
                    </div>
                </div>
                <div className="progress-block">
                    <div className="progress-label"><span>Overall Progress → Level 2: Leader</span><span>{points}/1000 pts</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${(points / 1000) * 100}%` }}></div></div>
                    <div className="progress-label"><span>Current Domain: {user?.domain}</span><span>250/500 pts</span></div>
                    <div className="progress-bar"><div className="progress-fill yellow" style={{ width: '50%' }}></div></div>
                </div>
                <div className="section-title">🎖️ Badges</div>
                <div className="badges-grid">
                    {badgesData.map((b, i) => (
                        <div className={`badge-item ${b.earned ? '' : 'locked-badge'}`} key={i} onClick={() => b.earned && showNotif('🎖️ ' + b.name + ' — Earned!')}>
                            <div className="badge-icon">{b.icon}</div>
                            <div className="badge-name">{b.name}</div>
                        </div>
                    ))}
                </div>
                <div className="section-title">📋 Recent Validations</div>
                <div id="activity-list">
                    {activityData.map((a, i) => (
                        <div className="activity-row" key={i}><div className="time">{a.time}</div><div className="act-text">✅ {a.text}</div><div className="act-pts">{a.pts}</div></div>
                    ))}
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        className="btn"
                        style={{ width: '100%', background: '#0A66C2', color: '#fff' }}
                        onClick={shareContributionOnLinkedIn}
                    >
                        Share Contribution on LinkedIn
                    </button>
                    <button className="btn btn-outline" style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }} onClick={handleLogout}>🚪 Logout</button>
                </div>
            </div>

            {/* APPROVALS SCREEN */}
            <div className={`screen ${currentScreen === 'admin' ? 'active' : ''} fade-in`}>
                <div style={{ background: 'var(--dark)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.1rem', color: '#fff' }}>Approvals Mode</div>
                </div>
                <div className="admin-tabs">
                    <div className={`admin-tab ${adminTab === 'queue' ? 'active' : ''}`} onClick={() => setAdminTab('queue')}>Queue</div>
                    <div className={`admin-tab ${adminTab === 'path' ? 'active' : ''}`} onClick={() => setAdminTab('path')}>Path Edit</div>
                </div>

                {adminTab === 'queue' && (
                    <div id="admin-queue">
                        {pendingQueue.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>All caught up! 🎉</div>
                        ) : (
                            pendingQueue.map(s => (
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
                                        <button className="btn btn-green" onClick={() => approveSubmission(s.id, s.pts)}>✓ Approve</button>
                                        <button className="btn btn-red" onClick={() => rejectSubmission(s.id)}>✗ Reject</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {adminTab === 'validated' && (
                    <div id="admin-validated">
                        {[...adminValidated, ...adminQueue.filter(s => approvedSet.has(s.id))].map((s, i) => (
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
                            <input id="new-node-label" type="text" placeholder="Activity Name (e.g. Design Challenge)" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} />
                            <input id="new-node-pts" type="text" placeholder="Points (e.g. +40 pts)" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} />
                            <button className="btn btn-yellow" style={{ width: '100%' }} onClick={() => {
                                const label = (document.getElementById('new-node-label') as HTMLInputElement).value;
                                const pts = (document.getElementById('new-node-pts') as HTMLInputElement).value;
                                if (label && pts) {
                                    const newNode = {
                                        id: pathNodes.length + 1,
                                        icon: '🌟',
                                        label: label,
                                        sub: `Activity added by Admin`,
                                        pts: pts,
                                        state: 'locked' as const,
                                        proofType: 'Evidence of completion',
                                        domain: 'General'
                                    };
                                    setPathNodes([...pathNodes, newNode]);
                                    (document.getElementById('new-node-label') as HTMLInputElement).value = '';
                                    (document.getElementById('new-node-pts') as HTMLInputElement).value = '';
                                    showNotif('🗺️ Path Updated for Students!');
                                }
                            }}>➕ Add Activity</button>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#999', marginBottom: '8px' }}>CURRENT PATH PREVIEW:</div>
                        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                            {pathNodes.map(n => (
                                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontSize: '1.2rem' }}>{n.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '.85rem' }}>{n.label}</div>
                                        <div style={{ fontSize: '.72rem', color: '#666' }}>{n.pts} · {n.state}</div>
                                    </div>
                                    <button
                                        style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', padding: '8px' }}
                                        onClick={() => {
                                            if (confirm(`Remove "${n.label}"?`)) {
                                                setPathNodes(pathNodes.filter(node => node.id !== n.id));
                                                showNotif('🗑️ Activity Removed');
                                            }
                                        }}
                                    >🗑️</button>
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
                            <input id="ev-title" type="text" placeholder="Event Title" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} />
                            <input id="ev-date" type="text" placeholder="Date/Time" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} />
                            <input id="ev-loc" type="text" placeholder="Location" className="search-bar" style={{ width: '100%', marginBottom: '10px', height: '42px', padding: '0 12px' }} />
                            <textarea id="ev-desc" placeholder="Details" className="search-bar" style={{ width: '100%', marginBottom: '10px', minHeight: '80px', padding: '12px', border: 'none', background: '#f5f5f5', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }} />
                            <button className="btn btn-yellow" style={{ width: '100%' }} onClick={() => {
                                const title = (document.getElementById('ev-title') as HTMLInputElement).value;
                                const date = (document.getElementById('ev-date') as HTMLInputElement).value;
                                const loc = (document.getElementById('ev-loc') as HTMLInputElement).value;
                                const desc = (document.getElementById('ev-desc') as HTMLTextAreaElement).value;
                                if (title && date) {
                                    const newEvent = { id: Date.now(), title, date, loc, desc };
                                    setEvents([newEvent, ...events]);
                                    (document.getElementById('ev-title') as HTMLInputElement).value = '';
                                    (document.getElementById('ev-date') as HTMLInputElement).value = '';
                                    (document.getElementById('ev-loc') as HTMLInputElement).value = '';
                                    (document.getElementById('ev-desc') as HTMLTextAreaElement).value = '';
                                    showNotif('📅 Event Published Successfully!');
                                }
                            }}>➕ Publish Event</button>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#999', marginBottom: '8px' }}>LIVE EVENTS:</div>
                        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                            {events.map(e => (
                                <div key={e.id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: 800, fontSize: '.85rem' }}>{e.title}</div>
                                        <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setEvents(events.filter(ev => ev.id !== e.id))}>🗑️</button>
                                    </div>
                                    <div style={{ fontSize: '.72rem', color: 'var(--green-dark)', fontWeight: 700 }}>{e.date} · {e.loc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM NAV */}
            <div className="bottom-nav">
                <button className={`nav-item ${currentScreen === 'path' ? 'active' : ''}`} onClick={() => setCurrentScreen('path')}>
                    <span className="nav-icon">🧭</span>Path
                </button>
                {user?.role === 'student' && (
                    <button className={`nav-item ${currentScreen === 'events' ? 'active' : ''}`} onClick={() => setCurrentScreen('events')}>
                        <span className="nav-icon">📅</span>Events
                    </button>
                )}
                <button className={`nav-item ${currentScreen === 'leaderboard' ? 'active' : ''}`} onClick={() => setCurrentScreen('leaderboard')}>
                    <span className="nav-icon">🏆</span>Leaderboard
                </button>
                <button className={`nav-item ${currentScreen === 'users' ? 'active' : ''}`} onClick={() => setCurrentScreen('users')}>
                    <span className="nav-icon">👥</span>Users
                </button>
                <button className={`nav-item ${currentScreen === 'team' ? 'active' : ''}`} onClick={() => setCurrentScreen('team')}>
                    <span className="nav-icon">👨‍👩‍👧‍👦</span>Team
                </button>
                {user?.role === 'admin' && (
                    <button className={`nav-item ${currentScreen === 'admin' ? 'active' : ''}`} onClick={() => setCurrentScreen('admin')}>
                        <span className="nav-icon">🔑</span>Approvals
                    </button>
                )}
                <button className={`nav-item ${currentScreen === 'profile' ? 'active' : ''}`} onClick={() => setCurrentScreen('profile')}>
                    <span className="nav-icon">👤</span>Profile
                </button>
            </div>

            {/* MODAL */}
            <div className={`modal-overlay ${modal.isOpen ? 'open' : ''}`} onClick={closeModal}>
                <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-handle"></div>
                    {modal.type === 'node' && modal.data && (
                        <>
                            <div className="modal-title">{modal.data.icon} {modal.data.label}</div>
                            <div style={{ fontSize: '.75rem', color: 'var(--green-dark)', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span>🧩 Require Proof:</span>
                                <span style={{ background: '#E8F5E9', padding: '2px 8px', borderRadius: '6px' }}>{modal.data.proofType}</span>
                            </div>
                            <p style={{ fontSize: '.85rem', color: '#666', marginBottom: '12px' }}>{modal.data.sub} · {modal.data.pts}</p>
                            {modal.data.state === 'done' ? (
                                <div style={{ background: '#E8F5E9', borderRadius: '10px', padding: '12px', textAlign: 'center', fontWeight: 800, color: '#2E7D32' }}>✅ Completed!</div>
                            ) : modal.data.state === 'pending' ? (
                                <div style={{ background: '#E3F2FD', borderRadius: '10px', padding: '12px', textAlign: 'center', fontWeight: 800, color: '#1565C0' }}>⏳ Awaiting Admin Approval...</div>
                            ) : (
                                <>
                                    <p style={{ fontSize: '.88rem', marginBottom: '16px' }}>Complete this activity to earn <strong>{modal.data.pts}</strong>. Attach evidence to verify.</p>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label className="input-label">ATTACH EVIDENCE (IMAGE/DOC)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {/* FILES PICKER */}
                                            <div
                                                style={{ flex: 1, border: '2px dashed #ddd', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f9f9f9', transition: 'all 0.2s' }}
                                                onClick={() => document.getElementById('proof-upload-files')?.click()}
                                            >
                                                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📄</div>
                                                <div style={{ fontSize: '.75rem', color: '#666', fontWeight: 700 }}>Select Files</div>
                                            </div>
                                            {/* FOLDER PICKER */}
                                            <div
                                                style={{ flex: 1, border: '2px dashed #ddd', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#f9f9f9', transition: 'all 0.2s' }}
                                                onClick={() => document.getElementById('proof-upload-folder')?.click()}
                                            >
                                                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📂</div>
                                                <div style={{ fontSize: '.75rem', color: '#666', fontWeight: 700 }}>Select Folder</div>
                                            </div>
                                        </div>

                                        {/* Hidden Inputs */}
                                        <input
                                            type="file"
                                            id="proof-upload-files"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files && files.length > 0) {
                                                    const text = files.length > 1 ? `${files.length} Files Selected` : files[0].name;
                                                    setModal(prev => ({ ...prev, data: { ...prev.data, attachedFile: text, isFolder: false } }));
                                                    showNotif(`📎 ${text} attached!`);
                                                }
                                            }}
                                        />
                                        <input
                                            type="file"
                                            id="proof-upload-folder"
                                            style={{ display: 'none' }}
                                            {...({ webkitdirectory: "", directory: "" } as any)}
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files && files.length > 0) {
                                                    const text = `Folder with ${files.length} files`;
                                                    setModal(prev => ({ ...prev, data: { ...prev.data, attachedFile: text, isFolder: true } }));
                                                    showNotif(`📎 ${text} attached!`);
                                                }
                                            }}
                                        />

                                        {modal.data.attachedFile && (
                                            <div style={{ marginTop: '8px', fontSize: '.78rem', color: 'var(--green-dark)', fontWeight: 800, textAlign: 'center' }}>
                                                {modal.data.isFolder ? '📂' : '📄'} {modal.data.attachedFile}
                                            </div>
                                        )}
                                    </div>

                                    {modal.data.isChecking ? (
                                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                            <div style={{ marginBottom: '8px', fontSize: '.82rem', fontWeight: 800, color: 'var(--gray)' }}>🔍 AI Originality Scan: {modal.data.checkProgress}%</div>
                                            <div className="progress-bar"><div className="progress-fill yellow" style={{ width: `${modal.data.checkProgress}%`, borderRadius: '10px' }}></div></div>
                                            <p style={{ marginTop: '8px', fontSize: '.75rem', fontStyle: 'italic' }}>Detecting AI generation & duplicates...</p>
                                        </div>
                                    ) : modal.data.checkResult === 'pass' ? (
                                        <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
                                            <div style={{ fontSize: '1.5rem' }}>✅</div>
                                            <div style={{ fontWeight: 800, color: '#2E7D32', fontSize: '.9rem' }}>Original Content Verified!</div>
                                            <div style={{ fontSize: '.75rem', opacity: 0.7 }}>Secure Hash: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</div>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-yellow"
                                            style={{ width: '100%', marginBottom: '8px' }}
                                            onClick={() => {
                                                if (!modal.data.attachedFile) { showNotif('⚠️ Attach evidence first!'); return; }
                                                setModal(prev => ({ ...prev, data: { ...prev.data, isChecking: true, checkProgress: 0 } }));

                                                let prog = 0;
                                                const interval = setInterval(() => {
                                                    prog += 4;
                                                    setModal(prev => ({ ...prev, data: { ...prev.data, checkProgress: prog } }));
                                                    if (prog >= 100) {
                                                        clearInterval(interval);
                                                        setTimeout(() => {
                                                            setModal(prev => ({ ...prev, data: { ...prev.data, isChecking: false, checkResult: 'pass' } }));
                                                            showNotif('🛡️ Evidence Verified: Original');
                                                        }, 500);
                                                    }
                                                }, 80);
                                            }}
                                        >
                                            🛡️ Scan & Submit Proof
                                        </button>
                                    )}

                                    {modal.data.checkResult === 'pass' && (
                                        <button className="btn btn-yellow" style={{ width: '100%', marginBottom: '8px' }} onClick={() => completeNode(modal.data.id)}>
                                            🎁 Claim {modal.data.pts}
                                        </button>
                                    )}
                                </>
                            )}
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }} onClick={closeModal}>Close</button>
                        </>
                    )}
                    {modal.type === 'user' && modal.data && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                <div className="avatar lg" style={{ background: avatarColor(modal.data.name) }}>{modal.data.initials}</div>
                                <div>
                                    <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.2rem' }}>{modal.data.name}</div>
                                    <div style={{ fontSize: '.82rem', color: '#666' }}>{modal.data.role}</div>
                                    <div className="pts-chip" style={{ display: 'inline-block', marginTop: '4px' }}>🪙 {modal.data.pts} pts</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>{modal.data.badges.map((b: string, bi: number) => <span className="badge-pill badge-green" key={bi}>{b}</span>)}</div>
                            {modal.data.available ? (
                                <button className="btn btn-yellow" style={{ width: '100%', marginBottom: '8px' }} onClick={() => { closeModal(); showNotif('📨 Review request sent to ' + modal.data.name + '!'); }}>🤝 Request Peer Review</button>
                            ) : (
                                <div className="badge-pill badge-red" style={{ padding: '8px 14px' }}>⛔ Not available for review</div>
                            )}
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }} onClick={closeModal}>Close</button>
                        </>
                    )}
                </div>
            </div>

            {/* NOTIFICATION */}
            <div className={`notif ${notif.show ? 'show' : ''}`}>{notif.msg}</div>
            {pointsDeltaToast && <div className="points-rise-toast">+{pointsDeltaToast.delta} pts</div>}

            <style>{`
                .team-challenge-card .badge-yellow {
                    background: #fff7ce;
                    color: #7a6200;
                    border: 1px solid #efd57a;
                }

                .team-confetti-burst {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 5;
                }

                .team-confetti-dot {
                    position: absolute;
                    top: 48%;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    opacity: 0;
                    animation: teamConfettiRise 1.2s ease-out forwards;
                }

                @keyframes teamConfettiRise {
                    0% {
                        opacity: 0;
                        transform: translateY(6px) scale(.6);
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-54px) translateX(8px) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
