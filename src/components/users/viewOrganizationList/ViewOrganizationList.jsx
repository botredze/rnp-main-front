import { Modal, Table, ScrollArea, Text, Button, Drawer } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setViewOrganizationModal } from '../../../store/reducers/usersSlice.js';
import { IconEdit } from '@tabler/icons-react';
import React from 'react';
import { statusMapper } from '../../../helpers/mapper.js';

const ViewOrganizationList = () => {
    const { viewOrganizationModal, selectedUser } = useSelector((state) => state.users);
    const { organizationListById } = useSelector((state) => state.organization);
    const dispatch = useDispatch();

    const onCloseModal = () => {
        dispatch(setViewOrganizationModal(false));
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
                                        <div>
                                            <Button
                                                variant="light"
                                                color="blue"
                                                radius="md"
                                                leftSection={<IconEdit size={16} />}
                                            >
                                                Редактировать
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
