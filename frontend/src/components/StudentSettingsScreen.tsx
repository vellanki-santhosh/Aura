import React, { useState } from 'react';

type StudentUser = {
    name: string;
    rollNo: string;
    domain: string;
    role: 'student' | 'admin';
};

interface StudentSettingsScreenProps {
    currentScreen: string;
    user: StudentUser | null;
    points: number;
    onLogout: () => void;
}

function StudentSettingsScreen({ currentScreen, user, points, onLogout }: StudentSettingsScreenProps) {
    const [settingsTab, setSettingsTab] = useState('profile');
    const [bioText, setBioText] = useState('Passionate learner & campus contributor');
    const [notifPush, setNotifPush] = useState(true);
    const [notifEmail, setNotifEmail] = useState(false);
    const [notifWeekly, setNotifWeekly] = useState(true);
    const [goalPoints, setGoalPoints] = useState(500);
    const [goalBadges, setGoalBadges] = useState(5);
    const [privateProfile, setPrivateProfile] = useState(false);
    const [hidePoints, setHidePoints] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
    const [language, setLanguage] = useState('en');
    const now = new Date();
    const memberSince = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const lastUpdated = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return (
        <div className={`screen ${currentScreen === 'settings' ? 'active' : ''} fade-in`}>
            <div style={{ background: 'var(--dark)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: "'Fredoka One'", fontSize: '1.1rem', color: '#fff' }}>⚙️ Student Settings</div>
            </div>

            {/* SETTINGS TABS */}
            <div className="admin-tabs" style={{ padding: '12px 0', overflowX: 'auto', display: 'flex', gap: '4px' }}>
                <div className={`admin-tab ${settingsTab === 'profile' ? 'active' : ''}`} onClick={() => setSettingsTab('profile')} style={{ whiteSpace: 'nowrap' }}>Profile</div>
                <div className={`admin-tab ${settingsTab === 'goals' ? 'active' : ''}`} onClick={() => setSettingsTab('goals')} style={{ whiteSpace: 'nowrap' }}>Goals</div>
                <div className={`admin-tab ${settingsTab === 'notif' ? 'active' : ''}`} onClick={() => setSettingsTab('notif')} style={{ whiteSpace: 'nowrap' }}>Notifications</div>
                <div className={`admin-tab ${settingsTab === 'privacy' ? 'active' : ''}`} onClick={() => setSettingsTab('privacy')} style={{ whiteSpace: 'nowrap' }}>Privacy</div>
                <div className={`admin-tab ${settingsTab === 'prefs' ? 'active' : ''}`} onClick={() => setSettingsTab('prefs')} style={{ whiteSpace: 'nowrap' }}>Preferences</div>
            </div>

            {/* PROFILE CUSTOMIZATION */}
            {settingsTab === 'profile' && (
                <div id="student-profile-settings" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>👤 Profile Information</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '4px' }}>NAME</div>
                                <input type="text" value={user?.name || ''} disabled style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f5f5f5' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '4px' }}>ROLL NUMBER</div>
                                <input type="text" value={user?.rollNo || ''} disabled style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f5f5f5' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '4px' }}>PRIMARY DOMAIN</div>
                                <input type="text" value={user?.domain || ''} disabled style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f5f5f5' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '4px' }}>BIO</div>
                                <textarea placeholder="Tell us about yourself..." value={bioText} onChange={(e) => setBioText(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit', fontSize: '.9rem' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>📊 Your Stats</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #FFE082, #FDD835)', borderRadius: '10px', padding: '12px', textAlign: 'center', color: '#333' }}>
                                <div style={{ fontSize: '.75rem', fontWeight: 700 }}>TOTAL POINTS</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{points}</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #81C784, #66BB6A)', borderRadius: '10px', padding: '12px', textAlign: 'center', color: '#fff' }}>
                                <div style={{ fontSize: '.75rem', fontWeight: 700 }}>MEMBER SINCE</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{memberSince}</div>
                            </div>
                        </div>
                    </div>

                    <button className="btn" style={{ width: '100%', background: '#0A66C2', color: '#fff' }}>💾 Save Profile</button>
                </div>
            )}

            {/* GOALS & OBJECTIVES */}
            {settingsTab === 'goals' && (
                <div id="student-goals" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>🎯 Monthly Goals</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '.85rem' }}>📍 Points Goal</span>
                                    <span style={{ color: '#666', fontSize: '.8rem' }}>{points} / {goalPoints}</span>
                                </div>
                                <input type="range" min="100" max="1000" value={goalPoints} onChange={(e) => setGoalPoints(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                                <div style={{ fontSize: '.75rem', color: '#999', marginTop: '4px' }}>Current goal: {goalPoints} points</div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '.85rem' }}>🎖️ Badges Goal</span>
                                    <span style={{ color: '#666', fontSize: '.8rem' }}>3 / {goalBadges}</span>
                                </div>
                                <input type="range" min="1" max="10" value={goalBadges} onChange={(e) => setGoalBadges(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                                <div style={{ fontSize: '.75rem', color: '#999', marginTop: '4px' }}>Target {goalBadges} badges this month</div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '.85rem' }}>🔥 Streak Goal</span>
                                    <span style={{ color: '#666', fontSize: '.8rem' }}>14 / 30 days</span>
                                </div>
<div style={{ background: '#f0f0f0', borderRadius: '10px', height: '10px', overflow: 'hidden', marginTop: '6px' }}>
  <div style={{ height: '100%', background: 'linear-gradient(90deg, #2ECC71, #27AE60)', borderRadius: '10px', width: '46%', transition: 'width 0.8s ease' }}></div>
</div>
                                <div style={{ fontSize: '.75rem', color: '#999', marginTop: '4px' }}>Keep a 30-day streak!</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '12px', border: '1px solid #C8E6C9' }}>
                        <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#2E7D32', marginBottom: '4px' }}>💡 Tip</div>
                        <div style={{ fontSize: '.8rem', color: '#1B5E20' }}>Completing goals early unlocks bonus rewards! Check back weekly to see your progress.</div>
                    </div>

                    <button className="btn" style={{ width: '100%', background: '#4CAF50', color: '#fff' }}>✅ Update Goals</button>
                </div>
            )}

            {/* NOTIFICATION PREFERENCES */}
            {settingsTab === 'notif' && (
                <div id="student-notif-settings" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>🔔 Notification Channels</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>🔔 Push Notifications</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>App & browser alerts</div>
                                </div>
                                <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>📧 Email Digest</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>Weekly activity summary</div>
                                </div>
                                <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>📊 Weekly Report</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>Performance insights</div>
                                </div>
                                <input type="checkbox" checked={notifWeekly} onChange={(e) => setNotifWeekly(e.target.checked)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>📫 Event Alerts</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>New events nearby</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Admin approvals (instant)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Leaderboard rank changes</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Team challenge invites</span>
                            </label>
                        </div>
                    </div>

                    <button className="btn" style={{ width: '100%', background: '#2196F3', color: '#fff' }}>💾 Save Notifications</button>
                </div>
            )}

            {/* PRIVACY SETTINGS */}
            {settingsTab === 'privacy' && (
                <div id="student-privacy-settings" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>🔒 Profile Visibility</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>👤 Private Profile</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>Hide from directory search</div>
                                </div>
                                <input type="checkbox" checked={privateProfile} onChange={(e) => setPrivateProfile(e.target.checked)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>🪙 Hide Points</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>Don't show in leaderboard</div>
                                </div>
                                <input type="checkbox" checked={hidePoints} onChange={(e) => setHidePoints(e.target.checked)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>👥 Allow Peer Messages</div>
                                    <div style={{ fontSize: '.75rem', color: '#666' }}>Let others reach out</div>
                                </div>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#FFF3E0', borderRadius: '12px', padding: '12px', border: '1px solid #FFE0B2' }}>
                        <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#E65100', marginBottom: '4px' }}>⚠️ Important</div>
                        <div style={{ fontSize: '.8rem', color: '#BF360C' }}>Hiding your profile or points doesn't disable leaderboard tracking for admins. Your activity is always monitored for fairness.</div>
                    </div>

                    <button className="btn" style={{ width: '100%', background: '#FF9800', color: '#fff' }}>🔒 Save Privacy Settings</button>
                </div>
            )}

            {/* APP PREFERENCES */}
            {settingsTab === 'prefs' && (
                <div id="student-prefs" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>🎨 Appearance</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '8px' }}>THEME</div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {(['light', 'dark', 'auto'] as const).map(t => (
                                        <button key={t} className="btn" style={{ flex: 1, background: theme === t ? '#2ECC71' : '#ddd', color: theme === t ? '#fff' : '#000', textTransform: 'capitalize' }} onClick={() => setTheme(t)}>
                                            {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '⚙️'} {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#666', marginBottom: '8px' }}>LANGUAGE</div>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '.9rem' }}>
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="hi">हिन्दी</option>
                                    <option value="te">తెలుగు</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>📱 App Settings</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Enable animations</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Sound effects</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: '#f9f9f9', borderRadius: '8px' }}>
                                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '.85rem' }}>Auto-save progress</span>
                            </label>
                        </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '12px' }}>ℹ️ About & Support</div>
                        <div style={{ fontSize: '.85rem', color: '#666', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>📱 <strong>Version:</strong> 1.0.0</div>
                            <div>🏢 <strong>Build:</strong> PWA v8.0.3</div>
                            <div>📅 <strong>Last Updated:</strong> {lastUpdated}</div>
                        </div>
                        <button className="btn btn-outline" style={{ width: '100%', marginTop: '12px', borderColor: '#2196F3', color: '#2196F3' }}>💬 Send Feedback</button>
                    </div>

                    <button className="btn" style={{ width: '100%', background: '#4CAF50', color: '#fff' }}>✅ Save Preferences</button>
                </div>
            )}

            {/* LOGOUT BUTTON */}
            <div style={{ padding: '16px' }}>
                <button className="btn btn-red" style={{ width: '100%' }} onClick={onLogout}>🚪 Logout</button>
            </div>
        </div>
    );
}

export default StudentSettingsScreen;
