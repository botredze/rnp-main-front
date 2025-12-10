import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Select, ActionIcon, Tooltip } from '@mantine/core';
import {
    IconChartBar,
    IconCoin,
    IconFileAnalytics,
    IconSettings,
    IconShield,
    IconLogout,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react';
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { organizationList, organization } = useSelector((state) => state.organization);
    const { user, role } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getOrganizationList());
    }, [dispatch]);

    useEffect(() => {
        if (organizationList.length > 0 && !organization.id) {
            const firstOrg = organizationList[0];
            setSelectedIP(String(firstOrg.id));
            dispatch(setSelectedOrganization(firstOrg));
        }
    }, [organizationList, organization.id, dispatch]);

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
        dispatch(logout());
        localStorage.clear();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { to: '/', label: 'РНП Аналитика', icon: <IconChartBar size={20} /> },
        { to: '/unitEconomic', label: 'Юнит экономика', icon: <IconCoin size={20} /> },
        { to: '/reports', label: 'Отчеты', icon: <IconFileAnalytics size={20} /> },
        { to: '/settings', label: 'Настройки', icon: <IconSettings size={20} /> },
    ];

    if (role === 'admins' || role === 'managers') {
        menuItems.push({
            to: '/admin',
            label: 'Админ панель',
            icon: <IconShield size={20} />,
        });
    }

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebarHeader">
                <ActionIcon
                    onClick={toggleSidebar}
                    variant="subtle"
                    color="dark"
                    className="toggleButton"
                    size="lg"
                >
                    {isCollapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
                </ActionIcon>

                <div className="logoImage">
                    <img src={mainLogo} alt="logo" />
                </div>
            </div>

            <nav className="sidebarNav">
                {menuItems.map((item) => (
                    <Tooltip
                        label={item.label}
                        position="right"
                        disabled={!isCollapsed}
                        key={item.to}
                    >
                        <NavLink
                            to={item.to}
                            className={({ isActive }) => (isActive ? 'activeLink' : '')}
                        >
                            <span className="navIcon">{item.icon}</span>
                            {!isCollapsed && <span className="navLabel">{item.label}</span>}
                        </NavLink>
                    </Tooltip>
                ))}

                <Tooltip label="Выйти" position="right" disabled={!isCollapsed}>
                    <button className="logoutButton" onClick={handleLogout}>
                        <span className="navIcon">
                            <IconLogout size={20} />
                        </span>
                        {!isCollapsed && <span className="navLabel">Выйти</span>}
                    </button>
                </Tooltip>
            </nav>

            {!isCollapsed && (
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
                        withAlignedLabels
                        checkIconPosition="right"
                        radius="md"
                        size="sm"
                        styles={{
                            input: { fontSize: 16 },
                            label: { fontSize: 16, marginBottom: 10 },
                            item: { fontSize: 16 },
                        }}
                    />
                </div>
            )}
        </aside>
    );
};

export default SideBar;
