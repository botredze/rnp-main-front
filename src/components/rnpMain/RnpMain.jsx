import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import './style.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const RnpMain = () => {
    const [showStats, setShowStats] = useState(false);
    const { rnpStatistic } = useSelector((state) => state.products);

    const [salesList, setSales] = useState([]);
    const [ordersList, setOrders] = useState([]);
    const [reklamaL, setReklama] = useState([]);
    const [statistic, setStatistic] = useState([]);

    const tables = [
        {
            title: 'Статистика заказов',
            rows: [
                'Заказы',
                'Продажи',
                'Общий процент выкупа',
                'Оборачиваемость дней',
                'Остаток кончится',
            ],
        },
        {
            title: 'Конверсии',
            rows: [
                'Процент выкупа',
                'Переходы',
                'Добавили в корзину',
                'Процент добавления в корзину',
                'Добавили в заказ',
                'Процент добавления в заказ',
            ],
        },
        {
            title: 'Реклама',
            rows: [
                'Затраты',
                'Просмотров',
                'Кликов',
                'CPC',
                'CTR',
                'Добавили в корзину с рекламы',
                'Заказов с рекламы',
                'CPO',
            ],
        },
    ];

    useEffect(() => {
        if (typeof rnpStatistic === 'object') {
            setShowStats(false);

            const { sales, orders, stats, advestStats } = rnpStatistic;

            setSales(sales);
            setOrders(orders);
            setStatistic(stats);
            setReklama(advestStats);
        }
    }, [rnpStatistic]);

    console.log(rnpStatistic, 'rnpStatistic');
    return (
        <Paper
            sx={{
                width: 'max-content',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 2,
            }}
        >
            {tables.map((table, index) => (
                <TableContainer key={index} sx={{ height: '100%' }}>
                    <Table stickyHeader aria-label={`table-${index}`}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold' }}>
                                    {table.title}
                                </TableCell>

                                {}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {table.rows.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ))}
        </Paper>
    );
};

export default RnpMain;
