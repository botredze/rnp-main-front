export const calculateUnitEconomic = (formValues) => {
    const tableData = [...formValues.tableData];
    let remainingPrice = 0;
    let fixedRemainingPrice = 0;

    const getIndex = (label) => tableData.findIndex((item) => item.label === label);
    const num = (val) => parseFloat(val) || 0;

    const getValue = (label) => {
        const idx = getIndex(label);
        return idx !== -1 ? num(tableData[idx].value) : 0;
    };

    const getPercent = (label) => {
        const idx = getIndex(label);
        return idx !== -1 ? num(tableData[idx].percent) : 0;
    };

    const costPrice = num(formValues.price);

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
        remainingPrice = newPrice;
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
    const adsIndex = getIndex(' - ДРР в бюджете на единицу товара от "цены продавца"');
    const adsValueIndex = getIndex('Реклама');
    if (adsIndex !== -1 && adsValueIndex !== -1) {
        const percent = num(tableData[adsIndex].percent);
        const deducted = fixedRemainingPrice * (percent / 100);
        tableData[adsIndex].value = parseFloat(percent.toFixed(2));
        tableData[adsValueIndex].value = parseFloat(deducted.toFixed(1));
        remainingPrice -= deducted;
    }

    // 7. Габариты товара
    const x = getValue(' - Ширина товара');
    const y = getValue(' - Высота товара');
    const z = getValue(' - Длина товара');
    const sTovarIndex = getIndex(' - Обьем товара в литрах');
    const dopLitersIndex = getIndex(' - Обьем доп литров');

    if (x && y && z && sTovarIndex !== -1 && dopLitersIndex !== -1) {
        const volumeLiters = (x * y * z) / 1000;
        const dopLitrs = Math.max(0, volumeLiters - 1);
        tableData[sTovarIndex].value = parseFloat(volumeLiters.toFixed(2));
        tableData[dopLitersIndex].value = parseFloat(dopLitrs.toFixed(2));
    }

    // 8. Логистика
    const logisticIndex = getIndex('Логистика c учетом % выкупа');
    const dostavkaIndex = getIndex(' - Доставка до клиента');
    const vozvratIndex = getIndex(' - Возврат от клиента');
    const priceDopLitr = getIndex(' - Цена доставки за доп. литр');
    const priceForLitr = getIndex(' - Цена доставки за первый литр');
    const priceForLogisticBolsheLitraIndex = getIndex(' - Стоимость логистики доп литров');
    const keffStock = getIndex(' - Коэффициент склада');
    const precentVykupIndex = getIndex('Процент выкупа');

    if (logisticIndex !== -1 && priceDopLitr !== -1 && priceForLitr !== -1 && keffStock !== -1) {
        const priceDop = num(tableData[priceDopLitr].value);
        const dopLitrs = getValue(' - Обьем доп литров');
        const sTovar = getValue(' - Обьем товара в литрах');
        const keff = num(tableData[keffStock].percent);
        const procVykup = num(tableData[precentVykupIndex].percent);
        const backToSell = getValue(' - Возврат от клиента');

        tableData[keffStock].value = parseFloat(keff.toFixed(2));
        tableData[priceForLitr].value = 46.14;

        let logicticValue = 0;

        if (sTovar <= 1) {
            logicticValue = 46.14 * (keff / 100);
            tableData[logisticIndex].value = parseFloat(logicticValue.toFixed(2));
        } else {
            const base = 46.14;
            const dopLogisticCost = dopLitrs * priceDop;

            if (priceForLogisticBolsheLitraIndex !== -1) {
                tableData[priceForLogisticBolsheLitraIndex].value = parseFloat(
                    dopLogisticCost.toFixed(2)
                );
            }

            logicticValue = (base + dopLogisticCost) * (keff / 100);
            const logisticSummByPercent = procVykup > 0 ? (1 - procVykup / 100) * backToSell : 0;
            const logisticSumm = (logicticValue + logisticSummByPercent) / (procVykup / 100);

            tableData[logisticIndex].value = parseFloat(logisticSumm.toFixed(2));
            tableData[dostavkaIndex].value = parseFloat(logicticValue.toFixed(2));
        }
    }

    // 9. Хранение
    const savePriceFirstIndex = getIndex(' - Цена хранения за первый литр');
    const savePriceExtraIndex = getIndex(' - Цена хранения за доп литры');
    const saveDaysIndex = getIndex(' - Предпологаемый срок хранения');
    const saveMonthIndex = getIndex(' - Цена за хранение в период');
    const saveCoeffIndex = getIndex(' - Коэффициент храненеи на складе');
    const daylySaveIndex = getIndex(' - Цена за хранение за день');

    if (
        savePriceFirstIndex !== -1 &&
        savePriceExtraIndex !== -1 &&
        saveDaysIndex !== -1 &&
        saveCoeffIndex !== -1 &&
        saveMonthIndex !== -1 &&
        daylySaveIndex !== -1
    ) {
        const priceFirst = num(tableData[savePriceFirstIndex].value);
        const priceExtra = num(tableData[savePriceExtraIndex].value);
        const dopLiters = getValue(' - Обьем доп литров');
        const coeff = num(tableData[saveCoeffIndex].percent);
        const days = num(tableData[saveDaysIndex].value);

        const dailyStorage = (priceFirst + priceExtra * dopLiters) * (coeff / 100);
        tableData[daylySaveIndex].value = parseFloat(dailyStorage.toFixed(2));

        const totalStorage = dailyStorage * days;
        tableData[saveMonthIndex].value = parseFloat(totalStorage.toFixed(2));
    }

    // 10. Брак и потери
    const defectIndex = getIndex(' - Брак и потери');
    const defectPercentIndex = getIndex(' - Процент брака или потерь');

    if (defectIndex !== -1 && defectPercentIndex !== -1) {
        const defectPercent = num(tableData[defectPercentIndex].percent);
        const defectCost = fixedRemainingPrice * (defectPercent / 100);
        tableData[defectIndex].value = parseFloat(defectCost.toFixed(2));
    }

    // 11. Доход от продажи
    const incomeIndex = getIndex('Доход от продажи');
    if (incomeIndex !== -1 && sspIndex !== -1) {
        const sppValue = num(tableData[sspIndex].value);
        tableData[incomeIndex].value = parseFloat(sppValue.toFixed(0));
    }

    // 12. К перечислению от WB
    const toPayWbIndex = getIndex('К перечислению от WB');
    if (toPayWbIndex !== -1 && priceIndex !== -1 && wbIndex !== -1) {
        const notSppPrice = num(tableData[priceIndex].value);
        const kommProcent = num(tableData[wbIndex].percent);
        const kommPrice = notSppPrice * (kommProcent / 100);
        const toPaySumm = notSppPrice - kommPrice;
        tableData[toPayWbIndex].value = parseFloat(toPaySumm.toFixed(2));
    }

    // === ОСНОВНЫЕ РАСЧЁТЫ ===

    // ИСПРАВЛЕНО: Расходы на единицу = Комиссия WB + Доп.комиссия + Эквайринг + Логистика + Хранение
    const expenseIndex = getIndex('Рассходы на еденицу');

    const wbCommission = getValue('Комиссия WB');
    const extraCommission = getValue('Доп.комиссия');
    const acquiring = getValue('Эквайринг');
    const logistic = getValue('Логистика c учетом % выкупа');
    const storage = getValue(' - Цена за хранение в период');

    // Итог расхода (БЕЗ себестоимости, только операционные расходы)
    const totalExpense = wbCommission + extraCommission + acquiring + logistic + storage;

    if (expenseIndex !== -1) {
        tableData[expenseIndex].value = parseFloat(totalExpense.toFixed(2));
    }

    // Валовая прибыль = К перечислению от WB - расходы на единицу
    const grossProfitIndex = getIndex('Валовая прибыль');
    const toPay = getValue('К перечислению от WB');

    if (grossProfitIndex !== -1) {
        const gross = toPay - totalExpense;
        tableData[grossProfitIndex].value = parseFloat(gross.toFixed(2));
    }

    // Маржинальность (%) = Валовая прибыль / Цена до СПП * 100
    const marginIndex = getIndex('Маржинальность');
    const basePrice = getValue('Цена на WB наша');

    if (marginIndex !== -1 && basePrice > 0) {
        const gross = getValue('Валовая прибыль');
        const margin = (gross / basePrice) * 100;
        tableData[marginIndex].percent = parseFloat(margin.toFixed(2));
        tableData[marginIndex].value = parseFloat(margin.toFixed(2));
    }

    // ROI = Валовая прибыль / себестоимость * 100
    const roiIndex = getIndex('ROI за единицу');

    if (roiIndex !== -1 && costPrice > 0) {
        const gross = getValue('Валовая прибыль');
        const roi = (gross / costPrice) * 100;
        tableData[roiIndex].percent = parseFloat(roi.toFixed(2));
    }

    return { ...formValues, tableData };
};
