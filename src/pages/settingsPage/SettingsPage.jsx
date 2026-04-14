import React, { useEffect, useState } from 'react';
import './style.scss';
import { Badge, Button, Loader, Table, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    diactiveOrganization,
    getOrganizationList,
    setEditOrganizationOpenState,
    setOpenCreateOrganizationState,
    setSelectedEditOrganization,
    triggerOrganizationSync,
} from '../../store/reducers/organizationSlice.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { statusMapper } from '../../helpers/mapper.js';
import { IconEdit, IconRefresh, IconTrash } from '@tabler/icons-react';
import AddOrganizationDrawer from '../../components/addOrganizationDrawer/AddOrganizationDrawer.jsx';
import ConfirmAlert from '../../components/configAlert/confirmAlert.jsx';

const SettingsPage = () => {
    const dispatch = useDispatch();

    const [selectedOrd, setSelectedOrganization] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getOrganizationList());
    }, [dispatch]);

    const openCreateDrawer = () => {
        dispatch(setSelectedEditOrganization(null));
        dispatch(setOpenCreateOrganizationState(true));
    };

    const { organizationList, syncingOrgId } = useSelector((state) => state.organization);
    const { role } = useSelector((state) => state.auth);
    const isAdmin = role === 'admin';

    const formatSyncDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSyncBadge = (syncInfo) => {
        if (!syncInfo) return <Badge color="gray" variant="light">Нет данных</Badge>;
        const { syncStatus } = syncInfo;
        if (syncStatus === 'running') return (
            <Badge color="blue" variant="light" leftSection={<Loader size={10} color="blue" />}>
                Синхронизация...
            </Badge>
        );
        if (syncStatus === 'success') return <Badge color="green" variant="light">Готово</Badge>;
        if (syncStatus === 'error') return <Badge color="red" variant="light">Ошибка</Badge>;
        if (syncStatus === 'created') return <Badge color="yellow" variant="light">Ожидание</Badge>;
        return <Badge color="gray" variant="light">{syncStatus}</Badge>;
    };

    const handleSync = (orgId) => {
        dispatch(triggerOrganizationSync(orgId)).then(() => {
            setTimeout(() => dispatch(getOrganizationList()), 2000);
        });
    };

    const openEditDrawer = (data) => {
        dispatch(setEditOrganizationOpenState(true));
        dispatch(setSelectedEditOrganization(data));
    };

    const openConfirmDelete = (data) => {
        setSelectedOrganization(data);
        setDeleteModalOpen(true);
    };

    const closeConfirmDelete = () => {
        setDeleteModalOpen(false);
        setSelectedOrganization(null);
    };

    const deleteUser = () => {
        dispatch(diactiveOrganization({ organizationId: selectedOrd.id, action: 'delete' }));
        dispatch(getOrganizationList());
        closeConfirmDelete();
    };

    return (
        <div className="settingPages">
            <div className="title">
                <h3>Настройки</h3>

                <div className="addNewButton">
                    <Button
                        variant="light"
                        color="green"
                        radius="md"
                        leftSection={<AddBoxIcon size={16} />}
                        onClick={openCreateDrawer}
                    >
                        Добавить
                    </Button>
                </div>
            </div>

            <div className="myOrganizations">
                <Table striped withTableBorder withColumnBorders className="customTable">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="customHeader">#</Table.Th>
                            <Table.Th className="customHeader">Название организации</Table.Th>
                            <Table.Th className="customHeader">WB Название</Table.Th>
                            <Table.Th className="customHeader">Торговая марка</Table.Th>
                            <Table.Th className="customHeader">Дата создания</Table.Th>
                            <Table.Th className="customHeader">Дата оплаты</Table.Th>
                            <Table.Th className="customHeader">Статус</Table.Th>
                            <Table.Th className="customHeader">Последняя синхронизация</Table.Th>
                            <Table.Th className="customHeader">Статус синхронизации</Table.Th>
                            <Table.Th className="customHeader">Действие</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {organizationList.map((org, index) => {
                            const isSyncing = syncingOrgId === org.id || org.syncInfo?.syncStatus === 'running';
                            return (
                                <Table.Tr key={org.id || index}>
                                    <Table.Td className="customCell">{index + 1}</Table.Td>
                                    <Table.Td className="customCell">{org.organizationName}</Table.Td>
                                    <Table.Td className="customCell">{org.wbOrganizationName}</Table.Td>
                                    <Table.Td className="customCell">{org.tradeMark}</Table.Td>
                                    <Table.Td className="customCell">
                                        {new Date(org.createdDate).toLocaleDateString()}
                                    </Table.Td>
                                    <Table.Td className="customCell">
                                        {new Date(org.paymentDate).toLocaleDateString()}
                                    </Table.Td>
                                    <Table.Td className="customCell">
                                        {statusMapper(org.status)}
                                    </Table.Td>
                                    <Table.Td className="customCell" style={{ whiteSpace: 'nowrap' }}>
                                        {formatSyncDate(org.syncInfo?.lastSyncTime)}
                                    </Table.Td>
                                    <Table.Td className="customCell">
                                        {getSyncBadge(org.syncInfo)}
                                    </Table.Td>
                                    <Table.Td className="customCell actionCell">
                                        <Button
                                            variant="light"
                                            color="blue"
                                            radius="md"
                                            leftSection={<IconEdit size={16} />}
                                            onClick={() => openEditDrawer(org)}
                                        >
                                            Редактировать
                                        </Button>

                                        {isAdmin && (
                                            <Tooltip label="Запустить синхронизацию с WB" position="top">
                                                <Button
                                                    variant="light"
                                                    color="teal"
                                                    radius="md"
                                                    leftSection={isSyncing ? <Loader size={14} color="teal" /> : <IconRefresh size={16} />}
                                                    onClick={() => handleSync(org.id)}
                                                    disabled={isSyncing}
                                                >
                                                    {isSyncing ? 'Запуск...' : 'Синхронизировать'}
                                                </Button>
                                            </Tooltip>
                                        )}

                                        <Button
                                            variant="outline"
                                            radius="md"
                                            sx={{
                                                color: '#D91616',
                                                borderColor: '#D91616',
                                                '&:hover': { backgroundColor: '#ffe5e5' },
                                            }}
                                            leftSection={<IconTrash size={16} />}
                                            onClick={() => openConfirmDelete(org)}
                                        >
                                            Удалить
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </div>

            <AddOrganizationDrawer />

            <ConfirmAlert
                openState={deleteModalOpen}
                onClose={closeConfirmDelete}
                onConfirm={deleteUser}
                title="Удаление"
                message={`Вы действительно хотите удалить профиль ${selectedOrd?.organizationName}`}
            />
        </div>
    );
};

export default SettingsPage;
