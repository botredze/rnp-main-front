import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import './style.scss';

const RnpMain = () => {
    const { rnpStatistic, loading } = useSelector((state) => state.products);
    const [statistic, setStatistic] = useState([]);
    const [totalData, setTotalData] = useState(null);

    const tables = [
        {
            title: 'Статистика заказов',
            rows: [
                { label: 'Заказы', key: 'orders_count', changeKey: 'orders_count_change_percent' },
                {
                    label: 'Продажи',
                    key: 'sales_total_amount',
                    changeKey: 'sales_total_amount_change_percent',
                },
                {
                    label: 'Количество продаж',
                    key: 'sales_total_count',
                    changeKey: 'sales_total_count_change_percent',
                },
                {
                    label: 'Общий процент выкупа',
                    key: 'avg_buy_out_percent',
                    changeKey: 'avg_buy_out_percent_change_percent',
                },
                { label: 'Оборачиваемость дней', key: 'days_to_finish', changeKey: null },
                { label: 'Остаток кончится', key: 'finish_date', changeKey: null },
            ],
        },
        {
            title: 'Остатки',
            rows: [
                {
                    label: 'Остаток на складах',
                    key: 'stock_count',
                    // changeKey: 'stock_count_change_percent',
                },
            ],
        },
        {
            title: 'Конверсии',
            rows: [
                {
                    label: 'Процент выкупа',
                    key: 'avg_buy_out_percent',
                    changeKey: 'avg_buy_out_percent_change_percent',
                },
                {
                    label: 'Переходы',
                    key: 'open_card_count',
                    changeKey: 'open_card_count_change_percent',
                },
                {
                    label: 'Добавили в корзину',
                    key: 'add_to_card_count',
                    changeKey: 'add_to_card_count_change_percent',
                },
                {
                    label: 'Процент добавления в корзину',
                    key: 'avg_add_to_card_conversion',
                    changeKey: 'avg_add_to_card_conversion_change_percent',
                },
                {
                    label: 'Добавили в заказ',
                    key: 'history_orders_count',
                    changeKey: 'history_orders_count_change_percent',
                },
                {
                    label: 'Процент добавления в заказ',
                    key: 'avg_card_to_order_conversion',
                    changeKey: 'avg_card_to_order_conversion_change_percent',
                },
                {
                    label: 'Органические клики',
                    key: 'organic_clicks',
                    changeKey: 'organic_clicks_change_percent',
                },
            ],
        },
        {
            title: 'Реклама',
            rows: [
                { label: 'Затраты', key: 'adv_spend', changeKey: 'adv_spend_change_percent' },
                { label: 'Просмотров', key: 'adv_views', changeKey: 'adv_views_change_percent' },
                { label: 'Кликов', key: 'adv_clicks', changeKey: 'adv_clicks_change_percent' },
                { label: 'CPC', key: 'cpc', changeKey: 'cpc_change_percent' },
                { label: 'CTR', key: 'ctr', changeKey: 'ctr_change_percent' },
                {
                    label: 'Добавили в корзину с рекламы',
                    key: 'adv_atbs',
                    changeKey: 'adv_atbs_change_percent',
                },
                {
                    label: 'Заказов с рекламы',
                    key: 'adv_orders',
                    changeKey: 'adv_orders_change_percent',
                },
                { label: 'CPO', key: 'cpo', changeKey: 'cpo_change_percent' },
            ],
        },
    ];

    useEffect(() => {
        if (rnpStatistic.length > 0) {
            const dailyData = rnpStatistic.filter((item) => item.date !== null);
            const total = rnpStatistic.find((item) => item.date === null);

            setStatistic(dailyData);
            setTotalData(total || null);
        } else {
            setStatistic([]);
            setTotalData(null);
        }
    }, [rnpStatistic]);

    const formatValue = (value, key) => {
        if (value === null || value === undefined) return '0';

        if (key === 'finish_date') {
            return DateTime.fromISO(value).toFormat('dd.MM.yyyy');
        }

        return value;
    };

    const renderCellWithTrend = (data, row) => {
        const value = formatValue(data[row.key], row.key);
        const changePercent = row.changeKey ? data[row.changeKey] : null;

        return (
            <Box
                sx={{
                    position: 'relative',
                    padding: '8px',
                    width: 110,
                    height: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                }}
            >
                <div className="contentValue">{value}</div>

                {changePercent !== null &&
                    changePercent !== undefined &&
                    (() => {
                        const percent = Number(changePercent);

                        if (Number.isNaN(percent) || percent === 0) return null;

                        const isPositive = percent > 0;

                        return (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: 12,
                                    color: isPositive ? '#4caf50' : '#f44336',
                                }}
                            >
                                {isPositive ? (
                                    <TrendingUpIcon sx={{ fontSize: 12 }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 12 }} />
                                )}

                                <span className="percentValue">
                                    {isPositive ? '+' : ''}
                                    {percent.toFixed(0)}%
                                </span>
                            </Box>
                        );
                    })()}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                    width: '100%',
                    alignSelf: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

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
                            {totalData && (
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#e3f2fd',
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 1000,
                                    }}
                                >
                                    ИТОГО
                                </TableCell>
                            )}
                            {statistic.map((data, i) => (
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
                                    {totalData && (
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                backgroundColor: '#e3f2fd',
                                            }}
                                        />
                                    )}
                                    {statistic.map((data, i) => (
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
                                        {totalData && (
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#e3f2fd',
                                                        width: 100,
                                                        height: 60,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '4px',
                                                        fontWeight: 'bold',
                                                        padding: 0,
                                                    }}
                                                >
                                                    {formatValue(totalData[row.key], row.key)}
                                                </Box>
                                            </TableCell>
                                        )}
                                        {statistic.map((data, i) => (
                                            <TableCell key={i} align="center" sx={{ padding: 0 }}>
                                                {renderCellWithTrend(data, row)}
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
