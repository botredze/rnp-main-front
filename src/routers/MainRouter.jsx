import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage.jsx';
import LoginPage from '../pages/loginPage/LoginPage.jsx';
import UnitEconomicPage from '../pages/unitEconomic/UnitEconomicPage.jsx';
import MainLayouts from '../components/layouts/MainLayouts.jsx';
import { useSelector } from 'react-redux';
import SettingsPage from '../pages/settingsPage/SettingsPage.jsx';
import AdminPanel from '../pages/adminPanel/AdminPanel.jsx';
import FinanceReportPage from '../pages/FinanceReportPage/FinanceReportPage.jsx';

const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    return token ? children : <Navigate to="/login" replace />;
};

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<MainLayouts />}>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/unitEconomic"
                    element={
                        <PrivateRoute>
                            <UnitEconomicPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <PrivateRoute>
                            <FinanceReportPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminPanel />
                        </PrivateRoute>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default MainRouter;
