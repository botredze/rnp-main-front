import Skus from '../../components/skus/Sku.jsx';
import './style.scss';
import RnpMain from '../../components/rnpMain/RnpMain.jsx';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import RnpCharts from '../../components/rnpCharts/RnpCharts.jsx';
import { useEffect, useState } from 'react';
// import { DatePickerInput } from '@mantine/dates';
import { useDispatch, useSelector } from 'react-redux';
import { getProductRnpStatistic } from '../../store/reducers/productsSlice.js';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import RnpMetrics from '../../components/rnpMainMetrics/RnpMainMetrics.jsx';

const MainPage = () => {
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
    const [customRange, setCustomRange] = useState([null, null]);
    const [shovPeriodSelector, setShovPeriodSelector] = useState(false);

    const { selectedProduct } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    console.log(selectedProduct, 'selectedProduct');
    const timePeriods = [
        {
            key: 'day',
            label: 'вчера',
        },
        {
            key: 'week',
            label: 'неделя',
        },
        {
            key: 'month',
            label: 'месяц',
        },
        {
            key: 'allTime',
            label: 'за все время',
        },
    ];

    const openTimePeriod = () => {
        setShovPeriodSelector(!shovPeriodSelector);
    };

    const setSelectedTimePeriodFunc = (timePeriod) => {
        setSelectedTimePeriod(timePeriod);
        setShovPeriodSelector(false);
    };

    // Обработчик изменения кастомного диапазона
    const handleCustomRangeChange = (dates) => {
        setCustomRange(dates);

        // Если обе даты выбраны, автоматически применяем custom период
        if (dates[0] && dates[1]) {
            setSelectedTimePeriod('custom');
            setShovPeriodSelector(false);
        }
    };

    // Определяем, какой период показывать в селекторе
    const getDisplayLabel = () => {
        if (selectedTimePeriod === 'custom' && customRange[0] && customRange[1]) {
            const start = new Date(customRange[0]).toLocaleDateString('ru-RU');
            const end = new Date(customRange[1]).toLocaleDateString('ru-RU');
            return `${start} — ${end}`;
        }
        return (
            timePeriods.find((item) => item.key === selectedTimePeriod)?.label || 'Выберите период'
        );
    };

    useEffect(() => {
        if (selectedProduct?.id !== 0) {
            dispatch(
                getProductRnpStatistic({
                    productId: selectedProduct?.id,
                    timePeriod: selectedTimePeriod,
                    startDate: customRange[0],
                    endDate: customRange[1],
                })
            );
        }
    }, [selectedTimePeriod, selectedProduct, customRange]);

    return (
        <div className="mainPageContainerItem">
            <div className="skus">
                <Skus />
            </div>

            <div className="container">
                {selectedProduct?.id === 0 && <RnpMetrics />}

                {selectedProduct?.id !== 0 && (
                    <>
                        <div className="title">
                            <h3>Рука на пульсе</h3>

                            <div className="timeSelectorWrapper">
                                <div className="timeSelector" onClick={openTimePeriod}>
                                    {getDisplayLabel()}
                                </div>

                                {shovPeriodSelector && (
                                    <div className="timeSelectItem">
                                        {timePeriods.map((timePeriod) => (
                                            <div
                                                className="dateTimeItem"
                                                key={timePeriod.key}
                                                onClick={() =>
                                                    setSelectedTimePeriodFunc(timePeriod.key)
                                                }
                                            >
                                                <span>{timePeriod.label}</span>
                                            </div>
                                        ))}

                                        <div className="timeSelectorCustom">
                                            <DatePickerInput
                                                type="range"
                                                placeholder="Выберите даты"
                                                locale="ru"
                                                value={customRange}
                                                onChange={handleCustomRangeChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="video">
                                <PlayCircleIcon />
                                Инструкция
                            </div>
                        </div>

                        <div className="mainTable">
                            <RnpMain />
                            {false && <RnpCharts />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MainPage;
