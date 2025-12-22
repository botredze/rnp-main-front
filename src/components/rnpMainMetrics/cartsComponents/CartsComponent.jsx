import React from 'react';
import './style.scss';

const CartsComponent = ({ title, value, symbol, description }) => {
    const formattedValue =
        typeof value === 'number' ? value.toLocaleString() : value || 'Нет данных';

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
