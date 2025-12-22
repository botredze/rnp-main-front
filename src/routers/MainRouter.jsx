import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage.jsx';
import LoginPage from '../pages/loginPage/LoginPage.jsx';
import UnitEconomicPage from '../pages/unitEconomic/UnitEconomicPage.jsx';
import MainLayouts from '../components/layouts/MainLayouts.jsx';
import { useDispatch, useSelector } from 'react-redux';
import SettingsPage from '../pages/settingsPage/SettingsPage.jsx';
import AdminPanel from '../pages/adminPanel/AdminPanel.jsx';
import FinanceReportPage from '../pages/FinanceReportPage/FinanceReportPage.jsx';
import HelloPage from '../pages/helloPage/HelloPage.jsx';
import { getOrganizationList } from '../store/reducers/organizationSlice.js';

const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const OrganizationGuard = ({ children }) => {
    const { organizationList } = useSelector((state) => state.organization);

    const hasActiveOrganization = organizationList?.some((org) => org.status === 'active');

    if (!hasActiveOrganization) {
        return <Navigate to="/hello" replace />;
    }

    return children;
};

const NoOrganizationOnly = ({ children }) => {
    const { organizationList, isLoading } = useSelector((state) => state.organization);

    if (isLoading) return null;

    const hasActiveOrganization = organizationList.some((org) => org.status === 'active');

    if (hasActiveOrganization) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const MainRouter = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrganizationList());
    }, [dispatch]);

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            <Route element={<MainLayouts />}>
                <Route
                    path="/hello"
                    element={
                        <PrivateRoute>
                            <NoOrganizationOnly>
                                <HelloPage />
                            </NoOrganizationOnly>
                        </PrivateRoute>
                    }
                />

                {/* Главная страница - требует активную организацию */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <OrganizationGuard>
                                <MainPage />
                            </OrganizationGuard>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/unitEconomic"
                    element={
                        <PrivateRoute>
                            <OrganizationGuard>
                                <UnitEconomicPage />
                            </OrganizationGuard>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <PrivateRoute>
                            <OrganizationGuard>
                                <FinanceReportPage />
                            </OrganizationGuard>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <OrganizationGuard>
                                <SettingsPage />
                            </OrganizationGuard>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <OrganizationGuard>
                                <AdminPanel />
                            </OrganizationGuard>
                        </PrivateRoute>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default MainRouter;
