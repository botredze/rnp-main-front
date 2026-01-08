import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    Stack,
    Group,
    Text,
    Image,
    NumberInput,
    Select,
    MultiSelect,
    Button,
    Badge,
    Card,
    Table,
    Divider,
    Alert,
    LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { getProductCostPrice, addProductCostPrice } from '../../../store/reducers/costPriceSlice';
import './style.scss';

const ProductCostModal = ({ opened, onClose, product, forWholeProduct, selectedSize }) => {
    const dispatch = useDispatch();
    const { costPrices, stats, loading } = useSelector((state) => state.costPrice);

    const [costPrice, setCostPrice] = useState('');
    const [fulfillment, setFulfillment] = useState('');
    const [date, setDate] = useState(new Date());
    const [operationType, setOperationType] = useState('ONE_TIME');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        if (selectedSize && !forWholeProduct) {
            setSelectedSizes([selectedSize]);
        } else {
            setSelectedSizes([]);
        }
    }, [selectedSize, forWholeProduct, opened]);

    useEffect(() => {
        if (product?.id && opened) {
            dispatch(getProductCostPrice({ productId: product.id, includeHistory: true }));
        }
    }, [product, opened, dispatch]);

    useEffect(() => {
        if (product?.sizes && !forWholeProduct) {
            const sizes = Array.isArray(product.sizes)
                ? product.sizes.map((s) =>
                      typeof s === 'string' ? s : s.name || s.wbSize || s.size
                  )
                : [];
            setAvailableSizes(sizes);
        }
    }, [product, forWholeProduct]);

    const handleClose = () => {
        setCostPrice('');
        setFulfillment('');
        setDate(new Date());
        setOperationType('ONE_TIME');
        setSelectedSizes([]);
        onClose();
    };

    const handleSubmit = async () => {
        if (!costPrice || !fulfillment) {
            notifications.show({
                title: 'Ошибка',
                message: 'Заполните все обязательные поля',
                color: 'red',
                icon: <IconAlertCircle />,
            });
            return;
        }

        if (!forWholeProduct && selectedSizes.length === 0) {
            notifications.show({
                title: 'Ошибка',
                message: 'Выберите хотя бы один размер',
                color: 'red',
                icon: <IconAlertCircle />,
            });
            return;
        }

        try {
            const payload = {
                productId: product.id,
                costPrice: Number(costPrice),
                fulfillment: Number(fulfillment),
                date: date.toISOString().split('T')[0],
                operationType,
            };

            if (forWholeProduct) {
                payload.forWholeProduct = true;
            } else {
                payload.sizes = selectedSizes;
            }

            await dispatch(addProductCostPrice(payload)).unwrap();

            notifications.show({
                title: 'Успешно',
                message: forWholeProduct
                    ? 'Себестоимость добавлена для продукта'
                    : `Себестоимость добавлена для ${selectedSizes.length} размеров`,
                color: 'green',
                icon: <IconCheck />,
            });

            dispatch(getProductCostPrice({ productId: product.id, includeHistory: true }));

            handleClose();
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: error.message || 'Не удалось добавить себестоимость',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };

    const formatNumber = (value) => {
        if (!value || isNaN(value)) return '0';
        return Math.round(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    if (!product) return null;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Group>
                    <Text fw={500} size="lg">
                        {forWholeProduct ? 'Себестоимость продукта' : 'Себестоимость по размерам'}
                    </Text>
                </Group>
            }
            size="xl"
            centered
        >
            <LoadingOverlay visible={loading} />

            <Stack gap="md">
                <Card withBorder>
                    <Group>
                        <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                            <Image
                                src={product.photos?.[0]?.tm || product.photos?.[0]?.big}
                                alt={product.vendorCode}
                                w={130}
                                h={130}
                                fit="contain"
                                radius="sm"
                                fallbackSrc="https://via.placeholder.com/50?text=No+Image"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Text fw={500} size="lg">
                                {product.vendorCode}
                            </Text>
                            <Text size="sm" c="dimmed" lineClamp={2}>
                                {product.title}
                            </Text>
                            <Group gap="xs" mt="xs">
                                <Badge variant="light">{product.brand}</Badge>
                                {!forWholeProduct && (
                                    <Badge variant="light" color="blue">
                                        {availableSizes.length} размеров
                                    </Badge>
                                )}
                            </Group>
                        </div>
                    </Group>
                </Card>

                {costPrices && (
                    <>
                        {forWholeProduct && costPrices.productLevel && (
                            <Card withBorder>
                                <Group justify="space-between" mb="sm">
                                    <Text fw={500}>Текущая себестоимость</Text>
                                    <Badge color="green" variant="light">
                                        Активна
                                    </Badge>
                                </Group>
                                <Group grow>
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Себестоимость
                                        </Text>
                                        <Text size="lg" fw={700}>
                                            {formatNumber(costPrices.productLevel.costPrice)} ₽
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Фулфилмент
                                        </Text>
                                        <Text size="lg" fw={700}>
                                            {formatNumber(costPrices.productLevel.fulfillment)} ₽
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Дата
                                        </Text>
                                        <Text fw={500}>
                                            {new Date(
                                                costPrices.productLevel.date
                                            ).toLocaleDateString('ru-RU')}
                                        </Text>
                                    </div>
                                </Group>
                            </Card>
                        )}

                        {!forWholeProduct && costPrices.bySize && costPrices.bySize.length > 0 && (
                            <Card withBorder>
                                <Text fw={500} mb="sm">
                                    Текущие цены по размерам
                                </Text>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Размер</Table.Th>
                                            <Table.Th>Себестоимость</Table.Th>
                                            <Table.Th>Фулфилмент</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {costPrices.bySize.slice(0, 5).map((item) => (
                                            <Table.Tr key={item.id}>
                                                <Table.Td>
                                                    <Badge variant="light" size="sm">
                                                        {item.size}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    {formatNumber(item.costPrice)} ₽
                                                </Table.Td>
                                                <Table.Td>
                                                    {formatNumber(item.fulfillment)} ₽
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                {costPrices.bySize.length > 5 && (
                                    <Text size="xs" c="dimmed" mt="xs" ta="center">
                                        И еще {costPrices.bySize.length - 5} размеров...
                                    </Text>
                                )}
                            </Card>
                        )}
                    </>
                )}

                <Divider label="Новая себестоимость" labelPosition="center" />

                {/* Форма добавления */}
                {!forWholeProduct && (
                    <MultiSelect
                        label="Выберите размеры"
                        placeholder="Выберите один или несколько размеров"
                        data={availableSizes.map((size) => ({
                            value: size,
                            label: size,
                        }))}
                        value={selectedSizes}
                        onChange={setSelectedSizes}
                        searchable
                        clearable
                        required
                    />
                )}

                {selectedSizes.length > 0 && !forWholeProduct && (
                    <Alert icon={<IconInfoCircle />} color="blue">
                        Выбрано {selectedSizes.length} размеров: {selectedSizes.join(', ')}
                    </Alert>
                )}

                <Group grow>
                    <NumberInput
                        label="Себестоимость"
                        placeholder="0"
                        value={costPrice}
                        onChange={setCostPrice}
                        min={0}
                        decimalScale={2}
                        thousandSeparator=" "
                        suffix=" ₽"
                        required
                    />

                    <NumberInput
                        label="Фулфилмент"
                        placeholder="0"
                        value={fulfillment}
                        onChange={setFulfillment}
                        min={0}
                        decimalScale={2}
                        thousandSeparator=" "
                        suffix=" ₽"
                        required
                    />
                </Group>

                <Group grow>
                    <DateInput
                        label="Дата применения"
                        placeholder="Выберите дату"
                        value={date}
                        onChange={setDate}
                        valueFormat="DD.MM.YYYY"
                        required
                    />

                    <Select
                        label="Тип операции"
                        data={[
                            { value: 'ONE_TIME', label: 'Разовая' },
                            { value: 'PLANNED', label: 'Плановая' },
                        ]}
                        value={operationType}
                        onChange={setOperationType}
                    />
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!forWholeProduct && selectedSizes.length === 0}
                    >
                        Сохранить
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default ProductCostModal;
