import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from '../pages/mainPage/MainPage.jsx';
import LoginPage from '../pages/loginPage/LoginPage.jsx';
import UnitEconomicPage from '../pages/unitEconomic/UnitEconomicPage.jsx';
import MainLayouts from '../components/layouts/MainLayouts.jsx';
import { useSelector } from 'react-redux';

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
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default MainRouter;
