import { Modal, Group, Button, Table, Text } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {
    setOpenCloseCreateState,
    openCloseDetails,
    setSelectedUnitItem,
    setIsEditItem,
} from '../../../store/reducers/unitEconomicSlice.js';
import './style.scss';

const ViewUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openCloseCreateState, selectedItem } = useSelector((state) => state.unitEconomic);

    const close = () => dispatch(setOpenCloseCreateState(false));

    const handleEdit = () => {
        dispatch(setSelectedUnitItem(selectedItem));
        dispatch(setIsEditItem(true));
        dispatch(setOpenCloseCreateState(false));
        dispatch(openCloseDetails(true));
    };

    if (!selectedItem) return null;

    const tableData = selectedItem.tableData || [];

    const getValue = (label) => {
        const item = tableData.find((i) => i.label === label);
        return item ? item.value : '';
    };

    const getPercent = (label) => {
        const item = tableData.find((i) => i.label === label);
        return item ? item.percent : '';
    };

    return (
        <Modal
            opened={openCloseCreateState}
            onClose={close}
            title="Просмотр юнит-экономики товара"
            size="60%"
        >
            <div className="container">
                {/* === Основная информация о товаре === */}
                <div className="mainContent">
                    <div>
                        <Text size="sm">
                            <strong>Наименование товара:</strong> {selectedItem.productName}
                        </Text>
                        <Text size="sm">
                            <strong>Артикул на ВБ:</strong> {selectedItem.vendorCode}
                        </Text>
                        <Text size="sm">
                            <strong>Себестоимость:</strong> {selectedItem.price} ₽
                        </Text>
                        <Text size="sm">
                            <strong>Цена продажи (до СПП):</strong> {getValue('Цена на WB наша')} ₽
                        </Text>
                    </div>

                    <div>
                        <Text size="sm">
                            <strong>СПП:</strong> {selectedItem.ssp} %
                        </Text>
                        <Text size="sm">
                            <strong>Цена с СПП:</strong> {getValue('Цена с СПП')} ₽
                        </Text>
                        <Text size="sm">
                            <strong>Цена к перечислению от WB:</strong>{' '}
                            {getValue('К перечислению от WB')} ₽
                        </Text>
                        <Text size="sm">
                            <strong>ROI:</strong> {getPercent('ROI за единицу')} %
                        </Text>
                        <Text size="sm">
                            <strong>Маржинальность:</strong> {getPercent('Маржинальность')} %
                        </Text>
                    </div>
                </div>

                {tableData.length > 0 && (
                    <div className="main-table">
                        <Table
                            striped
                            withColumnBorders
                            withTableBorder
                            className="unit-details-table"
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: '250px' }}>Показатель</Table.Th>
                                    <Table.Th style={{ width: '90px' }}>Процент/Значение</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Итого</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {tableData.map((row, index) => (
                                    <Table.Tr
                                        key={index}
                                        className={row.activeLine ? 'active-line-row' : ''}
                                    >
                                        <Table.Td className={row.seconder ? 'seconder-item' : ''}>
                                            {row.label}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.percent !== '' &&
                                            row.percent !== null &&
                                            row.percent !== undefined
                                                ? `${row.percent} ${row?.symbol}`
                                                : ''}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.value !== '' &&
                                            row.value !== null &&
                                            row.value !== undefined &&
                                            row.value !== 0
                                                ? `${row.value} ${row?.symbol}`
                                                : ''}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* === Кнопки === */}
            <Group justify="space-between" mt="xl">
                <Button color="blue" onClick={handleEdit}>
                    Редактировать
                </Button>

                <Button variant="default" onClick={close}>
                    Закрыть
                </Button>
            </Group>
        </Modal>
    );
};

export default ViewUnitEconomicModal;
