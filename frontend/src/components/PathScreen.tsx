import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ErrorBoundary from './ErrorBoundary';

// Interfaces centralized in App.tsx

import type { PathNode, SurpriseMission, LiveTickerItem } from '../App';

export interface PathScreenProps {
    currentScreen: string;
    activeTickerItem: LiveTickerItem | null;
    tickerIndex: number;
    onTickerTap: () => void;
    isSpinning: boolean;
    spinUsed: boolean;
    spinReward: number | null;
    surpriseMission: SurpriseMission;
    logoUrl: string;
    pathNodes: PathNode[];
    bouncingNodeId: number | null;
    onPlayLuckySpin: () => void;
    onCompleteSurpriseMission: () => void;
    onRerollSurpriseMission: () => void;
    onNodeTap: (node: PathNode) => void;
    pickNodeAnimation: (seed: number) => { label: string; src: string };
    nodeAnimationSide: (rowIndex: number) => 'left' | 'right';
    connectorState: (state: string) => 'done' | 'active' | 'locked';
}

function PathScreen({
    currentScreen,
    activeTickerItem,
    tickerIndex,
    onTickerTap,
    isSpinning,
    spinUsed,
    spinReward,
    surpriseMission,
    logoUrl,
    pathNodes,
    bouncingNodeId,
    onPlayLuckySpin,
    onCompleteSurpriseMission,
    onRerollSurpriseMission,
    onNodeTap,
    pickNodeAnimation,
    nodeAnimationSide,
    connectorState,
}: PathScreenProps) {
    return (
        <div className={`screen ${currentScreen === 'path' ? 'active' : ''} fade-in`}>
            <div className="live-activity-ticker-wrap">
                <button type="button" className="live-activity-ticker" onClick={onTickerTap} aria-label="Open related screen from live activity">
                    <span className="live-activity-track" key={activeTickerItem?.id || `empty-${tickerIndex}`}>
                        {activeTickerItem?.text || '✨ Live campus activity will appear here'}
                    </span>
                </button>
            </div>

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
                    <button className="btn btn-yellow" onClick={onPlayLuckySpin} disabled={spinUsed || isSpinning}>
                        {isSpinning ? 'Spinning...' : spinUsed ? 'Used Today' : 'Spin Now'}
                    </button>
                    {spinReward && <div className="wow-reward">+{spinReward} pts unlocked</div>}
                </div>

                <div className="wow-card mission-card">
                    <div className="wow-title">🧩 Surprise Mission</div>
                    <div className="wow-mission-text">{surpriseMission.title}</div>
                    <div className="wow-sub">Reward: +{surpriseMission.reward} pts</div>
                    <div className="wow-actions">
                        <button className="btn btn-green" onClick={onCompleteSurpriseMission} disabled={surpriseMission.done}>
                            {surpriseMission.done ? 'Completed' : 'Claim'}
                        </button>
                        <button className="btn btn-outline" onClick={onRerollSurpriseMission}>Reroll</button>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
                <img src={logoUrl} alt="AURA" style={{ width: '100px', height: 'auto', opacity: 0.9 }} />
            </div>

            <div className="section-title">🧭 Your Activity Path</div>
            <div className="path-nodes">
                {pathNodes.map((node, i) => (
                    <div className="path-node-wrap" key={node.id}>
                        {i > 0 && (
                            <div className={`path-connector-simple ${i % 2 === 0 ? 'to-left' : 'to-right'} ${connectorState(pathNodes[i - 1].state)}`} aria-hidden="true">
                                <span className="path-arrow-head"></span>
                            </div>
                        )}
                        <div className={`path-node ${node.state} ${bouncingNodeId === node.id ? 'tap-bounce' : ''}`} onClick={() => onNodeTap(node)}>
                            <span className="node-icon">{node.icon}</span>
                            {node.state === 'done' && (
                                <div className="done-check" aria-label="Completed">
                                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                                        <circle cx="12" cy="12" r="12" fill="#2ECC71" />
                                        <path d="M7.2 12.4l3 3.2 6.6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                            {node.state === 'pending' && <div className="pending-check" style={{ background: '#2196F3' }}>⏳</div>}
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
                            {currentScreen === 'path' && (
                                <ErrorBoundary>
                                    <DotLottieReact 
                                        src={pickNodeAnimation(node.id + i).src} 
                                        loop 
                                        autoplay 
                                        style={{ width: '78px', height: '78px' }}
                                        onError={(e) => console.warn('Lottie load failed:', e)}
                                    />
                                </ErrorBoundary>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PathScreen;
