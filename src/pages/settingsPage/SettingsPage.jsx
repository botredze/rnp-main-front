import React, { useEffect, useState } from 'react';
import './style.scss';
import { Button, Table } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    diactiveOrganization,
    getOrganizationList,
    setEditOrganizationOpenState,
    setOpenCreateOrganizationState,
    setSelectedEditOrganization,
} from '../../store/reducers/organizationSlice.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { statusMapper } from '../../helpers/mapper.js';
import { IconEdit, IconTrash } from '@tabler/icons-react';
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

    const { organizationList } = useSelector((state) => state.organization);

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
                            <Table.Th className="customHeader">Действие</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {organizationList.map((org, index) => (
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
                        ))}
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
