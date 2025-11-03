import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/mainPage/MainPage.jsx";
import MainLayouts from "../components/layouts/MainLayouts.jsx";
import LoginPage from "../pages/loginPage/LoginPage.jsx";
import UnitEconomicPage from "../pages/unitEconomic/UnitEconomicPage.jsx";

const MainRouter = () => {
    return (
        <>
            <Routes>
                <Route element={<MainLayouts />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unitEconomic" element={<UnitEconomicPage />}/>
                </Route>
            </Routes>
        </>
    )
}

export default MainRouter