import React from 'react';

export interface NotifToastProps {
    show: boolean;
    message: string;
}

function NotifToast({ show, message }: NotifToastProps) {
    return <div className={`notif ${show ? 'show' : ''}`}>{message}</div>;
}

export default React.memo(NotifToast);
