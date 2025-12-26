import React, { useState } from 'react';
import { Table, Paper, Text, Stack } from '@mantine/core';
import 'dayjs/locale/ru';

const SummaryReport = ({ tableData }) => {
    return (
        <Stack gap="xl">
            {/* Таблица продаж */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Продажи и доставки
                </Text>
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Месяц</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.label}</Table.Th>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Начало недели</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.startDate}</Table.Th>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Конец недели</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.endDate}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td fw={600}>Количество продаж</Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.sales || 0}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Количество возвратов</Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.returns || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Количество доставок</Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.deliveries || 0}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Количество возврата</Table.Td>
                                {tableData.salesData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.returnQty || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>

            {/* Таблица средних показателей */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Средние показатели
                </Text>
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.label}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td fw={600}>Средняя цена</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.price || 0}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Средняя комиссия</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} c={data.commission < 0 ? 'red' : undefined}>
                                        {data.commission || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Среднее к перечислению</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.transfer || 0}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Средний расход на доставку</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.delivery || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Средняя себестоимость</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.cost || 0}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Средняя маржа</Table.Td>
                                {tableData.avgData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.margin || 0}</Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>

            {/* Финансовая таблица */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Финансовые показатели
                </Text>
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.label}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                                <Table.Td fw={700}>Выручка</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} fw={600}>
                                        {data.revenue.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Комиссия ВБ</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} c={data.commission < 0 ? 'red' : undefined}>
                                        {data.commission.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Комиссия %</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.commissionPct}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>К перечислению</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.transfer.toLocaleString()}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Расходы на доставку</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.deliveryCost.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Штрафы</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.fines.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Приемка</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.acceptance}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Удержания</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx}>{data.deductions}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Хранение</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.storage.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                                <Table.Td fw={700}>Итого к оплате</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} fw={600}>
                                        {data.totalPay.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Себестоимость</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td key={idx} c="red">
                                        {data.cost.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                                <Table.Td fw={700}>Чистая прибыль</Table.Td>
                                {tableData.financeData.map((data, idx) => (
                                    <Table.Td
                                        key={idx}
                                        fw={600}
                                        c={data.profit < 0 ? 'red' : 'green'}
                                    >
                                        {data.profit.toLocaleString()}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>

            {/* Таблица корректировок */}
            <Paper withBorder p="md" radius="md">
                <Text size="lg" fw={600} mb="md">
                    Корректировки
                </Text>
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Показатель</Table.Th>
                                {tableData.months.map((month, idx) => (
                                    <Table.Th key={idx}>{month.label}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td fw={600}>Корректировка эквайринга</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.acquiring || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Компенсация подмененного товара</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.replacedGoods || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Компенсация потерянного товара</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.lostGoods || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Компенсация брака</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.defect || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Коррекция продаж</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.salesCorrection || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Коррекция логистика</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.logisticsCorrection || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td fw={600}>Авансовая оплата за товар без движения</Table.Td>
                                {tableData.corrections.map((data, idx) => (
                                    <Table.Td key={idx}>{data.advancePayment || '-'}</Table.Td>
                                ))}
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>
        </Stack>
    );
};

export default SummaryReport;
