import React, { useState } from 'react';
import { Tabs, Modal, Button, FileInput, Select, Paper, Text, Group, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconUpload, IconBook } from '@tabler/icons-react';
import 'dayjs/locale/ru';

import Dashboard from '../../components/FinanceReports/dashboard/Dashboard.jsx';
import SummaryReport from '../../components/FinanceReports/report/SummaryReport.jsx';
import ProfitLossReport from '../../components/FinanceReports/pnl/ProfitLossReport.jsx';
import DetailedReport from '../../components/FinanceReports/details/DetailedReport.jsx';

const FinanceReportPage = () => {
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dateRange, setDateRange] = useState('aug-2025');
    const [customRange, setCustomRange] = useState([null, null]);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Данные для метрик (Dashboard)
    const metricsData = [
        {
            title: 'Чистая прибыль',
            value: '-3 658 сом',
            subtitle: 'Маржа: -2.5%',
            change: '-112.3%',
            isNegative: true,
        },
        {
            title: 'Выручка',
            value: '145 805 сом',
            subtitle: '61 продаж',
            badge: '4 возвр.',
            change: '-13%',
            isNegative: true,
        },
        {
            title: 'Продано на WB',
            value: '114 997 сом',
            subtitle: 'По розничной цене',
            change: '-11.7%',
            isNegative: true,
        },
        {
            title: 'Удержания WB',
            value: '126 171 сом',
            subtitle: 'Все расходы на площадке',
            change: '+16.4%',
            isNegative: true,
        },
        {
            title: 'Комиссия WB',
            value: '37 788 сом',
            subtitle: '25.9% от выручки',
            change: '-13%',
            isNegative: false,
        },
        {
            title: 'Логистика',
            value: '25 769 сом',
            subtitle: '17.7% от выручки',
            badge: '195 доставок',
            change: '-26%',
            isNegative: false,
        },
        {
            title: 'Прочие расходы',
            value: '62 613 сом',
            subtitle: 'Штрафы, хранение, реклама',
            change: '+107.8%',
            isNegative: true,
        },
        {
            title: 'Бизнес-расходы',
            value: '0 сом',
            subtitle: 'Внесённые вручную',
            change: null,
            isNegative: false,
        },
        {
            title: 'Себестоимость',
            value: '22 900 сом',
            subtitle: '15.7% от выручки',
            change: '-20.2%',
            isNegative: false,
        },
        {
            title: 'Налог',
            value: '393 сом',
            subtitle: '2%',
            change: '-67.1%',
            isNegative: false,
        },
        {
            title: 'Маржинальность',
            value: '-2.5%',
            subtitle: 'Чистая прибыль / Выручка',
            change: '-114.1%',
            isNegative: true,
        },
        {
            title: 'Рентабельность',
            value: '-16.0%',
            subtitle: 'ROI (прибыль / затраты)',
            change: '-115.4%',
            isNegative: true,
        },
        {
            title: 'Капитализация склада',
            value: '2 902 589 сом',
            subtitle: '6 894 шт на складе',
            change: null,
            isNegative: false,
        },
        {
            title: 'Потенциал прибыли',
            value: '-463 704 сом',
            subtitle: 'Капитализация × ROI',
            change: '-115.4%',
            isNegative: true,
        },
    ];

    // Данные для таблиц (SummaryReport)
    const tableData = {
        months: [
            { label: 'август', startDate: '1-авг.-2025', endDate: '3-авг.-2025' },
            { label: 'август', startDate: '4-авг.-2025', endDate: '10-авг.-2025' },
            { label: 'август', startDate: '11-авг.-2025', endDate: '17-авг.-2025' },
            { label: 'август', startDate: '18-авг.-2025', endDate: '24-авг.-2025' },
            { label: 'август', startDate: '25-авг.-2025', endDate: '31-авг.-2025' },
            { label: 'сентябрь', startDate: '1-сент.-2025', endDate: '7-сент.-2025' },
        ],
        salesData: [
            { sales: 0, returns: 0, deliveries: 0, returnQty: 0 },
            { sales: 2265, returns: 9, deliveries: 2610, returnQty: 348 },
            { sales: 2001, returns: 7, deliveries: 2377, returnQty: 376 },
            { sales: 1727, returns: 6, deliveries: 2044, returnQty: 322 },
            { sales: 1634, returns: 12, deliveries: 1996, returnQty: 374 },
            { sales: 0, returns: 0, deliveries: 0, returnQty: 0 },
        ],
        avgData: [
            { price: 0, commission: 0, transfer: 0, delivery: 0, cost: 0, margin: 0 },
            { price: 1101, commission: -22, transfer: 1123, delivery: 86, cost: 572, margin: 465 },
            { price: 1089, commission: -6, transfer: 1095, delivery: 85, cost: 565, margin: 444 },
            { price: 1157, commission: 8, transfer: 1150, delivery: 82, cost: 569, margin: 499 },
            { price: 1198, commission: 35, transfer: 1163, delivery: 79, cost: 539, margin: 546 },
            { price: 0, commission: 0, transfer: 0, delivery: 0, cost: 0, margin: 0 },
        ],
        financeData: [
            {
                revenue: 0,
                commission: 0,
                commissionPct: '-',
                transfer: 0,
                deliveryCost: 0,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 0,
                cost: 0,
                profit: 0,
            },
            {
                revenue: 2483408,
                commission: -50649,
                commissionPct: '-2.0%',
                transfer: 2534057,
                deliveryCost: 253334,
                fines: 66,
                acceptance: 0,
                deductions: 0,
                storage: 28091,
                totalPay: 2253909,
                cost: 1291130,
                profit: 962779,
            },
            {
                revenue: 2170692,
                commission: -12641,
                commissionPct: '-0.6%',
                transfer: 2183332,
                deliveryCost: 235078,
                fines: 1275,
                acceptance: 0,
                deductions: 0,
                storage: 26934,
                totalPay: 1922757,
                cost: 1127350,
                profit: 795407,
            },
            {
                revenue: 1991499,
                commission: 12943,
                commissionPct: '0.6%',
                transfer: 1978556,
                deliveryCost: 192994,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 27891,
                totalPay: 1757670,
                cost: 979230,
                profit: 778440,
            },
            {
                revenue: 1943244,
                commission: 56165,
                commissionPct: '2.9%',
                transfer: 1887079,
                deliveryCost: 186652,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 1700427,
                cost: 874170,
                profit: 826257,
            },
            {
                revenue: 0,
                commission: 0,
                commissionPct: '-',
                transfer: 0,
                deliveryCost: 0,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 0,
                cost: 0,
                profit: 0,
            },
        ],
        corrections: [
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: 1343,
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: 2711,
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
        ],
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            console.log('Uploading file:', selectedFile);
            // Здесь будет логика загрузки файла
            setModalOpened(false);
            setSelectedFile(null);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
            {/* Шапка страницы */}
            <Paper shadow="xs" p="lg" radius="md" mb="xl">
                <Group justify="space-between" align="center" wrap="wrap" gap="md">
                    <Text size="xl" fw={700}>
                        Финансовая отчетность
                    </Text>

                    <Group gap="sm" wrap="wrap">
                        <Select
                            value={dateRange}
                            onChange={setDateRange}
                            data={[
                                { value: 'aug-2025', label: 'Август 2025' },
                                { value: 'sep-2025', label: 'Сентябрь 2025' },
                                { value: 'oct-2025', label: 'Октябрь 2025' },
                            ]}
                            style={{ width: 180 }}
                        />

                        <DatePickerInput
                            type="range"
                            placeholder="Выберите период"
                            value={customRange}
                            onChange={setCustomRange}
                            locale="ru"
                            style={{ width: 250 }}
                        />

                        <Button variant="default" leftSection={<IconBook size={16} />}>
                            Инструкции
                        </Button>

                        <Button
                            leftSection={<IconUpload size={16} />}
                            onClick={() => setModalOpened(true)}
                        >
                            Загрузить отчет
                        </Button>
                    </Group>
                </Group>
            </Paper>

            {/* Табы */}
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="dashboard">Дашборд</Tabs.Tab>
                    <Tabs.Tab value="summary">Сводный отчет</Tabs.Tab>
                    <Tabs.Tab value="profit-loss">ОПиУ</Tabs.Tab>
                    <Tabs.Tab value="detailed">Детализация</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="dashboard" pt="xl">
                    <Dashboard metrics={metricsData} />
                </Tabs.Panel>

                <Tabs.Panel value="summary" pt="xl">
                    <SummaryReport tableData={tableData} />
                </Tabs.Panel>

                <Tabs.Panel value="profit-loss" pt="xl">
                    <ProfitLossReport />
                </Tabs.Panel>

                <Tabs.Panel value="detailed" pt="xl">
                    <DetailedReport />
                </Tabs.Panel>
            </Tabs>

            {/* Модальное окно загрузки файла */}
            <Modal
                opened={modalOpened}
                onClose={() => {
                    setModalOpened(false);
                    setSelectedFile(null);
                }}
                title="Загрузить отчет Excel"
                centered
            >
                <Stack gap="md">
                    <FileInput
                        placeholder="Выберите файл"
                        accept=".xlsx,.xls"
                        value={selectedFile}
                        onChange={setSelectedFile}
                        leftSection={<IconUpload size={16} />}
                    />

                    {selectedFile && (
                        <Text size="sm" c="dimmed">
                            Выбран файл: {selectedFile.name}
                        </Text>
                    )}

                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="default"
                            onClick={() => {
                                setModalOpened(false);
                                setSelectedFile(null);
                            }}
                        >
                            Отмена
                        </Button>

                        <Button onClick={handleFileUpload} disabled={!selectedFile}>
                            Загрузить
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default FinanceReportPage;
