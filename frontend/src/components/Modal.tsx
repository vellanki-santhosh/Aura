import React from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-handle"></div>
                {children}
            </div>
        </div>
    );
}

export default React.memo(Modal);
