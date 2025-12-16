import './style.scss';
import { Button, Table } from '@mantine/core';
import CreateUnitEconomicModal from '../../components/unicEconomic/createUnicEconomicModel/CreateUnitEconomicModal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProductById,
    getProductListByOrganization,
    openCloseDetails,
    setOpenCloseCreateState,
} from '../../store/reducers/unitEconomicSlice.js';
import { useEffect } from 'react';
import ViewUnitEconomicModal from '../../components/unicEconomic/details/ViewDetailsModal.jsx';

const UnitEconomicPage = () => {
    const { organization } = useSelector((state) => state.organization);
    const { items, isEdit, selectedUnitItem } = useSelector((state) => state.unitEconomic);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProductListByOrganization({ organizationId: organization.id }));
    }, [organization]);
    const openAddModal = () => {
        dispatch(openCloseDetails(true));
    };

    const openDetails = (id) => {
        dispatch(setOpenCloseCreateState(true));
        dispatch(getProductById({ productId: id }));
    };

    return (
        <div className="mainPageContainer">
            <Button
                variant="outline"
                size="md"
                radius="md"
                className="addButton"
                fullWidth={false}
                onClick={openAddModal}
            >
                Добавить
            </Button>

            <div className="myProduct">
                <Table
                    horizontalSpacing="lg"
                    verticalSpacing="sm"
                    striped
                    withTableBorder
                    className="myTable"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th> # </Table.Th>
                            <Table.Th>Наименование товара</Table.Th>
                            <Table.Th>Артикул</Table.Th>
                            <Table.Th>Себестоимость</Table.Th>
                            <Table.Th>Цена продажи</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {items && items.length > 0 ? (
                            items.map((item, index) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>{index + 1}</Table.Td>
                                    <Table.Td
                                        style={{ cursor: 'pointer', color: '#1a73e8' }}
                                        onClick={() => {
                                            openDetails(item.id);
                                        }}
                                    >
                                        {item.productName}
                                    </Table.Td>
                                    <Table.Td
                                        style={{ cursor: 'pointer', color: '#1a73e8' }}
                                        onClick={() => {
                                            openDetails(item.id);
                                        }}
                                    >
                                        {item.vendorCode}
                                    </Table.Td>
                                    <Table.Td>{item.priceWithSpp}</Table.Td>
                                    <Table.Td>{item.salePrice}</Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                                    Нет данных
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>

            <CreateUnitEconomicModal editMode={isEdit} editData={selectedUnitItem} />
            <ViewUnitEconomicModal />
        </div>
    );
};

export default UnitEconomicPage;
