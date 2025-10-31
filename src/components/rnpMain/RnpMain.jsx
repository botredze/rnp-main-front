import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const RnpMain = () => {
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
