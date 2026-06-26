"use strict";
var UnitType;
(function (UnitType) {
    UnitType["TEMPERATURE"] = "temperatura";
    UnitType["WEIGHT"] = "peso";
    UnitType["DISTANCE"] = "distancia";
    UnitType["COOKING"] = "culinaria";
    UnitType["CURRENCY"] = "moeda";
})(UnitType || (UnitType = {}));
const units = {
    [UnitType.TEMPERATURE]: [
        { id: 'celsius', name: 'Celsius', symbol: '°C' },
        { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
        { id: 'kelvin', name: 'Kelvin', symbol: 'K' }
    ],
    [UnitType.WEIGHT]: [
        { id: 'kg', name: 'Quilograma', symbol: 'kg' },
        { id: 'g', name: 'Grama', symbol: 'g' },
        { id: 'mg', name: 'Miligrama', symbol: 'mg' },
        { id: 'lb', name: 'Libra', symbol: 'lb' },
        { id: 'oz', name: 'Onça', symbol: 'oz' }
    ],
    [UnitType.DISTANCE]: [
        { id: 'km', name: 'Quilômetro', symbol: 'km' },
        { id: 'm', name: 'Metro', symbol: 'm' },
        { id: 'cm', name: 'Centímetro', symbol: 'cm' },
        { id: 'mm', name: 'Milímetro', symbol: 'mm' },
        { id: 'mi', name: 'Milha', symbol: 'mi' },
        { id: 'yd', name: 'Jarda', symbol: 'yd' },
        { id: 'ft', name: 'Pé', symbol: 'ft' },
        { id: 'in', name: 'Polegada', symbol: 'in' }
    ],
    [UnitType.COOKING]: [
        { id: 'cup', name: 'Xícara', symbol: 'xíc' },
        { id: 'tbsp', name: 'Colher de Sopa', symbol: 'colher (sopa)' },
        { id: 'tsp', name: 'Colher de Chá', symbol: 'colher (chá)' },
        { id: 'ml', name: 'Mililitro', symbol: 'ml' },
        { id: 'l', name: 'Litro', symbol: 'L' },
        { id: 'g', name: 'Grama', symbol: 'g' },
        { id: 'kg', name: 'Quilograma', symbol: 'kg' }
    ],
    [UnitType.CURRENCY]: [
        { id: 'brl', name: 'Real', symbol: 'R$' },
        { id: 'usd', name: 'Dólar', symbol: 'US$' },
        { id: 'eur', name: 'Euro', symbol: '€' },
        { id: 'gbp', name: 'Libra Esterlina', symbol: '£' },
        { id: 'jpy', name: 'Iene', symbol: '¥' }
    ]
};
const weightToGrams = {
    kg: 1000,
    g: 1,
    mg: 0.001,
    lb: 453.592,
    oz: 28.3495
};
const distanceToMeters = {
    km: 1000,
    m: 1,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254
};
const cookingToMl = {
    cup: 240,
    tbsp: 15,
    tsp: 5,
    ml: 1,
    l: 1000
};
const cookingGrams = {
    cup: 120,
    tbsp: 15,
    tsp: 5,
    g: 1,
    kg: 1000
};
function convertTemperature(value, from, to) {
    let celsius;
    switch (from) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            celsius = value;
    }
    switch (to) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9 / 5 + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            return celsius;
    }
}
function convertWeight(value, from, to) {
    const grams = value * weightToGrams[from];
    return grams / weightToGrams[to];
}
function convertDistance(value, from, to) {
    const meters = value * distanceToMeters[from];
    return meters / distanceToMeters[to];
}
function convertCooking(value, from, to) {
    const volumeUnits = ['cup', 'tbsp', 'tsp', 'ml', 'l'];
    const weightUnits = ['g', 'kg'];
    if (volumeUnits.includes(from) && volumeUnits.includes(to)) {
        const ml = value * cookingToMl[from];
        return ml / cookingToMl[to];
    }
    else if (weightUnits.includes(from) && weightUnits.includes(to)) {
        const grams = value * cookingGrams[from];
        return grams / cookingGrams[to];
    }
    else if (volumeUnits.includes(from) && weightUnits.includes(to)) {
        const grams = value * cookingGrams[from];
        return grams / cookingGrams[to];
    }
    else if (weightUnits.includes(from) && volumeUnits.includes(to)) {
        const grams = value * cookingGrams[from];
        return grams / cookingGrams[to];
    }
    return value;
}
function convertCurrency(value, _from, _to, rate) {
    return value * rate;
}
function convert(type, value, from, to, rate) {
    switch (type) {
        case UnitType.TEMPERATURE:
            return convertTemperature(value, from, to);
        case UnitType.WEIGHT:
            return convertWeight(value, from, to);
        case UnitType.DISTANCE:
            return convertDistance(value, from, to);
        case UnitType.COOKING:
            return convertCooking(value, from, to);
        case UnitType.CURRENCY:
            if (rate === undefined)
                return value;
            return convertCurrency(value, from, to, rate);
        default:
            return value;
    }
}
let currentType = UnitType.TEMPERATURE;
let conversionHistory = [];
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const currencyRateDiv = document.getElementById('currencyRate');
const exchangeRateInput = document.getElementById('exchangeRate');
const tabBtns = document.querySelectorAll('.tab-btn');
function init() {
    setupTabs();
    updateUnits();
    setupEventListeners();
    performConversion();
}
function setupTabs() {
    tabBtns.forEach(btn => {
        const button = btn;
        button.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentType = button.dataset.type;
            updateUnits();
            if (currentType === UnitType.CURRENCY) {
                currencyRateDiv.style.display = 'block';
            }
            else {
                currencyRateDiv.style.display = 'none';
            }
            performConversion();
        });
    });
}
function updateUnits() {
    const currentUnits = units[currentType];
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    currentUnits.forEach((unit, index) => {
        const optionFrom = document.createElement('option');
        optionFrom.value = unit.id;
        optionFrom.textContent = `${unit.name} (${unit.symbol})`;
        fromUnitSelect.appendChild(optionFrom);
        const optionTo = document.createElement('option');
        optionTo.value = unit.id;
        optionTo.textContent = `${unit.name} (${unit.symbol})`;
        if (index === 1)
            optionTo.selected = true;
        toUnitSelect.appendChild(optionTo);
    });
}
function setupEventListeners() {
    convertBtn.addEventListener('click', performConversion);
    swapBtn.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);
    fromValueInput.addEventListener('input', performConversion);
    fromUnitSelect.addEventListener('change', performConversion);
    toUnitSelect.addEventListener('change', performConversion);
    exchangeRateInput.addEventListener('input', performConversion);
}
function performConversion() {
    const value = parseFloat(fromValueInput.value) || 0;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    let rate;
    if (currentType === UnitType.CURRENCY) {
        rate = parseFloat(exchangeRateInput.value) || 1;
    }
    const result = convert(currentType, value, fromUnit, toUnit, rate);
    toValueInput.value = formatNumber(result);
    addToHistory(value, fromUnit, result, toUnit);
}
function swapUnits() {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    const tempValue = fromValueInput.value;
    fromValueInput.value = toValueInput.value;
    toValueInput.value = tempValue;
    performConversion();
}
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return num.toFixed(4).replace(/\.?0+$/, '');
}
function addToHistory(fromValue, fromUnit, toValue, toUnit) {
    const unitList = units[currentType];
    const fromUnitObj = unitList.find(u => u.id === fromUnit);
    const toUnitObj = unitList.find(u => u.id === toUnit);
    const item = {
        type: currentType,
        fromValue,
        fromUnit: fromUnitObj?.symbol || fromUnit,
        toValue,
        toUnit: toUnitObj?.symbol || toUnit,
        timestamp: new Date()
    };
    conversionHistory.unshift(item);
    if (conversionHistory.length > 20) {
        conversionHistory.pop();
    }
    updateHistoryDisplay();
}
function updateHistoryDisplay() {
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">Nenhuma conversão ainda</p>';
        return;
    }
    historyList.innerHTML = conversionHistory.map(item => `
    <div class="history-item">
      <div class="history-content">
        <span class="history-type">${getTypeName(item.type)}</span>
        <span class="history-conversion">
          ${formatNumber(item.fromValue)} ${item.fromUnit} → ${formatNumber(item.toValue)} ${item.toUnit}
        </span>
      </div>
      <div class="history-time">${formatTime(item.timestamp)}</div>
    </div>
  `).join('');
}
function getTypeName(type) {
    const names = {
        [UnitType.TEMPERATURE]: 'Temperatura',
        [UnitType.WEIGHT]: 'Peso',
        [UnitType.DISTANCE]: 'Distância',
        [UnitType.COOKING]: 'Culinária',
        [UnitType.CURRENCY]: 'Moeda'
    };
    return names[type];
}
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function clearHistory() {
    conversionHistory = [];
    updateHistoryDisplay();
}
init();
