import { Modal, Group, Button, TextInput, NumberInput, Table } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from '@mantine/form';
import './style.scss';
import {
    createProductByOrganization,
    getProductListByOrganization,
    openCloseDetails,
} from '../../../store/reducers/unitEconomicSlice.js';
import { calculateUnitEconomic } from './calculator.js';

const CreateUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openDetailsState, error, loading } = useSelector((state) => state.unitEconomic);
    const { organization } = useSelector((state) => state.organization);

    const form = useForm({
        initialValues: {
            productName: '',
            vendorCode: '',
            price: '',
            ssp: 38,
            tableData: [
                {
                    label: 'Цена на WB наша',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                },
                {
                    label: 'Цена с СПП',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'Комиссия WB',
                    percent: 37.5,
                    value: 0,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                },
                {
                    label: 'Доп.комиссия',
                    percent: 2,
                    value: 0,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                },
                {
                    label: 'Эквайринг',
                    percent: 1.5,
                    value: 0,
                    symbol: '%',
                    activeLine: true,
                    disabledInput: false,
                    disabledView: false,
                },
                {
                    label: 'Процент выкупа',
                    percent: 42,
                    value: null,
                    symbol: '%',
                    activeLine: true,
                    disabledInput: false,
                    disabledView: false,
                },
                {
                    label: 'Характеристика товара',
                    percent: null,
                    value: 0,
                    symbol: 'см',
                    activeLine: true,
                    disabledInput: false,
                    disabledView: true,
                },
                {
                    label: ' - Ширина товара',
                    percent: null,
                    value: 0,
                    symbol: 'см',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Длина товара',
                    percent: null,
                    value: 0,
                    symbol: 'см',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Высота товара',
                    percent: null,
                    value: 0,
                    symbol: 'см',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Обьем товара в литрах',
                    percent: null,
                    value: 0,
                    symbol: 'л',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Обьем доп литров',
                    percent: null,
                    value: 0,
                    symbol: 'л',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Стоимость логистики доп литров',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: 'Логистика c учетом % выкупа',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: ' - Цена доставки за первый литр',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Цена доставки за доп. литр',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Коэффициент склада',
                    percent: 0,
                    value: null,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Доставка до клиента',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Возврат от клиента',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: 'Реклама',
                    percent: 0,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: ' - ДРР в бюджете на единицу товара от "цены продавца"',
                    percent: 0,
                    value: null,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Процент брака или потерь',
                    percent: 0,
                    value: null,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Брак и потери',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: 'Хранение',
                    percent: 3,
                    value: 0,
                    symbol: '%',
                    activeLine: true,
                    disabledInput: false,
                    disabledView: true,
                },
                {
                    label: ' - Коэффициент храненеи на складе',
                    percent: 0,
                    value: 0,
                    symbol: '%',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Цена хранения за первый литр',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Цена хранения за доп литры',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Предпологаемый срок хранения',
                    percent: null,
                    value: 0,
                    symbol: 'дн',
                    activeLine: false,
                    disabledInput: false,
                    disabledView: false,
                    seconder: false,
                },
                {
                    label: ' - Цена за хранение за день',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: ' - Цена за хранение в период',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: false,
                    disabledInput: true,
                    disabledView: false,
                    seconder: true,
                },
                {
                    label: 'Доход от продажи',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'К перечислению от WB',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'Рассходы на еденицу',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'Валовая прибыль',
                    percent: null,
                    value: 0,
                    symbol: '₽',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'Маржинальность',
                    percent: 0,
                    value: null,
                    symbol: '%',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
                {
                    label: 'ROI за единицу',
                    percent: 0,
                    value: null,
                    symbol: '%',
                    activeLine: true,
                    disabledInput: true,
                    disabledView: false,
                },
            ],
        },
    });

    const handleChange = (index, field, value) => {
        const updatedTable = [...form.values.tableData];
        updatedTable[index] = { ...updatedTable[index], [field]: value };

        const updatedValues = { ...form.values, tableData: updatedTable };
        const newTable = calculateUnitEconomic(updatedValues);

        form.setFieldValue('tableData', newTable.tableData);
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
        form.reset();
        dispatch(openCloseDetails(false));
    };

    // Обработчик отправки формы только по кнопке
    const handleSubmit = (e) => {
        e.preventDefault(); // Предотвращаем отправку по Enter
    };

    // Обработчик клика на кнопку "Сохранить"
    const handleSaveClick = () => {
        form.validate();
        if (form.isValid()) {
            save(form.values);
        }
    };

    return (
        <Modal opened={openDetailsState} onClose={close} title="Создание товара" size="55%">
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="mainDataContent">
                        <TextInput
                            radius="md"
                            variant="filled"
                            label="Наименование товара"
                            withAsterisk
                            placeholder="Введите название"
                            style={{ width: 450 }}
                            {...form.getInputProps('productName')}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                        <TextInput
                            radius="md"
                            variant="filled"
                            label="Артикул на ВБ"
                            withAsterisk
                            placeholder="Введите артикул"
                            style={{ width: 400 }}
                            {...form.getInputProps('vendorCode')}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Себестоимость"
                            withAsterisk
                            placeholder="Введите цену"
                            style={{ width: 300 }}
                            {...form.getInputProps('price')}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Процент СПП"
                            {...form.getInputProps('ssp')}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                    </div>
                    <div className="main-table">
                        <Table withRowBorders={false} className="unit-table">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: '300px' }}>Показатель</Table.Th>
                                    <Table.Th style={{ width: '150px' }}>Значение</Table.Th>
                                    <Table.Th style={{ width: '200px' }}>Результат</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {form.values.tableData.map((row, index) => (
                                    <Table.Tr
                                        key={index}
                                        className={`highlight-row ${row.activeLine ? 'cell-highlight-text' : ''}`}
                                    >
                                        <Table.Td className={row.seconder ? 'seconder-item' : ''}>
                                            {row.label}
                                        </Table.Td>
                                        <Table.Td>
                                            {!row.disabledView &&
                                                (row.percent != null ? (
                                                    <NumberInput
                                                        size="xs"
                                                        radius="md"
                                                        variant="filled"
                                                        style={{ width: 120 }}
                                                        value={row.percent ?? 0}
                                                        onChange={(val) =>
                                                            handleChange(index, 'percent', val)
                                                        }
                                                        onKeyDown={(e) =>
                                                            e.key === 'Enter' && e.preventDefault()
                                                        }
                                                        rightSection={
                                                            <span
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: '#555',
                                                                }}
                                                            >
                                                                {row.symbol}
                                                            </span>
                                                        }
                                                        disabled={row.disabledInput}
                                                    />
                                                ) : row.value != null ? (
                                                    <NumberInput
                                                        size="xs"
                                                        radius="md"
                                                        variant="filled"
                                                        style={{ width: 120 }}
                                                        value={row.value ?? 0}
                                                        onChange={(val) =>
                                                            handleChange(index, 'value', val)
                                                        }
                                                        onKeyDown={(e) =>
                                                            e.key === 'Enter' && e.preventDefault()
                                                        }
                                                        rightSection={
                                                            <span
                                                                style={{
                                                                    fontSize: 14,
                                                                    color: '#555',
                                                                }}
                                                            >
                                                                {row.symbol}
                                                            </span>
                                                        }
                                                        disabled={row.disabledInput}
                                                    />
                                                ) : null)}
                                        </Table.Td>

                                        <Table.Td>
                                            {!row.disabledView && (
                                                <span>
                                                    {row.value != null && row.value !== 0
                                                        ? row.value
                                                        : ''}
                                                </span>
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
                    <Button type="button" onClick={handleSaveClick} loading={loading}>
                        Сохранить
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default CreateUnitEconomicModal;
