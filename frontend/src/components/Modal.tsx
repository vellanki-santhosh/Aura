import React, { useEffect } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    return (
        <div
            className={`modal-overlay ${isOpen ? 'open' : ''}`}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                className="modal-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="AURA modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-handle"></div>
                {children}
            </div>
        </div>
    );
}

export default React.memo(Modal);
