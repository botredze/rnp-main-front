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
import { getOrganizationProductLis } from '../../store/reducers/productsSlice.js';

const SideBar = () => {
    const [selectedIP, setSelectedIP] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { organizationList, organization } = useSelector((state) => state.organization);

    useEffect(() => {
        dispatch(getOrganizationList());
        if (organizationList.length > 0 && organizationList?.[0].id > 0 && organization.id === 0) {
            setSelectedIP(String(organizationList[0].id));
            dispatch(setSelectedOrganization(organizationList[0]));
        }
    }, [organization]);

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
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'activeLink' : '')}>
                    Отчеты
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => (isActive ? 'activeLink' : '')}
                >
                    Настройки
                </NavLink>

                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'activeLink' : '')}>
                    Админка
                </NavLink>
                {/*<NavLink*/}
                {/*    to="/settings"*/}
                {/*    className={({ isActive }) => (isActive ? 'activeLink' : '')}*/}
                {/*>*/}
                {/*    Мой профиль*/}
                {/*</NavLink>*/}

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
