import React, { useState } from 'react';
import {
    Paper,
    Text,
    Stack,
    Group,
    Select,
    Table,
    ScrollArea,
    ActionIcon,
    Collapse,
} from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/ru';
import './style.scss';

const ProfitLossReport = () => {
    const [dateRange, setDateRange] = useState('current-year');
    const [customRange, setCustomRange] = useState([null, null]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        directCosts: true,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Моковые данные для колонок (месяцы)
    const months = [
        { key: '2026', label: '2026' },
        { key: 'jan2026', label: 'ЯНВАРЬ 2026' },
        { key: '2025', label: '2025' },
        { key: 'dec2025', label: 'ДЕКАБРЬ 2025' },
        { key: 'nov2025', label: 'НОЯБРЬ 2025' },
        { key: 'oct2025', label: 'ОКТЯБРЬ 2025' },
        { key: 'sep2025', label: 'СЕНТЯБРЬ 2025' },
        { key: 'aug2025', label: 'АВГУСТ 2025' },
        { key: 'jul2025', label: 'ИЮЛЬ 2025' },
        { key: 'jun2025', label: 'ИЮНЬ 2025' },
        { key: 'may2025', label: 'МАЙ 2025' },
        { key: 'apr2025', label: 'АПРЕЛЬ 2025' },
        { key: 'mar2025', label: 'МАРТ 2025' },
        { key: 'feb2025', label: 'ФЕВРАЛЬ 2025' },
    ];

    // Структура данных отчета
    const reportData = [
        { label: 'Реализация', level: 0, value: 0, percent: '0.00%' },
        { label: 'Скидка за счет МП', level: 0, value: 0, percent: '0.00%' },
        { label: 'Фактические продажи', level: 0, value: 0, percent: '0.00%' },
        {
            label: 'Прямые расходы',
            level: 0,
            value: 0,
            percent: '0.00%',
            expandable: true,
            section: 'directCosts',
        },
        { label: 'Себестоимость', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Логистика', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Комиссия', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Штрафы', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Хранение', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        {
            label: 'Внутренняя реклама',
            level: 1,
            value: 0,
            percent: '0.00%',
            parent: 'directCosts',
        },
        { label: 'Прочие удержания', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Платная приемка', level: 1, value: 0, percent: '0.00%', parent: 'directCosts' },
        { label: 'Компенсация', level: 0, value: 0, percent: '0.00%' },
        { label: 'Валовая маржа', level: 0, value: 0, percent: '0.00%', highlight: true },
        { label: 'Операционные расходы', level: 0, value: 0, percent: '0.00%' },
        { label: 'Налоги (кроме зарплатных)', level: 0, value: 0, percent: '0.00%' },
        {
            label: 'Операционная прибыль (EBITDA)',
            level: 0,
            value: 0,
            percent: '0.00%',
            highlight: true,
        },
        { label: 'Чистая прибыль', level: 0, value: 0, percent: '0.00%', highlight: true },
    ];

    const renderRow = (row, monthKey) => {
        // Пропускаем вложенные строки если секция свернута
        if (row.parent && !expandedSections[row.parent]) {
            return null;
        }

        const isHighlight = row.highlight;
        const isExpandable = row.expandable;
        const isExpanded = expandedSections[row.section];

        return (
            <>
                <Table.Td>
                    <Group gap={4} wrap="nowrap">
                        {isExpandable && (
                            <ActionIcon
                                size="xs"
                                variant="subtle"
                                onClick={() => toggleSection(row.section)}
                            >
                                {isExpanded ? (
                                    <IconChevronDown size={14} />
                                ) : (
                                    <IconChevronRight size={14} />
                                )}
                            </ActionIcon>
                        )}
                        {!isExpandable && row.level > 0 && <div style={{ width: 16 }} />}
                        <Text
                            size="sm"
                            fw={row.level === 0 || isHighlight ? 600 : 400}
                            style={{ paddingLeft: row.level * 20 }}
                        >
                            {row.label}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td ta="right">
                    <Text size="sm" c={isHighlight ? 'blue' : undefined}>
                        {row.value}
                    </Text>
                </Table.Td>
                <Table.Td ta="right">
                    <Text size="sm" c="dimmed">
                        {row.percent}
                    </Text>
                </Table.Td>
            </>
        );
    };

    return (
        <Stack gap="md">
            {/* Фильтры */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
                <Group gap="sm" wrap="wrap">
                    <Select
                        placeholder="Выберите период"
                        value={dateRange}
                        onChange={setDateRange}
                        data={[
                            { value: 'current-year', label: 'Текущий год' },
                            { value: 'last-year', label: 'Прошлый год' },
                            { value: 'current-month', label: 'Текущий месяц' },
                            { value: 'last-month', label: 'Прошлый месяц' },
                            { value: 'custom', label: 'Выбрать период' },
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

                    {/*<Select*/}
                    {/*    placeholder="Бренды"*/}
                    {/*    value={selectedBrands}*/}
                    {/*    onChange={setSelectedBrands}*/}
                    {/*    data={[]}*/}
                    {/*    clearable*/}
                    {/*    searchable*/}
                    {/*    style={{ width: 150 }}*/}
                    {/*/>*/}

                    {/*<Select*/}
                    {/*    placeholder="Категории"*/}
                    {/*    value={selectedCategories}*/}
                    {/*    onChange={setSelectedCategories}*/}
                    {/*    data={[]}*/}
                    {/*    clearable*/}
                    {/*    searchable*/}
                    {/*    style={{ width: 150 }}*/}
                    {/*/>*/}

                    {/*<Select*/}
                    {/*    placeholder="Группы"*/}
                    {/*    value={selectedGroups}*/}
                    {/*    onChange={setSelectedGroups}*/}
                    {/*    data={[]}*/}
                    {/*    clearable*/}
                    {/*    searchable*/}
                    {/*    style={{ width: 150 }}*/}
                    {/*/>*/}

                    <Select
                        placeholder="Артикулы"
                        value={selectedArticles}
                        onChange={setSelectedArticles}
                        data={[]}
                        clearable
                        searchable
                        style={{ width: 150 }}
                    />

                    <Text size="sm" fw={600} style={{ marginLeft: 'auto' }}>
                        Экспорт
                    </Text>
                </Group>
            </Paper>

            {/* Таблица */}
            <Paper withBorder radius="md" className="pnl-table-container">
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        className="pnl-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="sticky-column">СТАТЬЯ</Table.Th>
                                {months.map((month) => (
                                    <Table.Th key={month.key} colSpan={2} ta="center">
                                        {month.label}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {reportData.map((row, idx) => {
                                // Пропускаем вложенные строки если секция свернута
                                if (row.parent && !expandedSections[row.parent]) {
                                    return null;
                                }

                                const isHighlight = row.highlight;

                                return (
                                    <Table.Tr
                                        key={idx}
                                        style={{
                                            backgroundColor: isHighlight
                                                ? 'var(--mantine-color-blue-0)'
                                                : undefined,
                                        }}
                                    >
                                        <Table.Td className="sticky-column">
                                            <Group gap={4} wrap="nowrap">
                                                {row.expandable && (
                                                    <ActionIcon
                                                        size="xs"
                                                        variant="subtle"
                                                        onClick={() => toggleSection(row.section)}
                                                    >
                                                        {expandedSections[row.section] ? (
                                                            <IconChevronDown size={14} />
                                                        ) : (
                                                            <IconChevronRight size={14} />
                                                        )}
                                                    </ActionIcon>
                                                )}
                                                {!row.expandable && row.level > 0 && (
                                                    <div style={{ width: 16 }} />
                                                )}
                                                <Text
                                                    size="sm"
                                                    fw={row.level === 0 || isHighlight ? 600 : 400}
                                                    style={{ paddingLeft: row.level * 20 }}
                                                >
                                                    {row.label}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        {months.map((month) => (
                                            <React.Fragment key={month.key}>
                                                <Table.Td ta="right">
                                                    <Text
                                                        size="sm"
                                                        c={isHighlight ? 'blue' : undefined}
                                                    >
                                                        {row.value}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Text size="sm" c="dimmed">
                                                        {row.percent}
                                                    </Text>
                                                </Table.Td>
                                            </React.Fragment>
                                        ))}
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Stack>
    );
};

export default ProfitLossReport;
