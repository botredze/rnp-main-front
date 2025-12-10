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
import './style.scss';

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
                { label: 'Количество продаж', key: 'sales_total_count' },
                { label: 'Общий процент выкупа', key: 'avg_buy_out_percent' },
                { label: 'Оборачиваемость дней', key: 'days_to_finish' },
                { label: 'Остаток кончится', key: 'finish_date' },
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
                { label: 'Органические клики', key: 'organic_clicks' },
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

    return (
        <Paper
            className="rnpTablePaper"
            sx={{
                width: '100%',
                overflowX: 'auto',
            }}
        >
            <TableContainer className="rnpTableContainer">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="stickyColumn stickyHeader">Дата</TableCell>
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
                                <TableRow className="categoryRow">
                                    <TableCell
                                        className="stickyColumn categoryHeader"
                                        sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                                    >
                                        {table.title}
                                    </TableCell>
                                    {showStats &&
                                        statistic.map((data, i) => (
                                            <TableCell
                                                key={i}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#f5f5f5',
                                                }}
                                            />
                                        ))}
                                </TableRow>

                                {table.rows.map((row) => (
                                    <TableRow key={row.key}>
                                        <TableCell
                                            className="stickyColumn"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {row.label}
                                        </TableCell>
                                        {showStats &&
                                            statistic.map((data, i) => (
                                                <TableCell key={i} align="center">
                                                    {row.key === 'finish_date' && data[row.key]
                                                        ? DateTime.fromISO(data[row.key]).toFormat(
                                                              'dd.MM.yyyy'
                                                          )
                                                        : (data[row.key] ?? 0)}
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
