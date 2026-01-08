import React from 'react';
import { Table, Paper, Text, Stack, ScrollArea } from '@mantine/core';
import 'dayjs/locale/ru';
import './style.scss';

const SummaryReport = ({ tableData }) => {
    if (!tableData || !tableData.months) {
        return (
            <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Нет данных для отображения</Text>
            </Paper>
        );
    }

    return (
        <Stack gap="xl">
            {/* Таблица продаж - С ДАТАМИ */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Продажи и доставки
                </Text>
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="summary-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="first-column" rowSpan={3}>
                                    Показатель
                                </Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.label}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.startDate}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.endDate}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Количество продаж
                                </Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.sales || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Количество возвратов
                                </Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.returns || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Количество доставок
                                </Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.deliveries || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Количество возврата
                                </Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.returnQty || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>

            {/* Таблица средних показателей - БЕЗ ДАТ */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Средние показатели
                </Text>
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="summary-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="first-column">Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.label}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Средняя цена
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.price || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Средняя комиссия
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        className="month-column"
                                        ta="right"
                                        c={data.commission < 0 ? 'red' : undefined}
                                    >
                                        {data.commission || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Среднее к перечислению
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.transfer || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Средний расход на доставку
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.delivery || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Средняя себестоимость
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.cost || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Средняя маржа
                                </Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.margin || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>

            {/* Финансовая таблица - БЕЗ ДАТ */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Финансовые показатели
                </Text>
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="summary-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="first-column">Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.label}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr className="highlight-row">
                                <Table.Td className="first-column" fw={700}>
                                    Выручка
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        className="month-column"
                                        ta="right"
                                        fw={600}
                                    >
                                        {data.revenue.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Комиссия ВБ
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        className="month-column"
                                        ta="right"
                                        c={data.commission < 0 ? 'red' : undefined}
                                    >
                                        {data.commission.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Комиссия %
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.commissionPct}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    К перечислению
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.transfer.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Расходы на доставку
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.deliveryCost.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Штрафы
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.fines.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Приемка
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.acceptance}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Удержания
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.deductions}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Хранение
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.storage.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr className="highlight-row">
                                <Table.Td className="first-column" fw={700}>
                                    Итого к оплате
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        className="month-column"
                                        ta="right"
                                        fw={600}
                                    >
                                        {data.totalPay.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Себестоимость
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right" c="red">
                                        {data.cost.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr className="highlight-row">
                                <Table.Td className="first-column" fw={700}>
                                    Чистая прибыль
                                </Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        className="month-column"
                                        ta="right"
                                        fw={600}
                                        c={data.profit < 0 ? 'red' : 'green'}
                                    >
                                        {data.profit.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>

            {/* Таблица корректировок - БЕЗ ДАТ */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Корректировки
                </Text>
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="summary-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="first-column">Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx} className="month-column">
                                        {month.label}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Корректировка эквайринга
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.acquiring || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Компенсация подмененного товара
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.replacedGoods || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Компенсация потерянного товара
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.lostGoods || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Компенсация брака
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.defect || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Коррекция продаж
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.salesCorrection || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Коррекция логистика
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.logisticsCorrection || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td className="first-column" fw={600}>
                                    Авансовая оплата за товар без движения
                                </Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx} className="month-column" ta="right">
                                        {data.advancePayment || '-'}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Stack>
    );
};

export default SummaryReport;
