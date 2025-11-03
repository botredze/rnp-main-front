import React from "react";
import { NavLink } from "react-router-dom";
import './style.scss';
import mainLogo  from '../../assets/logos/mainLogo.png';

const SideBar = () => {
    return (
        <aside className="sidebar">
            <div className="logoImage">
                <img src={mainLogo} alt="logo"/>
            </div>
            <nav className="sidebarNav">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    РНП Аналитика
                </NavLink>
                <NavLink
                    to="/unitEconomic"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    Юнит экономика
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    Отчеты
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    Настройки
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    Мой профиль
                </NavLink>
                <NavLink
                    to="/login"
                    className={({ isActive }) => isActive ? 'activeLink' : ''}
                >
                    Выход
                </NavLink>
            </nav>
        </aside>
    );
};

export default SideBar;
