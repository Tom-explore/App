import React from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
    children: React.ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? ReactDOM.createPortal(children, modalRoot) : null;
};

export default ModalPortal;
