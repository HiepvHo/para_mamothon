import type { ParaModalProps } from "@getpara/react-sdk";
import { OAuthMethod } from "@getpara/web-sdk";
import para from './para'; // Import pre-configured `para` instance

export const modalProps: ParaModalProps = {
    para, // Use the pre-initialized Para instance
    isOpen: false, // Default modal state
    onClose: () => {}, // Placeholder, will be dynamically set
    logo: "", // Set your logo if any
    theme: {}, // Set the theme of the modal (if any)
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
