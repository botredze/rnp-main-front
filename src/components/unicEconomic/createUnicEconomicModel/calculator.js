export const calculateUnitEconomic = (formValues) => {
    const tableData = [...formValues.tableData];
    let remainingPrice = 0;
    let fixedRemainingPrice = 0;

    const getIndex = (label) => tableData.findIndex((item) => item.label === label);
    const num = (val) => parseFloat(val) || 0;

    // 1. Базовая цена
    const priceIndex = getIndex('Цена на WB наша');
    if (priceIndex !== -1) {
        remainingPrice = num(tableData[priceIndex].value);
        fixedRemainingPrice = remainingPrice;
    }

    // 2. Комиссия WB
    const wbIndex = getIndex('Комиссия WB');
    if (wbIndex !== -1) {
        const percent = num(tableData[wbIndex].percent);
        const deducted = remainingPrice * (percent / 100);
        tableData[wbIndex].value = parseFloat(deducted.toFixed(1));
        remainingPrice -= deducted;
    }

    // 3. Цена с СПП
    const sspIndex = getIndex('Цена с СПП');
    if (sspIndex !== -1) {
        const sspPercent = num(formValues.ssp);
        const sspValue = remainingPrice * (sspPercent / 100);
        const newPrice = remainingPrice + sspValue;
        tableData[sspIndex].value = parseFloat(newPrice.toFixed(2));
        remainingPrice = newPrice; // обновляем оставшуюся цену
    }

    // 4. Доп. комиссия
    const extraIndex = getIndex('Доп.комиссия');
    if (extraIndex !== -1) {
        const percent = num(tableData[extraIndex].percent);
        const deducted = remainingPrice * (percent / 100);
        tableData[extraIndex].value = parseFloat(deducted.toFixed(1));
        remainingPrice -= deducted;
    }

    // 5. Эквайринг
    const acquiringIndex = getIndex('Эквайринг');
    if (acquiringIndex !== -1) {
        const percent = num(tableData[acquiringIndex].percent);
        const deducted = remainingPrice * (percent / 100);
        tableData[acquiringIndex].value = parseFloat(deducted.toFixed(1));
        remainingPrice -= deducted;
    }

    // 6. Реклама
    const adsIndex = getIndex('Реклама');
    if (adsIndex !== -1) {
        const percent = num(tableData[adsIndex].percent);
        const deducted = fixedRemainingPrice * (percent / 100);
        tableData[adsIndex].value = parseFloat(deducted.toFixed(1));
        remainingPrice -= deducted;
    }

    // 9. Габариты товара
    const x = num(tableData[getIndex(' - Ширина товара')]?.value);
    const y = num(tableData[getIndex(' - Высота товара')]?.value);
    const z = num(tableData[getIndex(' - Длина товара')]?.value);

    const sTovarIndex = getIndex(' - Обьем товара в литрах');
    const dopLitersIndex = getIndex(' - Обьем доп литров');

    if (x && y && z && sTovarIndex !== -1 && dopLitersIndex !== -1) {
        const volumeLiters = (x * y * z) / 1000;
        const dopLitrs = Math.max(0, volumeLiters - 1);
        tableData[sTovarIndex].value = parseFloat(volumeLiters.toFixed(2));
        tableData[dopLitersIndex].value = parseFloat(dopLitrs.toFixed(2));
    }

    // 10. Логистика
    const logisticIndex = getIndex('Логистика c учетом % выкупа');
    const dostavkaIndex = getIndex(' - Доставка до клиента');
    const vozvratIndex = getIndex(' - Возврат от клиента');

    if (logisticIndex !== -1 && dostavkaIndex !== -1 && vozvratIndex !== -1) {
        const logisticSum =
            num(tableData[dostavkaIndex].value) + num(tableData[vozvratIndex].value);
        tableData[logisticIndex].value = parseFloat(logisticSum.toFixed(2));
        remainingPrice -= logisticSum;
    }

    // 11. Логистика >1 литра
    const priceDopLitr = getIndex(' - Цена доставки за доп. литр');
    const priceForLitr = getIndex(' - Цена доставки за первый литр');
    const priceForLogisticBolsheLitraIndex = getIndex(' - Стоимость логистики доп литров');
    const keffStock = getIndex(' - Коэффициент склада');
    const precentVykupIndex = getIndex('Процент выкупа');

    if (
        priceDopLitr !== -1 &&
        priceForLitr !== -1 &&
        priceForLogisticBolsheLitraIndex !== -1 &&
        keffStock !== -1
    ) {
        const priceDop = num(tableData[priceDopLitr].value);
        const dopLitrs = num(tableData[dopLitersIndex].value);
        const sTovar = num(tableData[sTovarIndex].value);
        const keff = num(tableData[keffStock].percent);
        const procVykup = num(tableData[precentVykupIndex].percent);
        const backToSell = num(tableData[vozvratIndex].value);

        tableData[keffStock].value = parseFloat(keff.toFixed(2));

        let dopLogisticCost = 0;

        let logicticValue = 0;
        tableData[priceForLitr].value = 46.14;

        if (sTovar <= 1) {
            tableData[priceForLitr].value = 46.14;

            logicticValue = num(tableData[priceForLitr].value) * (keff / 100);
            tableData[logisticIndex].value = parseFloat(logicticValue.toFixed(2));
        } else {
            const base = num(tableData[priceForLitr].value);

            dopLogisticCost = dopLitrs * priceDop;
            tableData[priceForLogisticBolsheLitraIndex].value = parseFloat(
                dopLogisticCost.toFixed(2)
            );

            const dopLitrCostSumm = parseFloat(dopLogisticCost.toFixed(2));

            logicticValue = (base + dopLitrCostSumm) * (keff / 100);
            const logisticSummByPercent = procVykup > 0 ? (1 - procVykup / 100) * backToSell : 0;

            logicticValue = parseFloat(logicticValue.toFixed(2));

            const logisticSumm = (logicticValue + logisticSummByPercent) / (procVykup / 100);

            tableData[logisticIndex].value = parseFloat(logisticSumm.toFixed(2));
            tableData[dostavkaIndex].value = parseFloat(logicticValue.toFixed(2));
        }
    }

    // (стоимость хранения за литр * 1 + стоимость хранения за доп литр * количество доп литров) * коэффицент склада * предполгаемый срок хранения
    // === Хранение ===

    const savePriceFirstIndex = getIndex(' - Цена хранения за первый литр');
    const savePriceExtraIndex = getIndex(' - Цена хранения за доп литры');
    const saveDaysIndex = getIndex(' - Предпологаемый срок хранения');
    const saveMonthIndex = getIndex(' - Цена за хранение в месяц');
    const saveCoeffIndex = getIndex(' - Коэффициент храненеи на складе');

    if (
        savePriceFirstIndex !== -1 &&
        savePriceExtraIndex !== -1 &&
        saveDaysIndex !== -1 &&
        saveCoeffIndex !== -1 &&
        saveMonthIndex !== -1
    ) {
        const priceFirst = num(tableData[savePriceFirstIndex].value); // цена за 1 литр
        const priceExtra = num(tableData[savePriceExtraIndex].value); // цена за доп литры
        const dopLiters = num(tableData[getIndex(' - Обьем доп литров')]?.value);
        const coeff = num(tableData[saveCoeffIndex].percent); // %
        const days = num(tableData[saveDaysIndex].value); // дни

        const dailyStorage = (priceFirst + priceExtra * dopLiters) * (coeff / 100);

        tableData[savePriceFirstIndex].value = parseFloat(dailyStorage.toFixed(2));

        const totalStorage = dailyStorage * days;

        tableData[saveMonthIndex].value = parseFloat(totalStorage.toFixed(2));
    }

    // 8.1. Брак и потери
    const defectIndex = getIndex(' - Брак и потери');
    const defectPercentIndex = getIndex(' - Процент брака или потерь');

    if (defectIndex !== -1 && defectPercentIndex !== -1) {
        const defectPercent = num(tableData[defectPercentIndex].percent); // процент
        const defectCost = fixedRemainingPrice * (defectPercent / 100); // цена * %

        tableData[defectIndex].value = parseFloat(defectCost.toFixed(2));
    }

    const incomeIndex = getIndex('Доход от продажи');
    const toPayWbIndex = getIndex('К перечислению от WB');

    if (incomeIndex !== -1) {
        const sppValue = num(tableData[sspIndex].value);
        tableData[incomeIndex].value = parseFloat(sppValue.toFixed(0));
    }

    if (toPayWbIndex !== -1) {
        const notSppPrice = num(tableData[priceIndex].value);

        const kommProcent = num(tableData[wbIndex].percent);

        const kommPrice = notSppPrice * (kommProcent / 100);

        const toPaySumm = notSppPrice - kommPrice;

        tableData[toPayWbIndex].value = parseFloat(toPaySumm.toFixed(2));
    }

    // === Доп. расчёты ===

    // 1. Расходы на единицу = Себестоимость + логистика + хранение + эквайринг + реклама + брак/потери
    const expenseIndex = getIndex('Рассходы на еденицу');

    // const costIndex = getIndex('Себестоимость итого');
    // const cost = costIndex !== -1 ? num(tableData[costIndex].value) : 0;

    // Логистика
    const logistic = num(tableData[getIndex('Логистика c учетом % выкупа')]?.value);

    // Хранение
    const storage = num(tableData[getIndex(' - Цена за хранение в месяц')]?.value);

    // Эквайринг
    const acquiring = num(tableData[getIndex('Эквайринг')]?.value);

    // Реклама
    const ads = num(tableData[getIndex('Реклама')]?.value);

    // Брак и потери
    const defect = num(tableData[getIndex(' - Брак и потери')]?.value);

    const cost = num(tableData[expenseIndex]?.value);

    // Итог расхода
    const totalExpense = cost + logistic + storage + acquiring + ads + defect;

    if (expenseIndex !== -1) {
        tableData[expenseIndex].value = parseFloat(totalExpense.toFixed(2));
    }

    // 2. Валовая прибыль = К перечислению от WB - расходы
    const grossProfitIndex = getIndex('Валовая прибыль');
    const toPay = num(tableData[getIndex('К перечислению от WB')]?.value);

    if (grossProfitIndex !== -1) {
        const gross = toPay - totalExpense;
        tableData[grossProfitIndex].value = parseFloat(gross.toFixed(2));
    }

    // 3. Маржинальность (%) = Валовая прибыль / Цена до СПП * 100
    const marginIndex = getIndex('Маржинальность');
    const basePrice = num(tableData[getIndex('Цена на WB наша')]?.value);

    if (marginIndex !== -1 && basePrice > 0) {
        const gross = num(tableData[grossProfitIndex]?.value);
        const margin = (gross / basePrice) * 100;
        tableData[marginIndex].percent = parseFloat(margin.toFixed(2));
        tableData[marginIndex].value = parseFloat(margin.toFixed(2));
    }

    // 4. ROI = Валовая прибыль / себестоимость * 100
    const roiIndex = getIndex('ROI за единицу');

    if (roiIndex !== -1) {
        const gross = num(tableData[grossProfitIndex]?.value);
        console.log(gross, 'gross');
        console.log(cost, 'cost');
        const roi = (gross / cost) * 100;
        tableData[roiIndex].percent = parseFloat(roi.toFixed(2));
    }

    return { ...formValues, tableData };
};

// Рассход на еденицу  = Себестоимость + логистика + хранение за день + эквайринг + реклама + брак и потери
// валомавая прибвыль = к перечислению от вб - расход на еденицу
// маржинальность в процентах= валомавая прибыль - цена до спп
// ROI в процентах =  валовая прибыль / себестоимость
