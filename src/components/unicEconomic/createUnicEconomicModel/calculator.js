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

    // 7. Себестоимость
    // const costIndex = getIndex('Себестоимость итого');
    // const cost = costIndex !== -1 ? num(tableData[costIndex].value) : 0;

    // 8. Прибыль
    const profitIndex = getIndex('Прибыль');
    if (profitIndex !== -1) {
        const profit = remainingPrice - cost;
        tableData[profitIndex].value = parseFloat(profit.toFixed(1));
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

    //Хранение
    const saveOnStockDayIndex = getIndex(' - Цена хранения за первый литр');
    const saveOnStockMounthIndex = getIndex(' - Цена за хранение в месяц');

    const saveKeff = getIndex(' - Коэффициент храненеи на складе');

    //хранение

    // (стоимость хранения за литр * 1 + стоимость хранения за доп литр * количество доп литров) * коэффицент склада * предполгаемый срок хранения
    if (saveOnStockDayIndex !== -1 && saveOnStockMounthIndex !== -1 && saveKeff !== -1) {
        const priceToLirt = num(tableData[priceDopLitr].value);
        const priceToDopLirt = num(tableData[priceDopLitr].value);
        const saveKeffValue = num(tableData[saveKeff].percent);

        const savetyPriceDay = (priceToLirt + priceToDopLirt) * (saveKeffValue / 100);
        tableData[saveOnStockDayIndex].value = parseFloat(savetyPriceDay.toFixed(2));
        tableData[saveOnStockMounthIndex].value = parseFloat(
            parseFloat(savetyPriceDay.toFixed(2)) * 30
        ).toFixed(2);
    }

    const finalWbKomiccia = getIndex('Итоговая комиссия WB');

    if (finalWbKomiccia !== -1) {
    }

    return { ...formValues, tableData };
};
