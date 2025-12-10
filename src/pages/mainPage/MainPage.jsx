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

const MainPage = () => {
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
    const [customRange, setCustomRange] = useState([null, null]);
    const [shovPeriodSelector, setShovPeriodSelector] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const { selectedProduct } = useSelector((state) => state.products);

    const dispatch = useDispatch();

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

        {
            key: 'custom',
            label: 'выбрать',
        },
    ];

    const openTimePeriod = () => {
        setShovPeriodSelector(!shovPeriodSelector);
    };

    const setSelectedTimePeriodFunc = (timePeriod) => {
        setSelectedTimePeriod(timePeriod);

        if (timePeriod === 'custom') {
            setShowCustomPicker(true);
        } else {
            setShowCustomPicker(false);
            setShovPeriodSelector(false);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            dispatch(
                getProductRnpStatistic({
                    productId: selectedProduct.id,
                    timePeriod: selectedTimePeriod,
                    startDate: customRange[0],
                    endDate: customRange[1],
                })
            );
        }
    }, [selectedTimePeriod, selectedProduct]);

    return (
        <div className="mainPageContainerItem">
            <div className="skus">
                <Skus />
            </div>

            <div className="container">
                <div className="title">
                    <h3>Рука на пульсе</h3>

                    <div className="timeSelectorWrapper">
                        <div className="timeSelector" onClick={openTimePeriod}>
                            {selectedTimePeriod
                                ? timePeriods.find((item) => item.key === selectedTimePeriod)?.label
                                : 'Выберите период'}
                        </div>

                        {shovPeriodSelector && (
                            <div className="timeSelectItem">
                                {timePeriods.map((timePeriod) => (
                                    <div
                                        className="dateTimeItem"
                                        key={timePeriod.key}
                                        onClick={() => setSelectedTimePeriodFunc(timePeriod.key)}
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
                                        onChange={setCustomRange}
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
            </div>
        </div>
    );
};

export default MainPage;
