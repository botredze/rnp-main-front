import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Text,
    Stack,
    Group,
    Table,
    ScrollArea,
    TextInput,
    Select,
    Badge,
    Pagination,
    Card,
    LoadingOverlay,
    Grid,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch } from '@tabler/icons-react';
import {
    getDetailedReport,
    getDetailedReportFilterOptions,
} from '../../../store/reducers/reportsSlice';
import 'dayjs/locale/ru';
import './style.scss';

const DetailedReport = () => {
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);
    const { detailedReportData, detailedReportLoading, filterOptions } = useSelector(
        (state) => state.reports
    );

    // Состояния фильтров
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 50;

    // Загружаем опции фильтров при монтировании
    useEffect(() => {
        if (organization?.id) {
            dispatch(getDetailedReportFilterOptions(organization.id));
        }
    }, [organization, dispatch]);

    // Загружаем данные при изменении фильтров
    useEffect(() => {
        if (organization?.id) {
            loadData();
        }
    }, [
        organization,
        searchQuery,
        selectedSize,
        selectedOperation,
        selectedWarehouse,
        dateRange,
        activePage,
    ]);

    const loadData = () => {
        if (!organization?.id) return;

        const params = {
            organizationId: organization.id,
            page: activePage,
            limit: itemsPerPage,
        };

        if (searchQuery) params.searchQuery = searchQuery;
        if (selectedSize) params.size = selectedSize;
        if (selectedOperation) params.documentType = selectedOperation;
        if (selectedWarehouse) params.warehouse = selectedWarehouse;
        if (dateRange[0]) params.startDate = dateRange[0].toISOString().split('T')[0];
        if (dateRange[1]) params.endDate = dateRange[1].toISOString().split('T')[0];

        dispatch(getDetailedReport(params));
    };

    const formatNumber = (value) => {
        if (!value || isNaN(value)) return '0';
        return Math.round(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const formatPercent = (value) => {
        if (!value || isNaN(value)) return '0.0%';
        return `${Number(value).toFixed(1)}%`;
    };

    const data = detailedReportData?.data || [];
    const summary = detailedReportData?.summary || {};
    const total = detailedReportData?.total || 0;
    const totalPages = detailedReportData?.totalPages || 0;

    return (
        <Stack gap="md">
            <LoadingOverlay visible={detailedReportLoading} />

            {summary.totalSales > 0 && (
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                Продажи
                            </Text>
                            <Text size="xl" fw={700} mt="xs">
                                {summary.totalSales}
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                Возвраты
                            </Text>
                            <Text size="xl" fw={700} mt="xs" c="red">
                                {summary.totalReturns}
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                Выручка
                            </Text>
                            <Text size="xl" fw={700} mt="xs">
                                {formatNumber(summary.totalRevenue)} ₽
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                Комиссия WB
                            </Text>
                            <Text size="xl" fw={700} mt="xs" c="orange">
                                {formatNumber(summary.totalCommission)} ₽
                            </Text>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                К выплате
                            </Text>
                            <Text size="xl" fw={700} mt="xs" c="green">
                                {formatNumber(summary.totalPayout)} ₽
                            </Text>
                        </Card>
                    </Grid.Col>
                </Grid>
            )}

            {/* Фильтры */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                    <Group gap="sm" wrap="wrap">
                        <TextInput
                            placeholder="Поиск по баркоду, артикулу..."
                            leftSection={<IconSearch size={16} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ flex: 1, maxWidth: 300 }}
                        />

                        <Select
                            placeholder="Размер"
                            value={selectedSize}
                            onChange={setSelectedSize}
                            data={filterOptions.sizes?.map((size) => ({
                                value: size,
                                label: size,
                            }))}
                            clearable
                            searchable
                            style={{ width: 120 }}
                        />

                        <Select
                            placeholder="Тип операции"
                            value={selectedOperation}
                            onChange={setSelectedOperation}
                            data={[
                                { value: 'Продажа', label: 'Продажа' },
                                { value: 'Возврат', label: 'Возврат' },
                            ]}
                            clearable
                            style={{ width: 150 }}
                        />

                        <Select
                            placeholder="Склад"
                            value={selectedWarehouse}
                            onChange={setSelectedWarehouse}
                            data={filterOptions.warehouses?.map((wh) => ({
                                value: wh,
                                label: wh,
                            }))}
                            clearable
                            searchable
                            style={{ width: 150 }}
                        />

                        <DatePickerInput
                            type="range"
                            placeholder="Период"
                            value={dateRange}
                            onChange={setDateRange}
                            locale="ru"
                            style={{ width: 250 }}
                            clearable
                        />
                    </Group>

                    <Group justify="space-between">
                        <Badge size="lg" variant="light">
                            Найдено записей: {total}
                        </Badge>
                        <Text size="sm" c="dimmed">
                            Страница {activePage} из {totalPages}
                        </Text>
                    </Group>
                </Stack>
            </Card>

            {/* Таблица */}
            <Paper withBorder radius="md" className="detailed-table-container">
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="detailed-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="sticky-column">Операция</Table.Th>
                                <Table.Th>Артикул</Table.Th>
                                <Table.Th>Название</Table.Th>
                                <Table.Th>Размер</Table.Th>
                                <Table.Th>Баркод</Table.Th>
                                <Table.Th>Дата заказа</Table.Th>
                                <Table.Th>Дата продажи</Table.Th>
                                <Table.Th ta="right">Кол-во</Table.Th>
                                <Table.Th ta="right">Сумма продажи</Table.Th>
                                <Table.Th ta="right">Цена со скидкой</Table.Th>
                                <Table.Th ta="right">СПП скидка %</Table.Th>
                                <Table.Th ta="right">кВВ %</Table.Th>
                                <Table.Th ta="right">Комиссия WB</Table.Th>
                                <Table.Th ta="right">К выплате</Table.Th>
                                <Table.Th>Склад</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td className="sticky-column">
                                            <Badge
                                                color={
                                                    item.documentType === 'Продажа'
                                                        ? 'green'
                                                        : 'red'
                                                }
                                                variant="light"
                                            >
                                                {item.documentType}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={500}>
                                                {item.vendorCode}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
                                                {item.productTitle}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="outline" size="sm">
                                                {item.size}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed">
                                                {item.barcode}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{item.orderDate}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{item.saleDate}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text
                                                size="sm"
                                                fw={500}
                                                c={item.quantity < 0 ? 'red' : undefined}
                                            >
                                                {item.quantity}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text
                                                size="sm"
                                                fw={500}
                                                c={item.saleAmount < 0 ? 'red' : undefined}
                                            >
                                                {formatNumber(item.saleAmount)} ₽
                                            </Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">
                                                {formatNumber(item.priceWithDiscount)} ₽
                                            </Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatPercent(item.sppDiscount)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm">{formatPercent(item.kvvPercent)}</Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm" c="orange">
                                                {formatNumber(item.commission)} ₽
                                            </Text>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <Text size="sm" fw={500} c="green">
                                                {formatNumber(item.sellerPayout)} ₽
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{item.warehouse}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={15}>
                                        <Text ta="center" c="dimmed" py="xl">
                                            {detailedReportLoading
                                                ? 'Загрузка...'
                                                : 'Нет данных для отображения'}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                {totalPages > 1 && (
                    <Group justify="center" p="md">
                        <Pagination
                            value={activePage}
                            onChange={setActivePage}
                            total={totalPages}
                        />
                    </Group>
                )}
            </Paper>
        </Stack>
    );
};

export default DetailedReport;
