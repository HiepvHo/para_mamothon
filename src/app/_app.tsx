// _app.tsx or your entry file
import { ModalProvider } from '../context/ModalContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ModalProvider>
            <Component {...pageProps} />
        </ModalProvider>
    );
}

export default MyApp;
