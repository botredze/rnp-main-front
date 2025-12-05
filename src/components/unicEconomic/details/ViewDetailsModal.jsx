import { Modal, Group, Button, Table, Text } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenCloseCreateState } from '../../../store/reducers/unitEconomicSlice.js';
import './style.scss';

const ViewUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openCloseCreateState, selectedItem } = useSelector((state) => state.unitEconomic);

    const close = () => dispatch(setOpenCloseCreateState(false));

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
                            <strong>Себестоимость:</strong> {getValue('Себестоимость итого')} ₽
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

                {/* === Таблица === */}
                {tableData.length > 0 && (
                    <div className="main-table">
                        <Table
                            striped
                            withColumnBorders
                            withTableBorder
                            className="unit-details-table"
                        >
                            <Table.Thead>
                                <Table.Tr className="highlight-row">
                                    <Table.Th style={{ width: '250px' }}>Показатель</Table.Th>
                                    <Table.Th style={{ width: '90px' }}>%</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Значение</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Процент от цены</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {tableData.map((row, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{row.label}</Table.Td>

                                        <Table.Td>
                                            {row.percent !== '' &&
                                            row.percent !== null &&
                                            row.percent !== undefined
                                                ? `${row.percent} %`
                                                : ''}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.value !== '' &&
                                            row.value !== null &&
                                            row.value !== undefined
                                                ? `${row.value} ₽`
                                                : ''}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.percentOfPrice ? `${row.percentOfPrice}%` : ''}
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
                <Button color="blue" onClick={() => console.log('Редактировать')}>
                    Изменить
                </Button>

                <Button variant="default" onClick={close}>
                    Закрыть
                </Button>
            </Group>
        </Modal>
    );
};

export default ViewUnitEconomicModal;
