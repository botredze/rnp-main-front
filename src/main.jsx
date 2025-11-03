import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App.jsx';
import './index.scss';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Provider } from 'react-redux';
import { persistor, store } from './store';

const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Inter, sans-serif',
});

function Root() {
    return (
        <StrictMode>
            <BrowserRouter>
                <Provider store={store}>
                    <MantineProvider theme={theme}>
                        <Notifications position="top-right" />
                        <App />
                    </MantineProvider>
                </Provider>
            </BrowserRouter>
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<Root />);
