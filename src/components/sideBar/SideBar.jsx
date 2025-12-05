import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Select } from '@mantine/core';
import './style.scss';
import mainLogo from '../../assets/logos/mainLogo.png';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOrganizationList,
    setSelectedOrganization,
} from '../../store/reducers/organizationSlice.js';
import { logout } from '../../store/reducers/authSlice.js';

const SideBar = () => {
    const [selectedIP, setSelectedIP] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { organizationList, organization } = useSelector((state) => state.organization);

    const { user, role } = useSelector((state) => state.auth);

    // Загрузка списка организаций при монтировании компонента
    useEffect(() => {
        dispatch(getOrganizationList());
    }, [dispatch]);

    // Установка первой организации по умолчанию
    useEffect(() => {
        if (organizationList.length > 0 && !organization.id) {
            const firstOrg = organizationList[0];
            setSelectedIP(String(firstOrg.id));
            dispatch(setSelectedOrganization(firstOrg));
        }
    }, [organizationList, organization.id, dispatch]);

    // Синхронизация selectedIP с выбранной организацией
    useEffect(() => {
        if (organization.id) {
            setSelectedIP(String(organization.id));
        }
    }, [organization.id]);

    const handleSelectChange = (value) => {
        setSelectedIP(value);
        const selectedOrg = organizationList.find((org) => String(org.id) === value);
        if (selectedOrg) {
            dispatch(setSelectedOrganization(selectedOrg));
        }
    };

    const handleLogout = () => {
        dispatch(logout()); // очищает user/token в redux
        localStorage.clear(); // очищает localStorage полностью
        navigate('/login'); // перенаправление
    };

    return (
        <aside className="sidebar">
            <div className="logoImage">
                <img src={mainLogo} alt="logo" />
            </div>

            <nav className="sidebarNav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'activeLink' : '')}>
                    РНП Аналитика
                </NavLink>
                <NavLink
                    to="/unitEconomic"
                    className={({ isActive }) => (isActive ? 'activeLink' : '')}
                >
                    Юнит экономика
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => (isActive ? 'activeLink' : '')}>
                    Отчеты
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => (isActive ? 'activeLink' : '')}
                >
                    Настройки
                </NavLink>

                {role === 'admins' ||
                    (role === 'managers' && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => (isActive ? 'activeLink' : '')}
                        >
                            Админ панель
                        </NavLink>
                    ))}

                <button className="logoutButton" onClick={handleLogout}>
                    Выйти
                </button>
            </nav>

            <div className="sidebarFooter">
                <Select
                    label="Выберите ИП"
                    placeholder="Выбрать ИП"
                    data={organizationList.map((org) => ({
                        value: String(org.id),
                        label: org.organizationName,
                    }))}
                    value={selectedIP}
                    onChange={handleSelectChange}
                    radius="md"
                    size="sm"
                />
            </div>
        </aside>
    );
};

export default SideBar;
