import { Fragment, useState, useEffect, useLocation } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import DefaultLayout from '~/layouts';
import PlayMusic from './components/PlayMusic';
import ChatRoom from './components/ChatRoom';
import { UserAuth } from './components/Store';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    const { openMessage } = UserAuth();

    const [showPlayMusic, setShowPlayMusic] = useState(true); 

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        // Kiểm tra quyền truy cập
                        const isPrivate = route.private;
                        const RouteComponent = isPrivate ? (
                            <ProtectedRoute requiredRole={route.role} setShowPlayMusic={setShowPlayMusic}>
                                <Layout>
                                    <Page />
                                </Layout>
                            </ProtectedRoute>
                        ) : (
                            <Layout>
                                <Page />
                            </Layout>
                        );

                        return <Route key={index} path={route.path} element={RouteComponent} />;
                    })}
                </Routes>

                {openMessage && <ChatRoom />}
                {showPlayMusic && <PlayMusic />}
            </div>
        </Router>
    );
}

export default App;
