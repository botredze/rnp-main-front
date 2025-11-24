import React, { useEffect } from 'react';
import './style.scss';
import { Button, Table } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOrganizationList,
    setEditOrganizationOpenState,
    setOpenCreateOrganizationState,
    setSelectedOrganization,
} from '../../store/reducers/organizationSlice.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { statusMapper } from '../../helpers/mapper.js';
import { IconEdit } from '@tabler/icons-react';
import AddOrganizationDrawer from '../../components/addOrganizationDrawer/AddOrganizationDrawer.jsx';

const SettingsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrganizationList());
    }, [dispatch]);

    const openCreateDrawer = () => {
        dispatch(setOpenCreateOrganizationState(true));
    };

    const { organizationList } = useSelector((state) => state.organization);

    const openEditDrawer = (data) => {
        dispatch(setEditOrganizationOpenState(true));
        dispatch(setSelectedOrganization(data));
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
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>

            <AddOrganizationDrawer />
        </div>
    );
};

export default SettingsPage;
