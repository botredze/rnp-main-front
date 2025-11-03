import './style.scss';
import { Button, Table } from '@mantine/core';
import CreateUnitEconomicModal from '../../components/unicEconomic/createUnicEconomicModel/CreateUnitEconomicModal.jsx';
import { useDispatch } from 'react-redux';
import { openCloseDetails } from '../../store/reducers/unitEconomicSlice.js';

const UnitEconomicPage = () => {
    const rows = {};
    const dispatch = useDispatch();

    const openAddModal = () => {
        dispatch(openCloseDetails(true));
    };

    return (
        <div className="mainPageContainer">
            <Button
                variant="outline"
                size="md"
                radius="md"
                className="addButton"
                fullWidth:false
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
                    stickyHeader
                    stickyHeaderOffset={60}
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th> # </Table.Th>
                            <Table.Th>Наименование товара</Table.Th>
                            <Table.Th>Артикул</Table.Th>
                            <Table.Th>Себестоимость</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                </Table>
            </div>

            <CreateUnitEconomicModal />
        </div>
    );
};

export default UnitEconomicPage;
