import React from 'react';
import './style.scss';
import { useSelector } from 'react-redux';
import CartsComponent from './cartsComponents/CartsComponent.jsx';

const RnpMetrics = () => {
    const { basicAnalytic } = useSelector((state) => state.organization);

    const metrics = [
        {
            title: 'Выручка',
            valueKey: 'total_sales_sum',
            symbol: 'сом',
            description: `${basicAnalytic?.total_sales_count || 0} продаж`,
        },
        {
            title: 'Процент выкупа',
            valueKey: 'avg_buy_out_percent',
            symbol: '%',
            description: 'Средний по всем артикулам',
        },
        {
            title: 'Заказы',
            valueKey: 'total_orders_sum',
            symbol: 'сом',
            description: `${basicAnalytic?.total_orders_count || 0} заказов`,
        },
        {
            title: 'Остатки на складе',
            valueKey: 'total_stock_quantity',
            symbol: 'шт',
            description: `На сумму ${basicAnalytic?.total_stock_value?.toLocaleString() || 0} сом`,
        },
        {
            title: 'Просмотры карточек',
            valueKey: 'total_views',
            symbol: '',
            description: 'Всего открытий',
        },
        {
            title: 'Добавления в корзину',
            valueKey: 'total_add_to_cart',
            symbol: '',
            description: 'Конверсия в заказ',
        },
        {
            title: 'Затраты на рекламу',
            valueKey: 'total_adv_spend',
            symbol: 'сом',
            description: 'За весь период',
        },
        {
            title: 'Оборачиваемость',
            valueKey: 'days_until_stock_depletes',
            symbol: 'дней',
            description: 'До окончания товаров',
        },
        {
            title: 'Активные артикулы',
            valueKey: 'total_active_products',
            symbol: '',
            description: 'В работе',
        },
        {
            title: 'Капитализация склада',
            valueKey: 'total_stock_value',
            symbol: 'сом',
            description: `${basicAnalytic?.total_stock_quantity?.toLocaleString() || 0} единиц товара`,
        },
    ];

    return (
        <div className="rnp-metrics">
            <div className="rnp-metrics__header">
                <h1>Дашборд</h1>
                {basicAnalytic?.data_start_date && (
                    <div className="rnp-metrics__date-range">
                        Данные: {new Date(basicAnalytic.data_start_date).toLocaleDateString()} —{' '}
                        {new Date(basicAnalytic.data_end_date).toLocaleDateString()}
                    </div>
                )}
            </div>
            <div className="rnp-metrics__grid">
                {metrics.map((metric, index) => (
                    <CartsComponent
                        title={metric.title}
                        value={basicAnalytic?.[metric.valueKey] || 0}
                        symbol={metric.symbol}
                        description={metric.description}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default RnpMetrics;
