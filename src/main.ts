enum UnitType {
  TEMPERATURE = 'temperatura',
  WEIGHT = 'peso',
  DISTANCE = 'distancia',
  COOKING = 'culinaria',
  CURRENCY = 'moeda'
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
}

interface ConversionHistoryItem {
  type: UnitType;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: Date;
}

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

const weightToGrams: Record<string, number> = {
  kg: 1000,
  g: 1,
  mg: 0.001,
  lb: 453.592,
  oz: 28.3495
};

const distanceToMeters: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254
};

const cookingToMl: Record<string, number> = {
  cup: 240,
  tbsp: 15,
  tsp: 5,
  ml: 1,
  l: 1000
};

const cookingGrams: Record<string, number> = {
  cup: 120,
  tbsp: 15,
  tsp: 5,
  g: 1,
  kg: 1000
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
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

function convertWeight(value: number, from: string, to: string): number {
  const grams = value * weightToGrams[from];
  return grams / weightToGrams[to];
}

function convertDistance(value: number, from: string, to: string): number {
  const meters = value * distanceToMeters[from];
  return meters / distanceToMeters[to];
}

function convertCooking(value: number, from: string, to: string): number {
  const volumeUnits = ['cup', 'tbsp', 'tsp', 'ml', 'l'];
  const weightUnits = ['g', 'kg'];
  
  if (volumeUnits.includes(from) && volumeUnits.includes(to)) {
    const ml = value * cookingToMl[from];
    return ml / cookingToMl[to];
  } else if (weightUnits.includes(from) && weightUnits.includes(to)) {
    const grams = value * cookingGrams[from];
    return grams / cookingGrams[to];
  } else if (volumeUnits.includes(from) && weightUnits.includes(to)) {
    const grams = value * cookingGrams[from];
    return grams / cookingGrams[to];
  } else if (weightUnits.includes(from) && volumeUnits.includes(to)) {
    const grams = value * cookingGrams[from];
    return grams / cookingGrams[to];
  }
  return value;
}

function convertCurrency(value: number, _from: string, _to: string, rate: number): number {
  return value * rate;
}

function convert(type: UnitType, value: number, from: string, to: string, rate?: number): number {
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
      if (rate === undefined) return value;
      return convertCurrency(value, from, to, rate);
    default:
      return value;
  }
}

let currentType: UnitType = UnitType.TEMPERATURE;
let conversionHistory: ConversionHistoryItem[] = [];

const fromValueInput = document.getElementById('fromValue') as HTMLInputElement;
const toValueInput = document.getElementById('toValue') as HTMLInputElement;
const fromUnitSelect = document.getElementById('fromUnit') as HTMLSelectElement;
const toUnitSelect = document.getElementById('toUnit') as HTMLSelectElement;
const convertBtn = document.getElementById('convertBtn') as HTMLButtonElement;
const swapBtn = document.getElementById('swapBtn') as HTMLButtonElement;
const clearHistoryBtn = document.getElementById('clearHistoryBtn') as HTMLButtonElement;
const historyList = document.getElementById('historyList') as HTMLDivElement;
const currencyRateDiv = document.getElementById('currencyRate') as HTMLDivElement;
const exchangeRateInput = document.getElementById('exchangeRate') as HTMLInputElement;
const tabBtns = document.querySelectorAll('.tab-btn');

function init() {
  setupTabs();
  updateUnits();
  setupEventListeners();
  performConversion();
}

function setupTabs() {
  tabBtns.forEach(btn => {
    const button = btn as HTMLButtonElement;
    button.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      currentType = button.dataset.type as UnitType;
      updateUnits();
      
      if (currentType === UnitType.CURRENCY) {
        currencyRateDiv.style.display = 'block';
      } else {
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
    if (index === 1) optionTo.selected = true;
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
  let rate: number | undefined;
  
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

function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(4).replace(/\.?0+$/, '');
}

function addToHistory(fromValue: number, fromUnit: string, toValue: number, toUnit: string) {
  const unitList = units[currentType];
  const fromUnitObj = unitList.find(u => u.id === fromUnit);
  const toUnitObj = unitList.find(u => u.id === toUnit);
  
  const item: ConversionHistoryItem = {
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

function getTypeName(type: UnitType): string {
  const names: Record<UnitType, string> = {
    [UnitType.TEMPERATURE]: 'Temperatura',
    [UnitType.WEIGHT]: 'Peso',
    [UnitType.DISTANCE]: 'Distância',
    [UnitType.COOKING]: 'Culinária',
    [UnitType.CURRENCY]: 'Moeda'
  };
  return names[type];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function clearHistory() {
  conversionHistory = [];
  updateHistoryDisplay();
}

init();
