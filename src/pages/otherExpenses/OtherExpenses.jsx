import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Text,
    Group,
    Button,
    Tabs,
    Table,
    ScrollArea,
    Badge,
    ActionIcon,
    Modal,
    Stack,
    RadioGroup,
    Radio,
    NumberInput,
    Select,
    TextInput,
    Checkbox,
    Pagination,
    LoadingOverlay,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import 'dayjs/locale/ru';
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getArticles,
    createArticle,
    deleteArticle,
} from '../../store/reducers/otherExpensesSlice.js';
import './style.scss';

const toLocalDateStr = (date) => {
    if (!date) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const OPERATION_TYPE_LABELS = { one_time: 'Разовая', planned: 'Плановая' };

const defaultForm = {
    operationType: 'one_time',
    distributionMethod: 'proportional',
    distributeBy: 'shops',
    amount: '',
    expenseArticleId: null,
    description: '',
    date: null,
    frequency: null,
    startPeriod: null,
    endPeriod: null,
    isOfficial: false,
};

const OtherExpenses = () => {
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);
    const { expenses, expensesTotal, expensesTotalPages, expensesTotalAmount, articles, loading } =
        useSelector((state) => state.otherExpenses);

    const [activeTab, setActiveTab] = useState('expenses');
    const [activePage, setActivePage] = useState(1);
    const [filterDateRange, setFilterDateRange] = useState([null, null]);
    const [filterArticleId, setFilterArticleId] = useState(null);
    const [filterOperationType, setFilterOperationType] = useState(null);

    const [modalOpened, setModalOpened] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    const [articleModalOpened, setArticleModalOpened] = useState(false);
    const [newArticleName, setNewArticleName] = useState('');
    const [savingArticle, setSavingArticle] = useState(false);

    const orgId = organization?.id;

    useEffect(() => {
        if (!orgId) return;
        dispatch(getArticles(orgId));
    }, [orgId, dispatch]);

    useEffect(() => {
        if (!orgId) return;
        dispatch(
            getExpenses({
                organizationId: orgId,
                startDate: filterDateRange[0] ? toLocalDateStr(filterDateRange[0]) : undefined,
                endDate: filterDateRange[1] ? toLocalDateStr(filterDateRange[1]) : undefined,
                articleId: filterArticleId || undefined,
                operationType: filterOperationType || undefined,
                page: activePage,
                limit: 50,
            })
        );
    }, [orgId, filterDateRange, filterArticleId, filterOperationType, activePage, dispatch]);

    const openAddModal = () => {
        setEditingExpense(null);
        setForm(defaultForm);
        setModalOpened(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setForm({
            operationType: expense.operationType,
            distributionMethod: expense.distributionMethod,
            distributeBy: expense.distributeBy,
            amount: expense.amount,
            expenseArticleId: expense.expenseArticleId ? String(expense.expenseArticleId) : null,
            description: expense.description || '',
            date: expense.date ? new Date(expense.date) : null,
            frequency: expense.frequency || null,
            startPeriod: expense.startPeriod ? new Date(expense.startPeriod) : null,
            endPeriod: expense.endPeriod ? new Date(expense.endPeriod) : null,
            isOfficial: expense.isOfficial,
        });
        setModalOpened(true);
    };

    const reloadExpenses = () => {
        dispatch(
            getExpenses({
                organizationId: orgId,
                startDate: filterDateRange[0] ? toLocalDateStr(filterDateRange[0]) : undefined,
                endDate: filterDateRange[1] ? toLocalDateStr(filterDateRange[1]) : undefined,
                articleId: filterArticleId || undefined,
                operationType: filterOperationType || undefined,
                page: activePage,
                limit: 50,
            })
        );
    };

    const handleSaveExpense = async () => {
        if (!form.amount || !form.date) {
            notifications.show({ title: 'Ошибка', message: 'Заполните сумму и дату', color: 'red' });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                organizationId: orgId,
                date: toLocalDateStr(form.date),
                description: form.description || undefined,
                amount: Number(form.amount),
                expenseArticleId: form.expenseArticleId ? Number(form.expenseArticleId) : undefined,
                operationType: form.operationType,
                distributionMethod: form.distributionMethod,
                distributeBy: form.distributeBy,
                frequency: form.operationType === 'planned' ? form.frequency : undefined,
                startPeriod:
                    form.operationType === 'planned' && form.startPeriod
                        ? toLocalDateStr(form.startPeriod)
                        : undefined,
                endPeriod:
                    form.operationType === 'planned' && form.endPeriod
                        ? toLocalDateStr(form.endPeriod)
                        : undefined,
                isOfficial: form.isOfficial,
            };

            if (editingExpense) {
                await dispatch(updateExpense({ id: editingExpense.id, ...payload })).unwrap();
                notifications.show({ title: 'Сохранено', message: 'Расход обновлён', color: 'green' });
            } else {
                await dispatch(createExpense(payload)).unwrap();
                notifications.show({ title: 'Добавлено', message: 'Расход добавлен', color: 'green' });
            }
            setModalOpened(false);
            reloadExpenses();
        } catch (e) {
            notifications.show({
                title: 'Ошибка',
                message: e?.message || 'Не удалось сохранить расход',
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!confirm('Удалить расход?')) return;
        await dispatch(deleteExpense(id));
        notifications.show({ title: 'Удалено', color: 'orange' });
    };

    const handleSaveArticle = async () => {
        if (!newArticleName.trim()) return;
        setSavingArticle(true);
        try {
            const created = await dispatch(
                createArticle({ organizationId: orgId, name: newArticleName.trim() })
            ).unwrap();
            setArticleModalOpened(false);
            setNewArticleName('');
            if (created) setForm((prev) => ({ ...prev, expenseArticleId: String(created.id) }));
            notifications.show({ title: 'Готово', message: 'Статья добавлена', color: 'green' });
        } catch {
            notifications.show({ title: 'Ошибка', message: 'Не удалось создать статью', color: 'red' });
        } finally {
            setSavingArticle(false);
        }
    };

    const handleDeleteArticle = async (id) => {
        if (!confirm('Удалить статью?')) return;
        await dispatch(deleteArticle(id));
        notifications.show({ title: 'Удалено', color: 'orange' });
    };

    const formatAmount = (v) =>
        Math.round(v)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const articleSelectData = articles.map((a) => ({ value: String(a.id), label: a.name }));

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
            <Paper shadow="xs" p="lg" radius="md" mb="xl">
                <Group justify="space-between" align="center">
                    <Text size="xl" fw={700}>
                        Операционные расходы
                    </Text>
                    <Button leftSection={<IconPlus size={16} />} onClick={openAddModal}>
                        Добавить
                    </Button>
                </Group>
            </Paper>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List mb="md">
                    <Tabs.Tab value="expenses">Расходы</Tabs.Tab>
                    <Tabs.Tab value="articles">Статьи</Tabs.Tab>
                </Tabs.List>

                {/* ── РАСХОДЫ ── */}
                <Tabs.Panel value="expenses">
                    <Paper withBorder p="md" radius="md" mb="md">
                        <Group gap="sm" wrap="wrap">
                            <DatePickerInput
                                type="range"
                                placeholder="Выберите период"
                                value={filterDateRange}
                                onChange={setFilterDateRange}
                                locale="ru"
                                clearable
                                style={{ width: 240 }}
                            />
                            <Select
                                placeholder="Статья"
                                value={filterArticleId}
                                onChange={setFilterArticleId}
                                data={articleSelectData}
                                clearable
                                searchable
                                style={{ width: 180 }}
                            />
                            <Select
                                placeholder="Тип операции"
                                value={filterOperationType}
                                onChange={setFilterOperationType}
                                data={[
                                    { value: 'one_time', label: 'Разовая' },
                                    { value: 'planned', label: 'Плановая' },
                                ]}
                                clearable
                                style={{ width: 160 }}
                            />
                            <Button
                                variant="subtle"
                                onClick={() => {
                                    setFilterDateRange([null, null]);
                                    setFilterArticleId(null);
                                    setFilterOperationType(null);
                                    setActivePage(1);
                                }}
                            >
                                Сбросить
                            </Button>
                        </Group>
                    </Paper>

                    {expensesTotal > 0 && (
                        <Paper withBorder p="sm" radius="md" mb="md">
                            <Group gap="xl">
                                <Text size="sm">
                                    Итого записей: <b>{expensesTotal}</b>
                                </Text>
                                <Text size="sm">
                                    Сумма расходов: <b>{formatAmount(expensesTotalAmount)} ₽</b>
                                </Text>
                            </Group>
                        </Paper>
                    )}

                    <Paper withBorder radius="md" style={{ position: 'relative' }}>
                        <LoadingOverlay visible={loading} />
                        <ScrollArea>
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Дата</Table.Th>
                                        <Table.Th>Описание</Table.Th>
                                        <Table.Th ta="right">Сумма</Table.Th>
                                        <Table.Th>Статья</Table.Th>
                                        <Table.Th>Тип</Table.Th>
                                        <Table.Th ta="center">Офиц.</Table.Th>
                                        <Table.Th ta="center">Действия</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {expenses.length > 0 ? (
                                        expenses.map((exp) => (
                                            <Table.Tr key={exp.id}>
                                                <Table.Td>
                                                    <Text size="sm">{exp.date}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" c="dimmed">
                                                        {exp.description || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <Text size="sm" fw={500}>
                                                        {formatAmount(exp.amount)} ₽
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">{exp.articleName || '—'}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        variant="light"
                                                        color={
                                                            exp.operationType === 'planned'
                                                                ? 'blue'
                                                                : 'gray'
                                                        }
                                                        size="sm"
                                                    >
                                                        {OPERATION_TYPE_LABELS[exp.operationType]}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td ta="center">
                                                    {exp.isOfficial ? (
                                                        <Badge color="green" size="sm" variant="light">
                                                            Да
                                                        </Badge>
                                                    ) : (
                                                        <Text size="sm" c="dimmed">
                                                            —
                                                        </Text>
                                                    )}
                                                </Table.Td>
                                                <Table.Td ta="center">
                                                    <Group gap={4} justify="center">
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="subtle"
                                                            onClick={() => openEditModal(exp)}
                                                        >
                                                            <IconEdit size={14} />
                                                        </ActionIcon>
                                                        <ActionIcon
                                                            size="sm"
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() => handleDeleteExpense(exp.id)}
                                                        >
                                                            <IconTrash size={14} />
                                                        </ActionIcon>
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={7}>
                                                <Text ta="center" c="dimmed" py="xl">
                                                    {loading ? 'Загрузка...' : 'Нет расходов'}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                        {expensesTotalPages > 1 && (
                            <Group justify="center" p="md">
                                <Pagination
                                    value={activePage}
                                    onChange={setActivePage}
                                    total={expensesTotalPages}
                                />
                            </Group>
                        )}
                    </Paper>
                </Tabs.Panel>

                {/* ── СТАТЬИ ── */}
                <Tabs.Panel value="articles">
                    <Paper withBorder radius="md">
                        <Group justify="flex-end" p="md" pb={0}>
                            <Button
                                size="sm"
                                leftSection={<IconPlus size={14} />}
                                onClick={() => {
                                    setNewArticleName('');
                                    setArticleModalOpened(true);
                                }}
                            >
                                Добавить статью
                            </Button>
                        </Group>
                        <Table striped highlightOnHover withTableBorder withColumnBorders mt="xs">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Название</Table.Th>
                                    <Table.Th>Дата создания</Table.Th>
                                    <Table.Th ta="center">Действия</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {articles.length > 0 ? (
                                    articles.map((art) => (
                                        <Table.Tr key={art.id}>
                                            <Table.Td>
                                                <Text size="sm" fw={500}>
                                                    {art.name}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed">
                                                    {art.createdAt
                                                        ? new Date(art.createdAt).toLocaleDateString(
                                                              'ru-RU'
                                                          )
                                                        : '—'}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td ta="center">
                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDeleteArticle(art.id)}
                                                >
                                                    <IconTrash size={14} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={3}>
                                            <Text ta="center" c="dimmed" py="xl">
                                                Статьи не добавлены
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Tabs.Panel>
            </Tabs>

            {/* ── МОДАЛКА РАСХОДА ── */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={editingExpense ? 'Редактирование расхода' : 'Добавление расхода'}
                centered
                size="md"
            >
                <Stack gap="md">
                    <div>
                        <Text size="sm" fw={500} mb={6}>
                            Тип операции
                        </Text>
                        <RadioGroup
                            value={form.operationType}
                            onChange={(v) => setForm((f) => ({ ...f, operationType: v }))}
                        >
                            <Group gap="md">
                                <Radio value="one_time" label="Разовая" />
                                <Radio value="planned" label="Плановая" />
                            </Group>
                        </RadioGroup>
                    </div>

                    <div>
                        <Text size="sm" fw={500} mb={6}>
                            Как распределяем расход
                        </Text>
                        <RadioGroup
                            value={form.distributionMethod}
                            onChange={(v) => setForm((f) => ({ ...f, distributionMethod: v }))}
                        >
                            <Group gap="md">
                                <Radio value="proportional" label="Пропорционально продажам" />
                                <Radio value="equal" label="Равными долями" />
                            </Group>
                        </RadioGroup>
                    </div>

                    {form.operationType === 'planned' && (
                        <>
                            <Select
                                label="Частота повтора"
                                placeholder="Выберите частоту"
                                value={form.frequency}
                                onChange={(v) => setForm((f) => ({ ...f, frequency: v }))}
                                data={[
                                    { value: 'monthly', label: 'Каждый месяц' },
                                    { value: 'weekly', label: 'Каждую неделю' },
                                ]}
                            />
                            <Group grow>
                                <DatePickerInput
                                    label="Начало периода (опционально)"
                                    placeholder="Выберите дату"
                                    value={form.startPeriod}
                                    onChange={(v) => setForm((f) => ({ ...f, startPeriod: v }))}
                                    locale="ru"
                                    clearable
                                />
                                <DatePickerInput
                                    label="Конец периода (опционально)"
                                    placeholder="Выберите дату"
                                    value={form.endPeriod}
                                    onChange={(v) => setForm((f) => ({ ...f, endPeriod: v }))}
                                    locale="ru"
                                    clearable
                                />
                            </Group>
                        </>
                    )}

                    <NumberInput
                        label="Сумма"
                        placeholder="0"
                        value={form.amount}
                        onChange={(v) => setForm((f) => ({ ...f, amount: v }))}
                        min={0}
                        hideControls
                    />

                    <Select
                        label="Статья"
                        placeholder="Выберите статью"
                        value={form.expenseArticleId}
                        onChange={(v) => setForm((f) => ({ ...f, expenseArticleId: v }))}
                        data={articleSelectData}
                        clearable
                        searchable
                        nothingFoundMessage={
                            <Text
                                size="sm"
                                c="blue"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setArticleModalOpened(true);
                                    setNewArticleName('');
                                }}
                            >
                                + Добавить статью
                            </Text>
                        }
                    />

                    <TextInput
                        label="Описание"
                        placeholder="Введите описание"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />

                    <DatePickerInput
                        label="Дата"
                        placeholder="Выберите дату"
                        value={form.date}
                        onChange={(v) => setForm((f) => ({ ...f, date: v }))}
                        locale="ru"
                    />

                    <div>
                        <Text size="sm" fw={500} mb={6}>
                            Распределить на
                        </Text>
                        <RadioGroup
                            value={form.distributeBy}
                            onChange={(v) => setForm((f) => ({ ...f, distributeBy: v }))}
                        >
                            <Group gap="md">
                                <Radio value="shops" label="Магазины" />
                                <Radio value="articles" label="Артикулы" />
                                <Radio value="brands" label="Бренды" />
                            </Group>
                        </RadioGroup>
                    </div>

                    <Checkbox
                        label="Официальный расход"
                        checked={form.isOfficial}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, isOfficial: e.currentTarget.checked }))
                        }
                    />

                    <Group justify="flex-end" gap="sm" mt="sm">
                        <Button variant="default" onClick={() => setModalOpened(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveExpense} loading={saving}>
                            {editingExpense ? 'Сохранить' : 'Добавить расход'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* ── МОДАЛКА СТАТЬИ ── */}
            <Modal
                opened={articleModalOpened}
                onClose={() => setArticleModalOpened(false)}
                title="Добавление статьи расходов"
                centered
                size="sm"
                zIndex={500}
            >
                <Stack gap="md">
                    <TextInput
                        placeholder="Название"
                        value={newArticleName}
                        onChange={(e) => setNewArticleName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveArticle()}
                        autoFocus
                    />
                    <Group justify="flex-end" gap="sm">
                        <Button variant="default" onClick={() => setArticleModalOpened(false)}>
                            Отменить
                        </Button>
                        <Button onClick={handleSaveArticle} loading={savingArticle}>
                            Добавить статью
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default OtherExpenses;
