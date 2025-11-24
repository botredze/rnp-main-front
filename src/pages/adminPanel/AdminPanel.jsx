import React, { useEffect, useState } from 'react';
import './style.scss';
import { Button, Select, Table } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    userRoleMap,
    userRoles,
    userStatuses,
    userStatusMap,
} from '../../components/helpers/usersMap.js';
import {
    getUsersList,
    setAddUserState,
    setFilters,
    setSelectedUser,
    setViewOrganizationModal,
} from '../../store/reducers/usersSlice.js';
import AddUserModal from '../../components/users/addUserModal/AddUserModal.jsx';
import { IconEdit, IconTrash, IconBan } from '@tabler/icons-react';
import { getOrganizationListByUserId } from '../../store/reducers/organizationSlice.js';
import ViewOrganizationList from '../../components/users/viewOrganizationList/ViewOrganizationList.jsx';

const AdminPanel = () => {
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const params = {};

        if (selectedStatus) params.status = selectedStatus;
        if (selectedRole) params.role = selectedRole;

        dispatch(getUsersList(params));
    }, [selectedStatus, selectedRole]);

    const { usersList } = useSelector((state) => state.users);

    const openAddUserModal = () => {
        dispatch(setAddUserState(true));
        dispatch(
            setFilters({
                status: selectedStatus,
                role: selectedRole,
            })
        );
    };

    const openUserOrganizations = (data) => {
        console.log(data, 'data');
        dispatch(setViewOrganizationModal(true));
        dispatch(setSelectedUser(data));

        if (data.id !== 0) {
            dispatch(getOrganizationListByUserId({ userId: data.id }));
        }
    };

    const rows = usersList.map((user, index) => (
        <Table.Tr key={user.id}>
            <Table.Td className="user-table-row">{index + 1}</Table.Td>
            <Table.Td
                className="user-table-row"
                style={{ cursor: 'pointer' }}
                onClick={() => openUserOrganizations(user)}
            >
                {user?.fio}
            </Table.Td>
            <Table.Td className="user-table-row">{user?.login}</Table.Td>

            <Table.Td className="user-table-row">{userRoleMap[user?.role] || user?.role}</Table.Td>

            <Table.Td className="user-table-row">
                {userStatusMap[user?.status] || user?.status}
            </Table.Td>

            <Table.Td className="user-table-row">
                <div className="actionButtons">
                    <Button
                        variant="light"
                        color="blue"
                        radius="md"
                        leftIcon={<IconEdit size={16} />}
                    >
                        Редактировать
                    </Button>

                    <Button
                        variant="light"
                        color="orange"
                        radius="md"
                        leftIcon={<IconBan size={16} />}
                    >
                        Деактивировать
                    </Button>

                    <Button
                        variant="outline"
                        radius="md"
                        sx={{
                            color: '#D91616',
                            borderColor: '#D91616',
                            '&:hover': { backgroundColor: '#ffe5e5' },
                        }}
                        leftIcon={<IconTrash size={16} />}
                    >
                        Удалить
                    </Button>
                </div>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className="adminPanelPage">
            <div className="users">
                <div className="user_title">Пользователи</div>

                <div className="userFilters">
                    <Select
                        className="statusesSelector"
                        placeholder="Выберите статус"
                        data={userStatuses.map((s) => ({
                            value: s.value,
                            label: s.title,
                        }))}
                        clearable
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value)}
                    />

                    <Select
                        className="rolesSelector"
                        placeholder="Выберите роль"
                        data={userRoles.map((r) => ({
                            value: r.value,
                            label: r.title,
                        }))}
                        clearable
                        value={selectedRole}
                        onChange={(value) => setSelectedRole(value)}
                    />
                </div>

                <div className="addButton">
                    <Button variant="light" size="lg" radius="md" onClick={openAddUserModal}>
                        Добавить пользователя
                    </Button>
                </div>
            </div>

            <div className="usersList">
                <Table
                    striped
                    withTableBorder
                    withColumnBorders
                    style={{
                        th: {
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: 14,
                            color: '#1a1b1e',
                        },
                        td: {
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400,
                            fontSize: 13,
                            color: '#333',
                        },
                        tr: {
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        },
                    }}
                >
                    <Table.Thead className="user-table-head">
                        <Table.Tr className="user-table-row user-table-row--head">
                            <Table.Th
                                className="user-table-col user-table-col--index"
                                style={{ width: 70 }}
                            >
                                #
                            </Table.Th>
                            <Table.Th className="user-table-col" style={{ width: 250 }}>
                                ФИО
                            </Table.Th>
                            <Table.Th className="user-table-col" style={{ width: 200 }}>
                                Логин
                            </Table.Th>
                            <Table.Th className="user-table-col" style={{ width: 200 }}>
                                Роль
                            </Table.Th>
                            <Table.Th className="user-table-col" style={{ width: 150 }}>
                                Состояние
                            </Table.Th>
                            <Table.Th className="user-table-col user-table-col--actions">
                                Действие
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </div>

            <AddUserModal />
            <ViewOrganizationList />
        </div>
    );
};

export default AdminPanel;
