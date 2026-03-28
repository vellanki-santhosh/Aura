export const pathNodes = [
    { id: 1, icon: '📅', label: 'Attend Event', sub: 'Mission Placements', pts: '+20 pts', state: 'done', domain: 'Community', proofType: 'Event Selfie / QR Scan' },
    { id: 2, icon: '📚', label: 'Organize Study Group', sub: 'Domain: Academic', pts: '+25 pts', state: 'active', domain: 'Academic', proofType: 'Photo of Group + Attendance sheet' },
    { id: 3, icon: '📣', label: 'Tech Seminar Q&A', sub: 'Domain: Engagement', pts: '+15 pts', state: 'locked', domain: 'Tech', proofType: 'Summary PDF / Video Clip' },
    { id: 4, icon: '</>', label: 'Submit Project Repo', sub: 'Domain: Tech', pts: '+35 pts', state: 'locked', domain: 'Tech', proofType: 'GitHub Repository URL' },
    { id: 5, icon: '🎤', label: 'Present at Seminar', sub: 'Domain: Academic', pts: '+30 pts', state: 'locked', domain: 'Academic', proofType: 'Presentation PPT / Stage Photo' },
];

export const lbData: Record<string, any[]> = {
    Academic: [
        { name: 'Kiran R.', pts: 510, promo: true },
        { name: 'Sana K.', pts: 500, promo: false },
        { name: 'Ajay M.', pts: 490, promo: false },
        { name: 'Priya S.', pts: 470, promo: false, you: true },
        { name: 'Vsy G.', pts: 450, promo: false },
        { name: 'Rahul D.', pts: 430, demo: true },
    ],
    Tech: [
        { name: 'Aisha M.', pts: 580, promo: true },
        { name: 'Liam O.', pts: 540, promo: false },
        { name: 'Ben C.', pts: 510, promo: false },
        { name: 'Priya S.', pts: 470, promo: false, you: true },
        { name: 'Dev R.', pts: 440, promo: false },
        { name: 'Meera T.', pts: 390, demo: true },
    ],
    Media: [
        { name: 'Riya P.', pts: 620, promo: true },
        { name: 'Sam H.', pts: 560, promo: false },
        { name: 'Priya S.', pts: 470, promo: false, you: true },
        { name: 'Yash K.', pts: 430, promo: false },
    ],
    Events: [
        { name: 'Neha S.', pts: 700, promo: true },
        { name: 'Kiran R.', pts: 590, promo: false },
        { name: 'Priya S.', pts: 470, promo: false, you: true },
        { name: 'Tom A.', pts: 450, promo: false },
        { name: 'Lakshmi V.', pts: 380, demo: true },
    ],
};

export const usersData = [
    { initials: 'KR', name: 'Kiran R.', role: 'Academic Domain Lead', pts: 510, badges: ['📖 Study Guide Maker', '🏅 Hackathon', '🤝 Team Player', '💬 Q&A Contributor'], available: true, domain: 'Academic' },
    { initials: 'AM', name: 'Aisha M.', role: 'Tech Domain Lead', pts: 500, badges: ['🏅 Hackathon Team Player', '</> Code Contributor (Tier 2)'], available: true, domain: 'Tech' },
    { initials: 'LO', name: 'Liam O.', role: 'Engagement Contributor', pts: 210, badges: ['</> Code Contributor'], available: false, domain: 'Tech' },
    { initials: 'PS', name: 'Priya S.', role: 'Novice Contributor', pts: 470, badges: ['💬 Q&A Contributor', '📖 Study Guide Maker'], available: true, domain: 'Academic' },
    { initials: 'BC', name: 'Ben C.', role: 'Event Organizer', pts: 380, badges: ['📅 Event Planner', '🤝 Team Player'], available: false, domain: 'Engagement' },
    { initials: 'RD', name: 'Rahul D.', role: 'Tech Contributor', pts: 430, badges: ['</> Code Contributor', '🚀 Project Driver'], available: true, domain: 'Tech' },
];

export const badgesData = [
    { icon: '💬', name: 'Q&A Contributor', earned: true },
    { icon: '📖', name: 'Study Guide Maker', earned: true },
    { icon: '🏅', name: 'Hackathon Team Player', earned: true },
    { icon: '🎓', name: 'Domain Lead (Academic)', earned: false },
    { icon: '</>', name: 'Tech Contributor (Tier 2)', earned: false },
    { icon: '📣', name: 'Campus Ambassador', earned: false },
];

export const activityData = [
    { time: '2h ago', text: 'Attended Tech Seminar', pts: '+15 pts' },
    { time: 'Yesterday', text: 'Led Academic Study Group', pts: '+25 pts' },
    { time: '3 days ago', text: 'Submitted Study Guide', pts: '+20 pts' },
    { time: 'Last week', text: 'Hackathon Participation', pts: '+50 pts' },
];

export const adminQueue = [
    { initials: 'KR', name: 'Kiran R.', time: '1 hour ago', task: '[Organize Study Group] (Academic)', desc: 'Submit Proof of Attendance and Photo', pts: 25, hasImg: true, id: 'q1' },
    { initials: 'BC', name: 'Ben C.', time: '5 hours ago', task: '[Submit Project Repo] (Tech)', desc: 'Submit GitHub Repo Link', pts: 15, hasImg: false, id: 'q2' },
    { initials: 'RD', name: 'Rahul D.', time: '6 hours ago', task: '[Tech Seminar Q&A] (Engagement)', desc: 'Submit summary of the Q&A session', pts: 15, hasImg: false, id: 'q3' },
];

export const adminValidated = [
    { initials: 'AM', name: 'Aisha M.', time: '5 mins ago', task: '[Submit Project Repo] (Tech)', desc: 'Submit GitHub Repo Link', pts: 50, id: 'v1' },
    { initials: 'LO', name: 'Liam O.', time: '15 mins ago', task: '[Campus Cleanup Event] (Community)', desc: 'Verified with sign-in sheet and event photo', pts: 35, id: 'v2' },
];

export const adminRejected = [
    { initials: 'TK', name: 'Tej K.', time: '2 hours ago', task: '[Organize Study Group] (Academic)', desc: 'Missing attendance photo', pts: 25, id: 'r1', reason: 'Insufficient evidence provided' },
];
export const initialEvents = [
    { id: 1, title: '🚀 Tech Innovate 2026', date: 'April 05, 2026', loc: 'Main Seminar Hall', desc: 'A grand showcase of student-led technical projects and innovation.' },
    { id: 2, title: '🏀 Intra-College Tournament', date: 'April 12, 2026', loc: 'College Grounds', desc: 'Annual sports meet specifically for club members and new recruits.' },
    { id: 3, title: '🎬 Film Festival Night', date: 'April 20, 2026', loc: 'Open Air Theater', desc: 'Screening award-winning entries from the Media Club creators.' },
];
