import { Modal, Group, Button, TextInput, NumberInput, Table } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from '@mantine/form';
import './style.scss';
import { openCloseDetails } from '../../../store/reducers/unitEconomicSlice.js';

const CreateUnitEconomicModal = () => {
    const dispatch = useDispatch();
    const { openDetailsState } = useSelector((state) => state.unitEconomic);

    const form = useForm({
        initialValues: {
            productName: '',
            vendorCode: '',
            price: '',
            salePrice: '',
            ssp: 38.2,
            priceWithSsp: 3708,
            wbDiscount: 7,
            priceWithWb: 3444.44,
            tableData: [
                { label: 'Цена на WB наша', percent: null, value: 6000, percentOfPrice: 100 },
                { label: 'Скидка для WB клуб', percent: 0, value: null, percentOfPrice: null },
                { label: 'Цена для WB клуба', percent: null, value: '5000', percentOfPrice: null },
                {
                    label: 'Итого коммиссия WB, руб',
                    percent: null,
                    value: '1825',
                    percentOfPrice: 36.5,
                },
                { label: 'Комиссия WB', percent: 34.5, value: '1725', percentOfPrice: null },
                { label: 'Доп.комиссия', percent: 2, value: '120', percentOfPrice: null },
                { label: 'Эквайринг', percent: 1.5, value: '90', percentOfPrice: 1.5 },
                { label: 'Процент выкупа', percent: 42, value: null, percentOfPrice: null },
                { label: 'Логистика', percent: null, value: '931.67', percentOfPrice: 18.6 },
                { label: ' - Доставка заказа', percent: null, value: 365, percentOfPrice: null },
                { label: ' - Возврат заказа', percent: null, value: 50, percentOfPrice: null },
                {
                    label: ' - Доставка на продажу',
                    percent: null,
                    value: '867.62',
                    percentOfPrice: null,
                },
                {
                    label: ' - Возврат на продажу',
                    percent: null,
                    value: '69.05',
                    percentOfPrice: null,
                },
                { label: ' - Платная приемка', percent: null, value: 15, percentOfPrice: null },
                { label: 'Реклама', percent: 10, value: '600', percentOfPrice: 10 },
                { label: 'Хранение', percent: 3, value: '180', percentOfPrice: 3 },
                {
                    label: 'Итого коммиссия WB',
                    percent: null,
                    value: '3481.57',
                    percentOfPrice: 69.6,
                },
                {
                    label: 'К перечислению на р/с',
                    percent: null,
                    value: '1518.33',
                    percentOfPrice: 31,
                },
                { label: 'Налог', percent: 6, value: '172.42', percentOfPrice: 3.4 },
                { label: 'Себестоимость итого', percent: null, value: '1050', percentOfPrice: 21 },
                { label: '— Закупка товара', percent: null, value: 1000, percentOfPrice: null },
                { label: ' — Доп. расходы', percent: null, value: 10, percentOfPrice: null },
                { label: ' — Доставка до WB', percent: null, value: 40, percentOfPrice: null },
                { label: 'Прибыль', percent: null, value: 0, percentOfPrice: null },
            ],
        },
    });

    const save = (values) => {
        close();
    };

    const close = () => {
        dispatch(openCloseDetails(false));
    };

    return (
        <Modal
            opened={openDetailsState}
            onClose={close}
            title="Создание товара"
            size="50%"
            overlayBlur={3}
        >
            <form onSubmit={form.onSubmit(save)}>
                <div className="container">
                    <div>Основные данные</div>
                    <div className="mainContent">
                        <TextInput
                            radius="md"
                            variant="filled"
                            label="Наименование товара"
                            withAsterisk
                            placeholder="Введите название"
                            style={{ width: 300 }}
                            {...form.getInputProps('productName')}
                        />
                        <TextInput
                            radius="md"
                            variant="filled"
                            label="Артикул на ВБ"
                            withAsterisk
                            placeholder="Введите артикул"
                            style={{ width: 250 }}
                            {...form.getInputProps('vendorCode')}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Себестоимость"
                            withAsterisk
                            placeholder="Введите цену"
                            {...form.getInputProps('price')}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Цена продажи"
                            withAsterisk
                            placeholder="Введите цену"
                            {...form.getInputProps('salePrice')}
                        />
                    </div>

                    <div className="secondContent">
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="СПП"
                            {...form.getInputProps('ssp')}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Цена c СПП"
                            {...form.getInputProps('priceWithSsp')}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Скидка на WB кошелек"
                            {...form.getInputProps('wbDiscount')}
                        />
                        <NumberInput
                            radius="md"
                            variant="filled"
                            label="Цена с WB кошельком"
                            {...form.getInputProps('priceWithWb')}
                        />
                    </div>

                    <div className="main-table">
                        <Table withRowBorders={false} className="unit-table">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: '250px' }}>Показатель</Table.Th>
                                    <Table.Th style={{ width: '90px' }}>Процент</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Значение</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Процент от цены</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {form.values.tableData.map((row, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td>{row.label}</Table.Td>

                                        <Table.Td>
                                            {typeof row.percent === 'number' ? (
                                                <NumberInput
                                                    style={{ width: 100 }}
                                                    size="xs"
                                                    radius="md"
                                                    variant="filled"
                                                    disabled={row.percent === null}
                                                    {...form.getInputProps(
                                                        `tableData.${index}.percent`
                                                    )}
                                                />
                                            ) : (
                                                <span>{row.percent ?? ''}</span>
                                            )}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.value === null ? (
                                                <></>
                                            ) : typeof row.value === 'string' ? (
                                                <span>{row.value}</span>
                                            ) : typeof row.value === 'number' ? (
                                                <NumberInput
                                                    style={{ width: 100 }}
                                                    size="xs"
                                                    radius="md"
                                                    variant="filled"
                                                    {...form.getInputProps(
                                                        `tableData.${index}.value`
                                                    )}
                                                />
                                            ) : null}
                                        </Table.Td>

                                        <Table.Td>
                                            {row.percentOfPrice !== null ? (
                                                <span>{row.percentOfPrice} %</span>
                                            ) : (
                                                ''
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
