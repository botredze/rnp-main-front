import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';

const RnpMain = () => {
    const [showStats, setShowStats] = useState(false);
    const { rnpStatistic } = useSelector((state) => state.products);
    const [statistic, setStatistic] = useState([]);

    const tables = [
        {
            title: 'Статистика заказов',
            rows: [
                { label: 'Заказы', key: 'orders_count' },
                { label: 'Продажи', key: 'sales_total_amount' },
                { label: 'Общий процент выкупа', key: 'avg_buy_out_percent' },
                { label: 'Оборачиваемость дней', key: 'turnover_days' },
                { label: 'Остаток кончится', key: 'stock_total' },
            ],
        },
        {
            title: 'Остатки',
            rows: [{ label: 'Остаток на складах', key: 'stock_count' }],
        },

        {
            title: 'Конверсии',
            rows: [
                { label: 'Процент выкупа', key: 'avg_buy_out_percent' },
                { label: 'Переходы', key: 'open_card_count' },
                { label: 'Добавили в корзину', key: 'add_to_card_count' },
                { label: 'Процент добавления в корзину', key: 'avg_add_to_card_conversion' },
                { label: 'Добавили в заказ', key: 'history_orders_count' },
                { label: 'Процент добавления в заказ', key: 'avg_card_to_order_conversion' },
            ],
        },
        {
            title: 'Реклама',
            rows: [
                { label: 'Затраты', key: 'adv_spend' },
                { label: 'Просмотров', key: 'adv_views' },
                { label: 'Кликов', key: 'adv_clicks' },
                { label: 'CPC', key: 'cpc' },
                { label: 'CTR', key: 'ctr' },
                { label: 'Добавили в корзину с рекламы', key: 'adv_atbs' },
                { label: 'Заказов с рекламы', key: 'adv_orders' },
                { label: 'CPO', key: 'cpo' },
            ],
        },
    ];

    useEffect(() => {
        if (rnpStatistic.length > 0) {
            setShowStats(true);
            setStatistic(rnpStatistic);
        }
    }, [rnpStatistic]);

    console.log(showStats, 'showStats');

    const allRows = tables.flatMap((table) => table.rows);

    return (
        <Paper
            sx={{
                width: '100%',
                overflowX: 'auto',
            }}
        >
            <TableContainer sx={{ minWidth: 1200 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата</TableCell>
                            {showStats &&
                                statistic.map((data, i) => (
                                    <TableCell key={i} align="center">
                                        {DateTime.fromISO(data.date).toFormat('dd.MM.yyyy')}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tables.map((table, tIndex) => (
                            <Fragment key={tIndex}>
                                <TableRow>
                                    <TableCell
                                        colSpan={showStats ? statistic.length + 1 : 1}
                                        sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                                    >
                                        {table.title}
                                    </TableCell>
                                </TableRow>

                                {table.rows.map((row) => (
                                    <TableRow key={row.key}>
                                        <TableCell sx={{ fontWeight: 'bold', width: 250 }}>
                                            {row.label}
                                        </TableCell>
                                        {showStats &&
                                            statistic.map((data, i) => (
                                                <TableCell key={i} align="center">
                                                    {data[row.key] ?? 0}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default RnpMain;
