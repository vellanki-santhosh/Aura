import React from 'react';

export interface EventItem {
    id: number;
    title: string;
    date: string;
    loc: string;
    desc: string;
}

export interface EventsScreenProps {
    currentScreen: string;
    events: EventItem[];
    registeredSet: Set<number>;
    declinedSet: Set<number>;
    onRegister: (eventId: number, title: string) => void;
    onReject: (eventId: number, title: string) => void;
}

function EventsScreen({ currentScreen, events, registeredSet, declinedSet, onRegister, onReject }: EventsScreenProps) {
    const visibleEvents = events.filter((e) => !registeredSet.has(e.id) && !declinedSet.has(e.id));

    return (
        <div className={`screen ${currentScreen === 'events' ? 'active' : ''} fade-in`}>
            <div className="section-title">📅 Upcoming Campus Events</div>
            <div id="events-list" style={{ padding: '0 16px' }}>
                {visibleEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No more events found. You've answered all calls! 🔔</div>
                ) : (
                    visibleEvents.map((e) => (
                        <div key={e.id} className="card" style={{ margin: '0 0 16px 0', border: '1px solid #f0f0f0', background: '#fff' }}>
                            <div className="card-inner">
                                <div style={{ fontWeight: 900, color: 'var(--dark)' }}>{e.title}</div>
                                <div style={{ fontSize: '.75rem', color: 'var(--green-dark)', fontWeight: 800, margin: '4px 0' }}>📍 {e.loc} · 📅 {e.date} · Cost: 🪙 15 pts</div>
                                <div style={{ fontSize: '.82rem', color: '#666' }}>{e.desc}</div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <button className="btn btn-green" style={{ flex: 1, fontSize: '.75rem', padding: '8px' }} onClick={() => onRegister(e.id, e.title)}>
                                        Register (15 pts)
                                    </button>
                                    <button className="btn btn-red" style={{ flex: 1, fontSize: '.75rem', padding: '8px' }} onClick={() => onReject(e.id, e.title)}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EventsScreen;
