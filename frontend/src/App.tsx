import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
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
import type { LeaderboardEntry } from './data/mockData';
import TeamScreen from './components/TeamScreen';
const PathScreen = lazy(() => import('./components/PathScreen'));
const EventsScreen = lazy(() => import('./components/EventsScreen'));
const LeaderboardScreen = lazy(() => import('./components/LeaderboardScreen'));
const UsersScreen = lazy(() => import('./components/UsersScreen'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const AdminScreen = lazy(() => import('./components/AdminScreen'));
const StudentSettingsScreen = lazy(() => import('./components/StudentSettingsScreen'));
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import NotifToast from './components/NotifToast';
import Modal from './components/Modal';

interface PathNode {
    id: number;
    icon: string;
    label: string;
    sub: string;
    pts: string;
    state: 'done' | 'active' | 'locked' | 'pending';
    domain: string;
    proofType: string;
}

interface UserData {
    initials: string;
    name: string;
    role: string;
    pts: number;
    badges: string[];
    available: boolean;
    domain: string;
}

interface AdminQueueItem {
    initials: string;
    name: string;
    time: string;
    task: string;
    desc: string;
    pts: number;
    hasImg: boolean;
    id: string;
    nodeId?: number;
}

interface Event {
    id: number;
    title: string;
    date: string;
    loc: string;
    desc: string;
}

interface SurpriseMission {
    title: string;
    reward: number;
    done: boolean;
}

interface TeamChallenge {
    id: string;
    title: string;
    domain: string;
    deadline: string;
    target: number;
    completed: number;
    members: Array<{ name: string; initials: string }>;
    bonusAwarded: boolean;
}

interface LiveTickerItem {
    id: string;
    text: string;
    screen: string;
    lbDomain?: string;
}

type ModalState =
    | { isOpen: false; type: ''; data: null }
    | { isOpen: true; type: 'node'; data: PathNode }
    | { isOpen: true; type: 'user'; data: UserData };

// --- HELPERS ---
const avatarColor = (name: string): string => {
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
const GITHUB_REPO_URL_REGEX = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/.*)?$/i;
const EVENT_KEYWORD_REGEX = /event|workshop|bootcamp|festival|meet|night|seminar/i;
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

const pickNodeAnimation = (seed: number): { label: string; src: string } => {
    const index = Math.abs((seed * 9301 + 49297) % 233280) % PATH_ANIMATIONS.length;
    return PATH_ANIMATIONS[index];
};

const nodeAnimationSide = (rowIndex: number): 'left' | 'right' => (rowIndex % 2 === 0 ? 'right' : 'left');
const connectorState = (state: string): 'done' | 'active' | 'locked' => {
    if (state === 'done') return 'done';
    if (state === 'active' || state === 'pending') return 'active';
    return 'locked';
};

const requiresGithubUrl = (proofType?: string): boolean => /github|repository/i.test(proofType || '');

const FlameIcon = ({ hot }: { hot: boolean }) => (
    <svg className={`streak-flame ${hot ? 'hot' : ''}`} viewBox="0 0 24 24" aria-hidden="true" role="img">
        <path d="M12 2C13 5 17 6.5 17 11a5 5 0 1 1-10 0c0-2.2 1.2-3.7 2.6-5.1C10.8 4.7 11.5 3.6 12 2z" fill="#ff8a00" />
        <path d="M12.2 8c.3 1.3 1.8 1.8 1.8 3.6a2.7 2.7 0 1 1-5.4 0c0-1.3.8-2.1 1.6-2.9.7-.7 1.5-1.3 2-2.7z" fill="#ffd63f" />
    </svg>
);

const ScreenFallback = () => (
    <div className="suspense-spinner-wrap">
        <div className="suspense-spinner" aria-label="Loading" />
    </div>
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
    const [modal, setModal] = useState<ModalState>({ isOpen: false, type: '', data: null });

    // Data States
    const [pathNodes, setPathNodes] = useState<PathNode[]>(initialPathNodes as PathNode[]);
    const [users, setUsers] = useState<UserData[]>(initialUsersData as UserData[]);
    const [adminQueue, setAdminQueue] = useState<AdminQueueItem[]>(initialAdminQueue as AdminQueueItem[]);
    const [adminValidated, setAdminValidated] = useState<AdminQueueItem[]>(initialAdminValidated as AdminQueueItem[]);
    const [adminRejected, setAdminRejected] = useState<AdminQueueItem[]>(initialAdminRejected as AdminQueueItem[]);
    const [events, setEvents] = useState<Event[]>(initialEvents as Event[]);
    const [approvedSet, setApprovedSet] = useState(new Set<string>());
    const [rejectedSet, setRejectedSet] = useState(new Set<string>());
    const [registeredSet, setRegisteredSet] = useState(new Set<number>());
    const [declinedSet, setDeclinedSet] = useState(new Set<number>());
    const [spinUsed, setSpinUsed] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinReward, setSpinReward] = useState<number | null>(null);
    const [tickerIndex, setTickerIndex] = useState(0);
    const [surpriseMission, setSurpriseMission] = useState<SurpriseMission>(() => {
        const picked = SURPRISE_MISSIONS[Math.floor(Math.random() * SURPRISE_MISSIONS.length)];
        return { ...picked, done: false };
    });
    const [teamChallenges, setTeamChallenges] = useState<TeamChallenge[]>(
        TEAM_CHALLENGES_SEED.map((c) => ({ ...c, bonusAwarded: false }))
    );
    const [teamConfettiChallengeId, setTeamConfettiChallengeId] = useState<string | null>(null);
    const [bouncingNodeId, setBouncingNodeId] = useState<number | null>(null);
    const [animatedTopPoints, setAnimatedTopPoints] = useState(0);
    const [animatedProfilePoints, setAnimatedProfilePoints] = useState(0);
    const [pointsDeltaToast, setPointsDeltaToast] = useState<{ id: number; delta: number } | null>(null);
    const pointsPrevRef = useRef(points);
    const pointsReadyRef = useRef(false);
    const cameraProofInputRef = useRef<HTMLInputElement | null>(null);
    const fileProofInputRef = useRef<HTMLInputElement | null>(null);
    const [photoProof, setPhotoProof] = useState<File | null>(null);
    const [fileProof, setFileProof] = useState<File | null>(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
    const [githubProofUrl, setGithubProofUrl] = useState('');
    const [isUploadingProof, setIsUploadingProof] = useState(false);

    const showNotif = useCallback((msg: string): void => {
        setNotif({ msg, show: true });
        setTimeout(() => setNotif(prev => ({ ...prev, show: false })), 2800);
    }, []);

    const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>): void => {
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

    useEffect(() => {
        return () => {
            if (photoPreviewUrl) {
                URL.revokeObjectURL(photoPreviewUrl);
            }
        };
    }, [photoPreviewUrl]);

    useEffect(() => {
        if (!modal.isOpen || modal.type !== 'node') {
            setPhotoProof(null);
            setFileProof(null);
            setGithubProofUrl('');
            setIsUploadingProof(false);
            setPhotoPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return '';
            });
        }
    }, [modal.isOpen, modal.type]);

    const closeModal = (): void => setModal((prev) => ({ ...prev, isOpen: false }));

    const handleOnboardingSwipeStart = (e: React.TouchEvent<HTMLDivElement>): void => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleOnboardingSwipeEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
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

    const completeOnboarding = (): void => {
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
    const handleLogin = useCallback((e: React.FormEvent): void => {
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
    }, [loginRole, showNotif]);

    const handleLogout = (): void => {
        setIsLoggedIn(false);
        setUser(null);
        showNotif('👋 Safely logged out');
    };

    const shareContributionOnLinkedIn = useCallback(async (): Promise<void> => {
        if (typeof window === 'undefined') return;

        const completedCount = pathNodes.filter((n) => n.state === 'done').length;
        const badgeCount = badgesData.filter((b) => b.earned).length;
        const rankData = (lbData as Record<string, LeaderboardEntry[]>)[user?.domain || 'Academic'] || [];
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
    }, [pathNodes, points, streak, user, showNotif]);

    // Leaderboard Domain logic
    const [lbDomain, setLbDomain] = useState('Academic');

    // User Filter logic
    const [userSearch, setUserSearch] = useState('');
    const [userFilterDomain, setUserFilterDomain] = useState('All');

    const liveTickerItems = useMemo<LiveTickerItem[]>(() => {
        const activityItems = activityData.map((a, i) => ({
            id: `activity-${i}`,
            text: `✨ ${a.text} (${a.pts})`,
            screen: EVENT_KEYWORD_REGEX.test(a.text) ? 'events' : 'path',
        }));

        const leaderboardItems = Object.entries(lbData as Record<string, LeaderboardEntry[]>)
            .map(([domain, rows]) => {
            const top = rows[0];
                if (!top) return null;
                return {
                    id: `lb-${domain}`,
                    text: `🏆 ${top.name} just earned ${top.pts} pts in ${domain}`,
                    screen: 'leaderboard',
                    lbDomain: domain,
                };
            })
            .filter((item): item is LiveTickerItem => item !== null);

        const newestEvent = events[0]
            ? [{
                id: `event-${events[0].id}`,
                text: `🎉 New event: ${String(events[0].title).replace(/^[^A-Za-z0-9]+\s*/, '')} added`,
                screen: 'events',
            }]
            : [];

        return [...activityItems, ...leaderboardItems, ...newestEvent];
    }, [events]);

    const activeTickerItem = liveTickerItems.length ? liveTickerItems[tickerIndex % liveTickerItems.length] : null;

    const handleTickerTap = (): void => {
        if (!activeTickerItem) return;
        if (activeTickerItem.screen === 'leaderboard' && activeTickerItem.lbDomain) {
            setLbDomain(activeTickerItem.lbDomain);
        }
        setCurrentScreen(activeTickerItem.screen);
    };

    useEffect(() => {
        if (liveTickerItems.length === 0) return;
        const timer = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % liveTickerItems.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [liveTickerItems.length]);

    useEffect(() => {
        if (tickerIndex >= liveTickerItems.length) {
            setTickerIndex(0);
        }
    }, [tickerIndex, liveTickerItems.length]);

    const filteredUsers = useMemo(() => users.filter(u =>
        (userFilterDomain === 'All' || u.domain === userFilterDomain) &&
        (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.badges.some(b => b.toLowerCase().includes(userSearch.toLowerCase())))
    ), [users, userFilterDomain, userSearch]);

    // Admin Queue Filter
    const [adminTab, setAdminTab] = useState('queue');
    const pendingQueue = useMemo(() => adminQueue.filter(s => !approvedSet.has(s.id) && !rejectedSet.has(s.id)), [adminQueue, approvedSet, rejectedSet]);

    const approveSubmission = useCallback((id: string, pts: number): void => {
        setApprovedSet(new Set(approvedSet.add(id)));
        setPoints(p => p + pts);

        // Find and Finalize Node if linked
        const queueItem = adminQueue.find(s => s.id === id);
        if (queueItem?.nodeId !== undefined) {
            const nodeId = queueItem.nodeId;
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
    }, [approvedSet, adminQueue, showNotif]);

    const rejectSubmission = useCallback((id: string): void => {
        setRejectedSet(new Set(rejectedSet.add(id)));
        showNotif('❌ Submission rejected');
    }, [rejectedSet, showNotif]);

    const completeNode = (id: number, proofDetails?: { hasImg: boolean; desc?: string }): void => {
        const node = pathNodes.find(n => n.id === id);
        if (node && node.state === 'active') {
            const updatedNodes = pathNodes.map(n => {
                if (n.id === id) return { ...n, state: 'pending' as const };
                return n;
            });
            setPathNodes(updatedNodes);

            // Add to admin queue
            const newSub = {
                initials: user?.name.split(' ').map(n => n[0]).join('') || 'U',
                name: user?.name || 'User',
                time: 'Just now',
                task: `[${node.label}] (${user?.domain})`,
                desc: proofDetails?.desc || `Submission for ${node.label} activity.`,
                pts: parseInt(node.pts),
                hasImg: Boolean(proofDetails?.hasImg),
                id: `node-${id}-${Date.now()}`,
                nodeId: id
            };
            setAdminQueue([newSub, ...adminQueue]);

            closeModal();
            showNotif(`📤 Submitted! Pending Admin Approval...`);
        }
    };

    const submitMissionProof = (): void => {
        if (!modal.data || modal.data.state !== 'active') return;

        const needsGithubUrl = requiresGithubUrl(modal.data.proofType);
        const githubUrlValid = !needsGithubUrl || GITHUB_REPO_URL_REGEX.test(githubProofUrl.trim());
        const hasBinaryProof = Boolean(photoProof || fileProof);
        const isValidProof = needsGithubUrl ? githubUrlValid : hasBinaryProof;

        if (!isValidProof || isUploadingProof) return;

        setIsUploadingProof(true);
        setTimeout(() => {
            const details: string[] = [];
            if (needsGithubUrl) details.push(`GitHub URL: ${githubProofUrl.trim()}`);
            if (photoProof) details.push(`Photo: ${photoProof.name}`);
            if (fileProof) details.push(`File: ${fileProof.name}`);

            showNotif('✅ Proof uploaded successfully!');
            setIsUploadingProof(false);
            completeNode(modal.data.id, {
                hasImg: Boolean(photoProof),
                desc: details.length ? details.join(' • ') : `Submission for ${modal.data.label} activity.`,
            });
        }, 1500);
    };

    const handleNodeTap = (node: PathNode): void => {
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

    const playLuckySpin = (): void => {
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

    const completeSurpriseMission = (): void => {
        if (surpriseMission.done) return;
        setPoints((p) => p + surpriseMission.reward);
        setSurpriseMission((prev) => ({ ...prev, done: true }));
        showNotif(`✨ Surprise mission done! +${surpriseMission.reward} pts`);
    };

    const rerollSurpriseMission = (): void => {
        const picked = SURPRISE_MISSIONS[Math.floor(Math.random() * SURPRISE_MISSIONS.length)];
        setSurpriseMission({ ...picked, done: false });
        showNotif('🔄 Surprise mission refreshed.');
    };

    const registerEvent = (eventId: number, title: string): void => {
        if (points >= 15) {
            setRegisteredSet(new Set(registeredSet.add(eventId)));
            setPoints(p => p - 15);
            showNotif(`📅 Registered for ${title}! -15 pts`);
        } else {
            showNotif('⚠️ Not enough points to register!');
        }
    };

    const rejectEvent = (eventId: number, title: string): void => {
        setDeclinedSet(new Set(declinedSet.add(eventId)));
        showNotif(`❌ You declined ${title}`);
    };

    const addActivity = (label: string, pts: string): void => {
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
        showNotif('🗺️ Path Updated for Students!');
    };

    const removeActivity = (id: number, label: string): void => {
        if (confirm(`Remove "${label}"?`)) {
            setPathNodes(pathNodes.filter(node => node.id !== id));
            showNotif('🗑️ Activity Removed');
        }
    };

    const createEvent = (event: Omit<Event, 'id'>): void => {
        const newEvent = { id: Date.now(), ...event };
        setEvents([newEvent, ...events]);
        showNotif('📅 Event Published Successfully!');
    };

    const deleteEvent = (id: number): void => {
        setEvents(events.filter(ev => ev.id !== id));
    };

    const joinTeamChallenge = (challengeId: string): void => {
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
            <div>
                <LoginScreen
                    logoUrl={LOGO_URL}
                    loginRole={loginRole}
                    onLoginRoleChange={setLoginRole}
                    onLogin={handleLogin}
                />
                <NotifToast show={notif.show} message={notif.msg} />
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

            <Suspense fallback={<ScreenFallback />}>
                <PathScreen
                    currentScreen={currentScreen}
                    activeTickerItem={activeTickerItem}
                    tickerIndex={tickerIndex}
                    onTickerTap={handleTickerTap}
                    isSpinning={isSpinning}
                    spinUsed={spinUsed}
                    spinReward={spinReward}
                    surpriseMission={surpriseMission}
                    logoUrl={LOGO_URL}
                    pathNodes={pathNodes}
                    bouncingNodeId={bouncingNodeId}
                    onPlayLuckySpin={playLuckySpin}
                    onCompleteSurpriseMission={completeSurpriseMission}
                    onRerollSurpriseMission={rerollSurpriseMission}
                    onNodeTap={handleNodeTap}
                    pickNodeAnimation={pickNodeAnimation}
                    nodeAnimationSide={nodeAnimationSide}
                    connectorState={connectorState}
                />
            </Suspense>

            <Suspense fallback={<ScreenFallback />}>
                <EventsScreen
                    currentScreen={currentScreen}
                    events={events}
                    registeredSet={registeredSet}
                    declinedSet={declinedSet}
                    onRegister={registerEvent}
                    onReject={rejectEvent}
                />
            </Suspense>

            <Suspense fallback={<ScreenFallback />}>
                <LeaderboardScreen
                    currentScreen={currentScreen}
                    lbDomain={lbDomain}
                    lbData={lbData}
                    points={points}
                    userName={user?.name}
                    onDomainChange={setLbDomain}
                    avatarColor={avatarColor}
                />
            </Suspense>

            <Suspense fallback={<ScreenFallback />}>
                <UsersScreen
                    currentScreen={currentScreen}
                    userSearch={userSearch}
                    userFilterDomain={userFilterDomain}
                    filteredUsers={filteredUsers}
                    avatarColor={avatarColor}
                    onSearchChange={setUserSearch}
                    onFilterChange={setUserFilterDomain}
                    onUserClick={(u) => setModal({ isOpen: true, type: 'user', data: u })}
                />
            </Suspense>

            <TeamScreen
                currentScreen={currentScreen}
                teamChallenges={teamChallenges}
                teamConfettiChallengeId={teamConfettiChallengeId}
                avatarColor={avatarColor}
                onJoinChallenge={joinTeamChallenge}
            />

            <Suspense fallback={<ScreenFallback />}>
                <ProfileScreen
                    currentScreen={currentScreen}
                    user={user}
                    animatedProfilePoints={animatedProfilePoints}
                    streak={streak}
                    points={points}
                    badgesData={badgesData}
                    activityData={activityData}
                    onBadgeClick={(name) => showNotif('🎖️ ' + name + ' — Earned!')}
                    onShareLinkedIn={shareContributionOnLinkedIn}
                    onLogout={handleLogout}
                    FlameIcon={FlameIcon}
                />
            </Suspense>

            <Suspense fallback={<ScreenFallback />}>
                <AdminScreen
                    currentScreen={currentScreen}
                    adminTab={adminTab}
                    pendingQueue={pendingQueue}
                    adminValidated={adminValidated}
                    adminQueue={adminQueue}
                    approvedSet={approvedSet}
                    pathNodes={pathNodes}
                    events={events}
                    avatarColor={avatarColor}
                    onAdminTabChange={setAdminTab}
                    onApprove={approveSubmission}
                    onReject={rejectSubmission}
                    onAddActivity={addActivity}
                    onRemoveActivity={removeActivity}
                    onCreateEvent={createEvent}
                    onDeleteEvent={deleteEvent}
                />
            </Suspense>

            <Suspense fallback={<ScreenFallback />}>
                <StudentSettingsScreen
                    currentScreen={currentScreen}
                    user={user}
                    points={points}
                    onLogout={handleLogout}
                />
            </Suspense>

            <BottomNav currentScreen={currentScreen} userRole={user?.role} onNavigate={setCurrentScreen} />

            {/* MODAL */}
            <Modal isOpen={modal.isOpen} onClose={closeModal}>
                    {modal.type === 'node' && modal.data && (() => {
                        const needsGithubUrl = requiresGithubUrl(modal.data.proofType);
                        const githubUrlValid = !needsGithubUrl || GITHUB_REPO_URL_REGEX.test(githubProofUrl.trim());
                        const hasBinaryProof = Boolean(photoProof || fileProof);
                        const canSubmitProof = modal.data.state === 'active' && (needsGithubUrl ? githubUrlValid : hasBinaryProof);

                        return (
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
                                        <p style={{ fontSize: '.88rem', marginBottom: '16px' }}>Complete this activity to earn <strong>{modal.data.pts}</strong>. Submit valid proof for review.</p>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label className="input-label">PROOF SUBMISSION</label>
                                            <div className="proof-options">
                                                <button type="button" className="proof-option-card" onClick={() => cameraProofInputRef.current?.click()}>
                                                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📸</div>
                                                    <div style={{ fontSize: '.75rem', color: '#666', fontWeight: 700 }}>Take Photo</div>
                                                </button>
                                                <button type="button" className="proof-option-card" onClick={() => fileProofInputRef.current?.click()}>
                                                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📄</div>
                                                    <div style={{ fontSize: '.75rem', color: '#666', fontWeight: 700 }}>Upload File</div>
                                                </button>
                                            </div>

                                            <input
                                                type="file"
                                                ref={cameraProofInputRef}
                                                accept="image/*"
                                                capture="environment"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const selected = e.target.files?.[0] || null;
                                                    if (selected) {
                                                        setPhotoProof(selected);
                                                        setPhotoPreviewUrl((prev) => {
                                                            if (prev) URL.revokeObjectURL(prev);
                                                            return URL.createObjectURL(selected);
                                                        });
                                                        showNotif('📸 Photo evidence added');
                                                    }
                                                    e.currentTarget.value = '';
                                                }}
                                            />
                                            <input
                                                type="file"
                                                ref={fileProofInputRef}
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const selected = e.target.files?.[0] || null;
                                                    if (selected) {
                                                        setFileProof(selected);
                                                        showNotif(`📎 ${selected.name} attached`);
                                                    }
                                                    e.currentTarget.value = '';
                                                }}
                                            />

                                            {(photoProof || fileProof) && (
                                                <div className="proof-preview-wrap">
                                                    {photoPreviewUrl && (
                                                        <div className="proof-photo-preview">
                                                            <img src={photoPreviewUrl} alt="Mission proof preview" />
                                                        </div>
                                                    )}
                                                    <div className="proof-file-meta">
                                                        {photoProof && <div>📸 {photoProof.name}</div>}
                                                        {fileProof && <div>📄 {fileProof.name}</div>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {needsGithubUrl && (
                                            <div style={{ marginBottom: '14px' }}>
                                                <label className="input-label">GITHUB REPOSITORY URL</label>
                                                <input
                                                    type="url"
                                                    className="login-input"
                                                    placeholder="https://github.com/username/repository"
                                                    value={githubProofUrl}
                                                    onChange={(e) => setGithubProofUrl(e.target.value)}
                                                />
                                                <div className={`proof-hint ${githubProofUrl ? (githubUrlValid ? 'valid' : 'invalid') : ''}`}>
                                                    {githubProofUrl
                                                        ? (githubUrlValid ? '✅ Valid GitHub repository URL' : '⚠️ Enter a valid GitHub repository URL')
                                                        : 'Required for this mission'}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-yellow"
                                            style={{ width: '100%', marginBottom: '8px' }}
                                            onClick={submitMissionProof}
                                            disabled={!canSubmitProof || isUploadingProof}
                                        >
                                            {isUploadingProof ? (
                                                <span className="proof-uploading-inline">
                                                    <span className="proof-upload-spinner" aria-hidden="true"></span>
                                                    Uploading proof...
                                                </span>
                                            ) : (
                                                `🚀 Submit ${modal.data.pts}`
                                            )}
                                        </button>

                                        {!canSubmitProof && (
                                            <div className="proof-hint invalid" style={{ marginBottom: '8px' }}>
                                                {needsGithubUrl ? 'Valid GitHub URL is required to submit this mission.' : 'Attach a photo or file to submit this mission.'}
                                            </div>
                                        )}

                                        {canSubmitProof && !isUploadingProof && (
                                            <div className="proof-hint valid" style={{ marginBottom: '8px' }}>
                                                ✅ Ready to submit
                                            </div>
                                        )}
                                    </>
                                )}

                                <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }} onClick={closeModal}>Close</button>
                            </>
                        );
                    })()}

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
            </Modal>

            {/* NOTIFICATION */}
            <NotifToast show={notif.show} message={notif.msg} />
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

                .suspense-spinner-wrap {
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .suspense-spinner {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: 3px solid rgba(0, 0, 0, .15);
                    border-top-color: rgba(0, 0, 0, .72);
                    animation: suspenseSpin .8s linear infinite;
                }

                @keyframes suspenseSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
