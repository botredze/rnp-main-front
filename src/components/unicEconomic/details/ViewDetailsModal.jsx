import { Modal, Group, Button, Table, Text } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenCloseCreateState } from '../../../store/reducers/unitEconomicSlice.js';
import './style.scss';

const ViewUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openCloseCreateState, selectedItem } = useSelector((state) => state.unitEconomic);

    const close = () => {
        dispatch(setOpenCloseCreateState(false));
    };

    if (!selectedItem) return null;

    return (
        <Modal
            opened={openCloseCreateState}
            onClose={close}
            title="Просмотр юнит-экономики товара"
            size="50%"
        >
            <div className="container">
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
                            <strong>Цена продажи:</strong> {selectedItem.salePrice} ₽
                        </Text>
                    </div>

                    <div>
                        <Text size="sm">
                            <strong>СПП:</strong> {selectedItem.ssp} %
                        </Text>
                        <Text size="sm">
                            <strong>Цена с СПП:</strong> {selectedItem.priceWithSpp} ₽
                        </Text>
                        <Text size="sm">
                            <strong>Скидка WB:</strong> {selectedItem.wbDiscount}%
                        </Text>
                        <Text size="sm">
                            <strong>Цена с WB скидкой:</strong> {selectedItem.priceWithWbDiscount} ₽
                        </Text>
                    </div>
                </div>

                {selectedItem.tableData && (
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
                                    <Table.Th style={{ width: '90px' }}>Процент</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Значение</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Процент от цены</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {selectedItem.tableData.map((row, index) => (
                                    <Table.Tr
                                        key={index}
                                        className={
                                            [3, 6, 8, 14, 15, 16].includes(index)
                                                ? 'highlight-row cell-highlight-text'
                                                : 'highlight-row'
                                        }
                                    >
                                        <Table.Td>{row.label}</Table.Td>
                                        <Table.Td>
                                            {row.percent !== null &&
                                            row.percent !== undefined &&
                                            row.percent !== ''
                                                ? `${row.percent} %`
                                                : ''}
                                        </Table.Td>
                                        <Table.Td>
                                            {row.value !== null &&
                                            row.value !== undefined &&
                                            row.value !== ''
                                                ? `${row.value} ₽ `
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

            <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={close}>
                    Закрыть
                </Button>
            </Group>
        </Modal>
    );
};

export default ViewUnitEconomicModal;
