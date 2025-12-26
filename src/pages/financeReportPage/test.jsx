import React, { useState } from 'react';
import './style.scss';

const FinanceReportPage = () => {
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dateRange, setDateRange] = useState('aug-2025');

    const metrics = [
        {
            title: 'Чистая прибыль',
            value: '-3 658 сом',
            subtitle: 'Маржа: -2.5%',
            change: '-112.3%',
            isNegative: true,
        },
        {
            title: 'Выручка',
            value: '145 805 сом',
            subtitle: '61 продаж',
            badge: '4 возвр.',
            change: '-13%',
            isNegative: true,
        },
        {
            title: 'Продано на WB',
            value: '114 997 сом',
            subtitle: 'По розничной цене',
            change: '-11.7%',
            isNegative: true,
        },
        {
            title: 'Удержания WB',
            value: '126 171 сом',
            subtitle: 'Все расходы на площадке',
            change: '+16.4%',
            isNegative: true,
        },
        {
            title: 'Комиссия WB',
            value: '37 788 сом',
            subtitle: '25.9% от выручки',
            change: '-13%',
            isNegative: false,
        },
        {
            title: 'Логистика',
            value: '25 769 сом',
            subtitle: '17.7% от выручки',
            badge: '195 доставок',
            change: '-26%',
            isNegative: false,
        },
        {
            title: 'Прочие расходы',
            value: '62 613 сом',
            subtitle: 'Штрафы, хранение, реклама',
            change: '+107.8%',
            isNegative: true,
        },
        {
            title: 'Бизнес-расходы',
            value: '0 сом',
            subtitle: 'Внесённые вручную',
            change: null,
            isNegative: false,
        },
        {
            title: 'Себестоимость',
            value: '22 900 сом',
            subtitle: '15.7% от выручки',
            change: '-20.2%',
            isNegative: false,
        },
        {
            title: 'Налог',
            value: '393 сом',
            subtitle: '2%',
            change: '-67.1%',
            isNegative: false,
        },
        {
            title: 'Маржинальность',
            value: '-2.5%',
            subtitle: 'Чистая прибыль / Выручка',
            change: '-114.1%',
            isNegative: true,
        },
        {
            title: 'Рентабельность',
            value: '-16.0%',
            subtitle: 'ROI (прибыль / затраты)',
            change: '-115.4%',
            isNegative: true,
        },
        {
            title: 'Капитализация склада',
            value: '2 902 589 сом',
            subtitle: '6 894 шт на складе',
            change: null,
            isNegative: false,
        },
        {
            title: 'Потенциал прибыли',
            value: '-463 704 сом',
            subtitle: 'Капитализация × ROI',
            change: '-115.4%',
            isNegative: true,
        },
    ];

    const tableData = {
        months: [
            { label: 'август', startDate: '1-авг.-2025', endDate: '3-авг.-2025' },
            { label: 'август', startDate: '4-авг.-2025', endDate: '10-авг.-2025' },
            { label: 'август', startDate: '11-авг.-2025', endDate: '17-авг.-2025' },
            { label: 'август', startDate: '18-авг.-2025', endDate: '24-авг.-2025' },
            { label: 'август', startDate: '25-авг.-2025', endDate: '31-авг.-2025' },
            { label: 'сентябрь', startDate: '1-сент.-2025', endDate: '7-сент.-2025' },
        ],
        salesData: [
            { sales: 0, returns: 0, deliveries: 0, returnQty: 0 },
            { sales: 2265, returns: 9, deliveries: 2610, returnQty: 348 },
            { sales: 2001, returns: 7, deliveries: 2377, returnQty: 376 },
            { sales: 1727, returns: 6, deliveries: 2044, returnQty: 322 },
            { sales: 1634, returns: 12, deliveries: 1996, returnQty: 374 },
            { sales: 0, returns: 0, deliveries: 0, returnQty: 0 },
        ],
        avgData: [
            { price: 0, commission: 0, transfer: 0, delivery: 0, cost: 0, margin: 0 },
            { price: 1101, commission: -22, transfer: 1123, delivery: 86, cost: 572, margin: 465 },
            { price: 1089, commission: -6, transfer: 1095, delivery: 85, cost: 565, margin: 444 },
            { price: 1157, commission: 8, transfer: 1150, delivery: 82, cost: 569, margin: 499 },
            { price: 1198, commission: 35, transfer: 1163, delivery: 79, cost: 539, margin: 546 },
            { price: 0, commission: 0, transfer: 0, delivery: 0, cost: 0, margin: 0 },
        ],
        financeData: [
            {
                revenue: 0,
                commission: 0,
                commissionPct: '-',
                transfer: 0,
                deliveryCost: 0,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 0,
                cost: 0,
                profit: 0,
            },
            {
                revenue: 2483408,
                commission: -50649,
                commissionPct: '-2.0%',
                transfer: 2534057,
                deliveryCost: 253334,
                fines: 66,
                acceptance: 0,
                deductions: 0,
                storage: 28091,
                totalPay: 2253909,
                cost: 1291130,
                profit: 962779,
            },
            {
                revenue: 2170692,
                commission: -12641,
                commissionPct: '-0.6%',
                transfer: 2183332,
                deliveryCost: 235078,
                fines: 1275,
                acceptance: 0,
                deductions: 0,
                storage: 26934,
                totalPay: 1922757,
                cost: 1127350,
                profit: 795407,
            },
            {
                revenue: 1991499,
                commission: 12943,
                commissionPct: '0.6%',
                transfer: 1978556,
                deliveryCost: 192994,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 27891,
                totalPay: 1757670,
                cost: 979230,
                profit: 778440,
            },
            {
                revenue: 1943244,
                commission: 56165,
                commissionPct: '2.9%',
                transfer: 1887079,
                deliveryCost: 186652,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 1700427,
                cost: 874170,
                profit: 826257,
            },
            {
                revenue: 0,
                commission: 0,
                commissionPct: '-',
                transfer: 0,
                deliveryCost: 0,
                fines: 0,
                acceptance: 0,
                deductions: 0,
                storage: 0,
                totalPay: 0,
                cost: 0,
                profit: 0,
            },
        ],
        corrections: [
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: 1343,
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: 2711,
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
            {
                acquiring: '',
                replacedGoods: '',
                lostGoods: '',
                defect: '',
                salesCorrection: '',
                logisticsCorrection: '',
                advancePayment: '',
            },
        ],
    };

    const getChangeClass = (metric) => {
        if (!metric.change) return '';
        const isPositiveChange = metric.change.startsWith('+');
        if (metric.isNegative) {
            return isPositiveChange ? 'metric-card__change--bad' : 'metric-card__change--good';
        } else {
            return isPositiveChange ? 'metric-card__change--good' : 'metric-card__change--bad';
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log('Uploading file:', selectedFile);
            setModalOpened(false);
            setSelectedFile(null);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <h1 className="dashboard__title">Дашборд</h1>
                <div className="dashboard__controls">
                    <select
                        className="dashboard__select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="aug-2025">Август 2025</option>
                        <option value="sep-2025">Сентябрь 2025</option>
                        <option value="oct-2025">Октябрь 2025</option>
                    </select>
                    <button className="button button--secondary">
                        <span>📖</span>
                        <span>Инструкции</span>
                    </button>
                    <button className="button button--primary" onClick={() => setModalOpened(true)}>
                        <span>📤</span>
                        <span>Загрузить отчет</span>
                    </button>
                </div>
            </div>

            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                        <div className="metric-card__header">
                            <h3 className="metric-card__title">{metric.title}</h3>
                            {metric.change && (
                                <span className={`metric-card__change ${getChangeClass(metric)}`}>
                                    {metric.change}
                                </span>
                            )}
                        </div>
                        <div className="metric-card__value">{metric.value}</div>
                        <div className="metric-card__subtitle">{metric.subtitle}</div>
                        {metric.badge && <div className="metric-card__badge">{metric.badge}</div>}
                    </div>
                ))}
            </div>

            <h1 className="dashboard__title">Отчет еженедельный</h1>

            <div className="data-table">
                <div className="data-table__wrapper">
                    <table className="data-table__table">
                        <thead>
                            <tr>
                                <th className="data-table__header data-table__header--fixed">
                                    Месяц
                                </th>
                                {tableData.months.map((month, idx) => (
                                    <th key={idx} className="data-table__header">
                                        {month.label}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th className="data-table__header data-table__header--fixed">
                                    Начало недели
                                </th>
                                {tableData.months.map((month, idx) => (
                                    <th key={idx} className="data-table__header">
                                        {month.startDate}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th className="data-table__header data-table__header--fixed data-table__header--last">
                                    Конец недели
                                </th>
                                {tableData.months.map((month, idx) => (
                                    <th
                                        key={idx}
                                        className="data-table__header data-table__header--last"
                                    >
                                        {month.endDate}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="data-table__section-row">
                                <td
                                    className="data-table__cell data-table__cell--fixed"
                                    colSpan="7"
                                ></td>
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Количество продаж
                                </td>
                                {tableData.salesData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.sales || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Количество возвратов
                                </td>
                                {tableData.salesData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.returns || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Количество доставок
                                </td>
                                {tableData.salesData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.deliveries || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--border-bottom">
                                    Количество возврата
                                </td>
                                {tableData.salesData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative data-table__cell--border-bottom"
                                    >
                                        {data.returnQty || 0}
                                    </td>
                                ))}
                            </tr>

                            <tr className="data-table__section-row">
                                <td
                                    className="data-table__cell data-table__cell--fixed"
                                    colSpan="7"
                                ></td>
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Средняя цена
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.price || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Средняя комиссия
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className={`data-table__cell ${data.commission < 0 ? 'data-table__cell--negative' : ''}`}
                                    >
                                        {data.commission || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Среднее к перечислению
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.transfer || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Средний расход на доставку
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.delivery || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Средняя себестоимость
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.cost || 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--border-bottom">
                                    Средняя маржа
                                </td>
                                {tableData.avgData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--border-bottom"
                                    >
                                        {data.margin || 0}
                                    </td>
                                ))}
                            </tr>

                            <tr className="data-table__section-row">
                                <td
                                    className="data-table__cell data-table__cell--fixed"
                                    colSpan="7"
                                ></td>
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--highlight">
                                    Выручка
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--highlight"
                                    >
                                        {data.revenue.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Комиссия ВБ
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className={`data-table__cell ${data.commission < 0 ? 'data-table__cell--negative' : ''}`}
                                    >
                                        {data.commission.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Комиссия %
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.commissionPct}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    К перечислению
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.transfer.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Расходы на доставку
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.deliveryCost.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Штрафы
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.fines.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Приемка
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.acceptance}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Удержания
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.deductions}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Хранение
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.storage.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--border-bottom data-table__cell--highlight">
                                    Итого к оплате
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--border-bottom data-table__cell--highlight"
                                    >
                                        {data.totalPay.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Себестоимость
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--negative"
                                    >
                                        {data.cost.toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--border-bottom data-table__cell--highlight">
                                    Чистая прибыль
                                </td>
                                {tableData.financeData.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--border-bottom data-table__cell--highlight"
                                    >
                                        {data.profit.toLocaleString()}
                                    </td>
                                ))}
                            </tr>

                            <tr className="data-table__section-row">
                                <td
                                    className="data-table__cell data-table__cell--fixed"
                                    colSpan="7"
                                ></td>
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--section-title">
                                    Корректировки
                                </td>
                                <td className="data-table__cell" colSpan="6"></td>
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Корректировка эквайринга
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.acquiring}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Компенсация подмененного товара
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.replacedGoods}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Компенсация потерянного товара
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.lostGoods}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Компенсация брака
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.defect}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Коррекция продаж
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.salesCorrection}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label">
                                    Коррекция логистика
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td key={idx} className="data-table__cell">
                                        {data.logisticsCorrection}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="data-table__cell data-table__cell--fixed data-table__cell--label data-table__cell--border-bottom">
                                    Авансовая оплата за товар без движения
                                </td>
                                {tableData.corrections.map((data, idx) => (
                                    <td
                                        key={idx}
                                        className="data-table__cell data-table__cell--border-bottom"
                                    >
                                        {data.advancePayment}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpened && (
                <div className="modal">
                    <div className="modal__overlay" onClick={() => setModalOpened(false)}></div>
                    <div className="modal__content">
                        <h2 className="modal__title">Загрузить отчет Excel</h2>
                        <div className="modal__body">
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="modal__file-input"
                            />
                            {selectedFile && (
                                <p className="modal__file-name">Выбран файл: {selectedFile.name}</p>
                            )}
                        </div>
                        <div className="modal__footer">
                            <button
                                className="button button--secondary"
                                onClick={() => {
                                    setModalOpened(false);
                                    setSelectedFile(null);
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                className="button button--primary"
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                Загрузить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceReportPage;
