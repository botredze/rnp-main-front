// pages/FinanceReportPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Tabs,
    Modal,
    Button,
    FileInput,
    Select,
    Paper,
    Text,
    Group,
    Stack,
    Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconUpload, IconBook, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import 'dayjs/locale/ru';

import Dashboard from '../../components/FinanceReports/dashboard/Dashboard.jsx';
import SummaryReport from '../../components/FinanceReports/report/SummaryReport.jsx';
import ProfitLossReport from '../../components/FinanceReports/pnl/ProfitLossReport.jsx';
import DetailedReport from '../../components/FinanceReports/details/DetailedReport.jsx';

import {
    uploadDetailedReport,
    uploadWeeklyReport,
    getAvailableDates,
    getOrganizationDashboard,
    getOrganizationSummaryReport,
    clearUploadError,
} from '../../store/reducers/reportsSlice';

const FinanceReportPage = () => {
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);
    const {
        dashboardData,
        summaryReportData,
        availableDates,
        dashboardLoading,
        summaryLoading,
        uploadLoading,
        uploadError,
    } = useSelector((state) => state.reports);

    const [modalOpened, setModalOpened] = useState(false);
    const [uploadType, setUploadType] = useState('detailed'); // 'detailed' | 'weekly'
    const [selectedFile, setSelectedFile] = useState(null);
    const [dateRange, setDateRange] = useState('current-month');
    const [customRange, setCustomRange] = useState([null, null]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (organization?.id) {
            dispatch(getAvailableDates(organization.id));
        }
    }, [organization, dispatch]);

    useEffect(() => {
        if (organization?.id && dateRange) {
            loadReports();
        }
    }, [organization, dateRange, customRange]);

    const loadReports = () => {
        if (!organization?.id) return;

        const params = {
            organizationId: organization.id,
        };

        if (dateRange === 'custom' && customRange[0] && customRange[1]) {
            params.startDate = customRange[0].toISOString().split('T')[0];
            params.endDate = customRange[1].toISOString().split('T')[0];
        } else if (dateRange !== 'custom') {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();

            switch (dateRange) {
                case 'current-month':
                    params.startDate = new Date(year, month, 1).toISOString().split('T')[0];
                    params.endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
                    break;
                case 'last-month':
                    params.startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
                    params.endDate = new Date(year, month, 0).toISOString().split('T')[0];
                    break;
            }
        }

        if (activeTab === 'dashboard') {
            dispatch(getOrganizationDashboard(params));
        } else if (activeTab === 'summary') {
            dispatch(getOrganizationSummaryReport(params));
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !organization?.id) {
            notifications.show({
                title: 'Ошибка',
                message: 'Выберите файл для загрузки',
                color: 'red',
                icon: <IconAlertCircle />,
            });
            return;
        }

        try {
            const uploadAction =
                uploadType === 'detailed' ? uploadDetailedReport : uploadWeeklyReport;

            await dispatch(
                uploadAction({
                    file: selectedFile,
                    organizationId: organization.id,
                })
            ).unwrap();

            notifications.show({
                title: 'Успешно',
                message: `${uploadType === 'detailed' ? 'Детализированный' : 'Еженедельный'} отчет загружен`,
                color: 'green',
            });

            setModalOpened(false);
            setSelectedFile(null);

            // Перезагружаем данные
            loadReports();
            dispatch(getAvailableDates(organization.id));
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: error.message || 'Не удалось загрузить отчет',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };

    const openUploadModal = (type) => {
        setUploadType(type);
        setModalOpened(true);
        dispatch(clearUploadError());
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
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
                                { value: 'current-month', label: 'Текущий месяц' },
                                { value: 'last-month', label: 'Прошлый месяц' },
                                { value: 'custom', label: 'Выбрать период' },
                                ...(availableDates?.availableMonths?.map((month) => ({
                                    value: month,
                                    label: new Date(month).toLocaleDateString('ru-RU', {
                                        month: 'long',
                                        year: 'numeric',
                                    }),
                                })) || []),
                            ]}
                            style={{ width: 200 }}
                        />

                        {dateRange === 'custom' && (
                            <DatePickerInput
                                type="range"
                                placeholder="Выберите период"
                                value={customRange}
                                onChange={setCustomRange}
                                locale="ru"
                                style={{ width: 250 }}
                            />
                        )}

                        <Button variant="default" leftSection={<IconBook size={16} />}>
                            Инструкции
                        </Button>

                        <Button
                            leftSection={<IconUpload size={16} />}
                            onClick={() => openUploadModal('weekly')}
                        >
                            Загрузить еженедельный
                        </Button>

                        <Button
                            leftSection={<IconUpload size={16} />}
                            onClick={() => openUploadModal('detailed')}
                            variant="light"
                        >
                            Загрузить детальный
                        </Button>
                    </Group>
                </Group>

                {availableDates && (
                    <Text size="sm" c="dimmed" mt="sm">
                        Доступные отчеты: с {availableDates.minDate} по {availableDates.maxDate}
                    </Text>
                )}
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
                    {dashboardLoading ? (
                        <Text ta="center" py="xl">
                            Загрузка...
                        </Text>
                    ) : dashboardData ? (
                        <Dashboard metrics={dashboardData.metrics} />
                    ) : (
                        <Alert color="blue" title="Нет данных">
                            Загрузите отчеты для отображения дашборда
                        </Alert>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="summary" pt="xl">
                    {summaryLoading ? (
                        <Text ta="center" py="xl">
                            Загрузка...
                        </Text>
                    ) : summaryReportData ? (
                        <SummaryReport tableData={summaryReportData} />
                    ) : (
                        <Alert color="blue" title="Нет данных">
                            Загрузите отчеты для отображения сводной информации
                        </Alert>
                    )}
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
                    dispatch(clearUploadError());
                }}
                title={`Загрузить ${uploadType === 'detailed' ? 'детализированный' : 'еженедельный'} отчет`}
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

                    {uploadError && (
                        <Alert icon={<IconAlertCircle />} color="red">
                            {uploadError.message || 'Произошла ошибка при загрузке'}
                        </Alert>
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

                        <Button
                            onClick={handleFileUpload}
                            disabled={!selectedFile}
                            loading={uploadLoading}
                        >
                            Загрузить
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default FinanceReportPage;
