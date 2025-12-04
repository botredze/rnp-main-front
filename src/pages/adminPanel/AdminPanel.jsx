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
    deactivateUser,
    getUsersList,
    setAddUserState,
    setEditOrganizationModal,
    setFilters,
    setSelectedUser,
    setViewOrganizationModal,
} from '../../store/reducers/usersSlice.js';
import { IconEdit, IconTrash, IconBan } from '@tabler/icons-react';
import {
    diactiveOrganization,
    getOrganizationListByUserId,
} from '../../store/reducers/organizationSlice.js';
import ViewOrganizationList from '../../components/users/viewOrganizationList/ViewOrganizationList.jsx';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConfirmAlert from '../../components/configAlert/confirmAlert.jsx';
import AddUserModal from '../../components/users/addUserModal/AddUserModal.jsx';
import AddOrganizationDrawer from '../../components/addOrganizationDrawer/AddOrganizationDrawer.jsx';

const AdminPanel = () => {
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const dispatch = useDispatch();
    //delete
    const [selectedUser, setSelectedUserItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // dicative
    const [dicativeModalOpen, setDicativeModalOpen] = useState(false);
    const [dicativeOrg, setDiactiveOrg] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const [activeConfirmModalOpen, setActiveConfirmModalOpen] = useState(false);
    const [activeOrganization, setActiveOrganization] = useState(null);

    useEffect(() => {
        const params = {};

        if (selectedStatus) params.status = selectedStatus;
        if (selectedRole) params.role = selectedRole;

        dispatch(getUsersList(params));
    }, [selectedStatus, selectedRole]);

    const { usersList, filterParams, selectedUser: user } = useSelector((state) => state.users);

    const openAddUserModal = () => {
        dispatch(setSelectedUser(null));
        dispatch(setAddUserState(true));
        dispatch(
            setFilters({
                status: selectedStatus,
                role: selectedRole,
            })
        );
    };

    const openUserOrganizations = (data) => {
        dispatch(setViewOrganizationModal(true));
        dispatch(setSelectedUser(data));

        if (data.id !== 0) {
            dispatch(getOrganizationListByUserId({ userId: data.id }));
        }
    };

    const openConfirmDelete = (data) => {
        setSelectedUserItem(data);
        setDeleteModalOpen(true);
    };

    const closeConfirmDelete = () => {
        setDeleteModalOpen(false);
        setSelectedUserItem(null);
    };

    const deleteUser = () => {
        dispatch(deactivateUser({ userId: selectedUser.id, action: 'delete' }));
        dispatch(getUsersList(filterParams));
        closeConfirmDelete();
    };

    const openDiactiveModalConfirm = (data) => {
        setSelectedUserItem(data);
        setDicativeModalOpen(true);
    };

    const closeDiactiveModalConfirm = () => {
        setDicativeModalOpen(false);
        setSelectedUserItem(null);
    };

    const dicativeUser = () => {
        dispatch(deactivateUser({ userId: selectedUser.id, action: 'diactive' }));
        dispatch(getUsersList(filterParams));
        closeDiactiveModalConfirm();
    };

    const editUserDrawer = (data) => {
        dispatch(setEditOrganizationModal(true));
        dispatch(setSelectedUser(data));
    };

    const openDiactiveOrganization = (data) => {
        setDiactiveOrg(true);
        setSelectedOrganization(data);
    };

    const closeDiactiveOrganization = () => {
        setDiactiveOrg(false);
        setSelectedOrganization(null);
    };

    const confirmDiactiveOrganization = () => {
        dispatch(
            diactiveOrganization({ organizationId: selectedOrganization.id, action: 'diactive' })
        );
        dispatch(getOrganizationListByUserId({ userId: user.id }));
        closeDiactiveOrganization();
    };

    const openActiveOrganization = (data) => {
        setActiveConfirmModalOpen(true);
        setActiveOrganization(data);
    };

    const closeActiveOrganization = () => {
        setActiveConfirmModalOpen(false);
        setActiveOrganization(null);
    };

    const activeOrganizationConfirm = () => {
        dispatch(diactiveOrganization({ organizationId: activeOrganization.id, action: 'active' }));
        dispatch(getOrganizationListByUserId({ userId: user.id }));
        closeActiveOrganization();
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
                        leftSection={<IconEdit size={16} />}
                        onClick={() => editUserDrawer(user)}
                    >
                        Редактировать
                    </Button>

                    <Button
                        variant="light"
                        color="orange"
                        radius="md"
                        leftSection={<IconBan size={16} />}
                        onClick={() => openDiactiveModalConfirm(user)}
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
                        leftSection={<IconTrash size={16} />}
                        onClick={() => openConfirmDelete(user)}
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
                    <Button
                        variant="light"
                        size="lg"
                        radius="md"
                        color="green"
                        onClick={openAddUserModal}
                        leftSection={<AddBoxIcon size={16} />}
                    >
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
            <ViewOrganizationList
                openEditModal={openDiactiveOrganization}
                openActivateOrg={openActiveOrganization}
            />

            <AddOrganizationDrawer />
            <ConfirmAlert
                openState={deleteModalOpen}
                onClose={closeConfirmDelete}
                onConfirm={deleteUser}
                title="Удаление"
                message={`Вы действительно хотите удалить пользователя ${selectedUser?.fio}`}
            />

            <ConfirmAlert
                openState={dicativeModalOpen}
                onClose={closeDiactiveModalConfirm}
                onConfirm={dicativeUser}
                title="Деактивация"
                message={`Вы действительно хотите деактивировать пользователя ${selectedUser?.fio}`}
            />

            <ConfirmAlert
                openState={dicativeOrg}
                onClose={closeDiactiveOrganization}
                onConfirm={confirmDiactiveOrganization}
                title="Деактивация"
                message={`Вы действительно хотите деактивировать профиль ${selectedOrganization?.organizationName}`}
            />

            <ConfirmAlert
                openState={activeConfirmModalOpen}
                onClose={closeActiveOrganization}
                onConfirm={activeOrganizationConfirm}
                title="Активация"
                message={`Вы действительно хотите активировать профиль ${activeOrganization?.organizationName}`}
            />
        </div>
    );
};

export default AdminPanel;
