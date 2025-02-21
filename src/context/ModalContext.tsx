// context/ModalContext.tsx
import { type ReactNode, createContext, useContext, useState } from 'react';
import type { ParaModalProps } from '@getpara/react-sdk';
import { OAuthMethod } from '@getpara/web-sdk';
import para from '../utils/para'; // Import pre-initialized para instance

interface ModalContextType {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modalProps: ParaModalProps;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const modalProps: ParaModalProps = {
        para,
        isOpen: isModalOpen,
        onClose: closeModal,
        logo: "",
        theme: {},
        oAuthMethods: [
            OAuthMethod.GOOGLE,
            OAuthMethod.TWITTER,
            OAuthMethod.DISCORD,
            OAuthMethod.TELEGRAM
        ],
        authLayout: ["AUTH:FULL", "EXTERNAL:FULL"],
        recoverySecretStepEnabled: true,
        onRampTestMode: true,
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, modalProps, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
