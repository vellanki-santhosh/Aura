import React from 'react';

export interface LoginScreenProps {
    logoUrl: string;
    loginRole: 'student' | 'admin';
    onLoginRoleChange: (role: 'student' | 'admin') => void;
    onLogin: (e: React.FormEvent) => void;
}

function LoginScreen({ logoUrl, loginRole, onLoginRoleChange, onLogin }: LoginScreenProps) {
    const isAdmin = loginRole === 'admin';

    return (
        <div className="app-shell" style={{ justifyContent: 'center' }}>
            <div className="login-screen">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <img src={logoUrl} alt="AURA Logo" style={{ width: '240px', height: 'auto' }} />
                    <div className="login-subtitle" style={{ marginTop: '10px' }}>
                        {isAdmin ? 'Secure Administration Access' : 'Powering Student Contributions'}
                    </div>
                </div>

                <div className={`login-card ${isAdmin ? 'admin-login-card' : ''}`}>
                    {isAdmin && (
                        <div className="admin-login-banner">
                            <div className="admin-login-title">Admin Control Panel</div>
                            <div className="admin-login-text">Use your registered credentials to manage approvals, users, and activity paths.</div>
                        </div>
                    )}

                    <div className="login-toggle">
                        <button
                            className={`toggle-btn ${loginRole === 'student' ? 'active' : ''}`}
                            onClick={() => onLoginRoleChange('student')}
                            type="button"
                        >
                            Student
                        </button>
                        <button
                            className={`toggle-btn ${loginRole === 'admin' ? 'active' : ''}`}
                            onClick={() => onLoginRoleChange('admin')}
                            type="button"
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={onLogin}>
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
                            {isAdmin ? 'Access Admin Dashboard' : 'Login to Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default React.memo(LoginScreen);
