import React from 'react';
import './style.scss';

const CartsComponent = ({ title, value, symbol, description }) => {
    const formatValue = (val, sym) => {
        if (val === null || val === undefined || isNaN(val)) {
            return 'Нет данных';
        }

        const isCurrency = sym === 'сом' || sym === '₽' || sym === '$' || sym === '€';

        if (isCurrency) {
            return Math.round(val)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        return typeof val === 'number' ? val.toLocaleString('ru-RU') : val;
    };

    const formattedValue = formatValue(value, symbol);

    return (
        <div className="cart-component">
            <div className="cart-component__header">
                <h3 className="cart-component__title">{title}</h3>
            </div>
            <div className="cart-component__content">
                <div className="cart-component__value">
                    {formattedValue} {symbol}
                </div>
                <div className="cart-component__description">{description}</div>
            </div>
        </div>
    );
};

export default CartsComponent;
