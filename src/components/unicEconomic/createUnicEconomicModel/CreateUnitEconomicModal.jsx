import { Modal, Group, Button, TextInput, NumberInput, Table } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from '@mantine/form';
import './style.scss';
import {
    createProductByOrganization,
    getProductListByOrganization,
    openCloseDetails,
} from '../../../store/reducers/unitEconomicSlice.js';

const calculateUnitEconomic = (formValues) => {
    const tableData = [...formValues.tableData];
    const priceWB = tableData[0].value ?? 0;
    const sspValue = formValues.ssp ?? 0;
    const wbDiscount = formValues.wbDiscount ?? 0;

    const priceWithSpp = priceWB - sspValue;
    const priceWithWbDiscount = priceWB * (1 - wbDiscount / 100);

    const discountPercent = tableData[1].percent ?? 0;
    const priceForClub = priceWB * (1 - discountPercent / 100);

    const commissionWB = (priceForClub * (tableData[4].percent ?? 0)) / 100;
    const additionalCommission = (priceForClub * (tableData[5].percent ?? 0)) / 100;
    const acquiring = (priceForClub * (tableData[6].percent ?? 0)) / 100;
    const advertising = (priceForClub * (tableData[14].percent ?? 0)) / 100;
    const storage = (priceForClub * (tableData[15].percent ?? 0)) / 100;

    const totalCommission = commissionWB + additionalCommission + acquiring + advertising + storage;
    const toTransfer = priceForClub - totalCommission;
    const profit = toTransfer - (tableData[19].value ?? 0);

    return tableData.map((row, i) => {
        switch (i) {
            case 2:
                return { ...row, value: priceForClub.toFixed(2) };
            case 3:
                return {
                    ...row,
                    value: (commissionWB + additionalCommission + acquiring).toFixed(2),
                };
            case 16:
                return { ...row, value: totalCommission.toFixed(2) };
            case 17:
                return { ...row, value: toTransfer.toFixed(2) };
            case 23:
                return { ...row, value: profit.toFixed(2) };
            default:
                return row;
        }
    });
};

const CreateUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openDetailsState, error, loading } = useSelector((state) => state.unitEconomic);
    const { organization } = useSelector((state) => state.organization);

    const form = useForm({
        initialValues: {
            productName: '',
            vendorCode: '',
            price: '',
            salePrice: '',
            ssp: 38,
            wbDiscount: 7,
            tableData: [
                { label: 'Цена на WB наша', percent: null, value: 0 },
                { label: 'Скидка для WB клуб', percent: 0, value: null },
                { label: 'Цена для WB клуба', percent: null, value: 5000 },
                { label: 'Итого коммиссия WB, руб', percent: null, value: 1825 },
                { label: 'Комиссия WB', percent: 37.5, value: 1725 },
                { label: 'Доп.комиссия', percent: 2, value: 100 },
                { label: 'Эквайринг', percent: 1.5, value: 74 },
                { label: 'Процент выкупа', percent: 42, value: null },
                { label: 'Логистика', percent: null, value: 931.67 },
                { label: 'Реклама', percent: 10, value: 500 },
                { label: 'Хранение', percent: 3, value: 150 },
                { label: 'Себестоимость итого', percent: null, value: 1050 },
                { label: 'Прибыль', percent: null, value: 0 },
            ],
        },
    });

    const handleChange = (index, field, value) => {
        let newValues = { ...form.values };

        newValues.tableData = [...form.values.tableData];
        newValues.tableData[index] = {
            ...newValues.tableData[index],
            [field]: value,
        };

        const newTable = calculateUnitEconomic(newValues);
        form.setFieldValue('tableData', newTable);
    };

    const save = (values) => {
        values.organizationId = organization.id;
        dispatch(createProductByOrganization(values));
        if (!error) {
            dispatch(getProductListByOrganization({ organizationId: organization.id }));
            close();
        }
    };

    const close = () => {
        dispatch(openCloseDetails(false));
    };

    return (
        <Modal opened={openDetailsState} onClose={close} title="Создание товара" size="50%">
            <form onSubmit={form.onSubmit(save)}>
                <div className="container">
                    <div className="main-table">
                        <Table withRowBorders={false} className="unit-table">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: '300px' }}>Показатель</Table.Th>
                                    <Table.Th style={{ width: '250px' }}>
                                        Значение / Результат
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {form.values.tableData.map((row, i) => (
                                    <Table.Tr key={i} className="highlight-row">
                                        <Table.Td>{row.label}</Table.Td>
                                        <Table.Td>
                                            {row.percent !== null ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                    }}
                                                >
                                                    <NumberInput
                                                        size="xs"
                                                        radius="md"
                                                        variant="filled"
                                                        style={{ width: 80 }}
                                                        value={row.percent}
                                                        onChange={(val) =>
                                                            handleChange(i, 'percent', val)
                                                        }
                                                    />
                                                    <span>% = {row.value ?? '—'} ₽</span>
                                                </div>
                                            ) : row.value !== null ? (
                                                <NumberInput
                                                    size="xs"
                                                    radius="md"
                                                    variant="filled"
                                                    style={{ width: 100 }}
                                                    value={row.value}
                                                    onChange={(val) =>
                                                        handleChange(i, 'value', val)
                                                    }
                                                />
                                            ) : (
                                                <span>{row.value ?? '—'}</span>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>

                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={close}>
                        Отмена
                    </Button>
                    <Button type="submit">Сохранить</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default CreateUnitEconomicModal;
