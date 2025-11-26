import { Modal, Table, ScrollArea, Text, Button, Drawer } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setViewOrganizationModal } from '../../../store/reducers/usersSlice.js';
import { IconBan, IconEdit } from '@tabler/icons-react';
import React from 'react';
import { statusMapper } from '../../../helpers/mapper.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './style.scss';
import {
    setEditOrganizationOpenState,
    setOpenCreateOrganizationState,
    setSelectedEditOrganization,
} from '../../../store/reducers/organizationSlice.js';

const ViewOrganizationList = ({ openEditModal }) => {
    const { viewOrganizationModal, selectedUser } = useSelector((state) => state.users);
    const { organizationListById } = useSelector((state) => state.organization);
    const dispatch = useDispatch();

    const onCloseModal = () => {
        dispatch(setViewOrganizationModal(false));
    };

    const openAddOrganizationDrawer = () => {
        dispatch(setSelectedEditOrganization(null));
        dispatch(setViewOrganizationModal(false));
        dispatch(setOpenCreateOrganizationState(true));
    };

    const openEditDrawer = (data) => {
        dispatch(setSelectedEditOrganization(data));
        dispatch(setViewOrganizationModal(false));
        dispatch(setEditOrganizationOpenState(true));
    };

    const openDiactiveOrg = (data) => {
        console.log(data, 'data ');
        dispatch(setViewOrganizationModal(false));
        openEditModal(data);
    };

    return (
        <Drawer
            opened={viewOrganizationModal}
            onClose={onCloseModal}
            title={`Профили WB: ${selectedUser?.fio}`}
            size="80%"
            padding="md"
            position="right"
        >
            <div className="createOrganization">
                <h3>Добавьте организацию чтобы получить данные аналитики</h3>
                <Button
                    variant="light"
                    color="green"
                    radius="md"
                    leftSection={<AddBoxIcon size={16} />}
                    onClick={() => openAddOrganizationDrawer()}
                >
                    Добавить кабинет
                </Button>
            </div>

            {organizationListById && organizationListById.length > 0 ? (
                <ScrollArea>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Название организации</Table.Th>
                                <Table.Th>WB Название</Table.Th>
                                <Table.Th>Торговая марка</Table.Th>
                                <Table.Th>Дата создания</Table.Th>
                                <Table.Th>Дата оплаты</Table.Th>
                                <Table.Th>Статус</Table.Th>
                                <Table.Th>Действие</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {organizationListById.map((org) => (
                                <Table.Tr key={org.id}>
                                    <Table.Td>{org.organizationName}</Table.Td>
                                    <Table.Td>{org.wbOrganizationName}</Table.Td>
                                    <Table.Td>{org.tradeMark}</Table.Td>
                                    <Table.Td>
                                        {new Date(org.createdDate).toLocaleDateString()}
                                    </Table.Td>
                                    <Table.Td>
                                        {new Date(org.paymentDate).toLocaleDateString()}
                                    </Table.Td>
                                    <Table.Td>{statusMapper(org.status)}</Table.Td>

                                    <Table.Td>
                                        <div className="actionButtons">
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
                                                variant="light"
                                                color="orange"
                                                radius="md"
                                                leftSection={<IconBan size={16} />}
                                                onClick={() => openDiactiveOrg(org)}
                                            >
                                                Деактивировать
                                            </Button>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            ) : (
                <Text color="dimmed">Организации не найдены</Text>
            )}

            <div
                className="closeButton"
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Button variant="outline" color="red" radius="md" onClick={() => onCloseModal()}>
                    Закрыть
                </Button>
            </div>
        </Drawer>
    );
};

export default ViewOrganizationList;
