import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthProvider, NotifyProvider, MusicProvider, FormProvider, ChatProvider } from './components/Store';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <NotifyProvider>
            <ChatProvider>
                <AuthProvider>
                    <FormProvider>
                        <MusicProvider>
                            <GlobalStyles>
                                <App />
                            </GlobalStyles>
                        </MusicProvider>
                    </FormProvider>
                </AuthProvider>
            </ChatProvider>
        </NotifyProvider>
        ,
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
