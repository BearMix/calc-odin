const display = document.getElementById('display');
const previousOperandDisplay = document.getElementById('previous-operand');
const numberButtons = document.querySelectorAll('.number');
const add = document.getElementById('add');
const subtract = document.getElementById('subtract');
const multiply = document.getElementById('multiply');
const divide = document.getElementById('divide');
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
const clearEntry = document.getElementById('clear-entry');
const backspace = document.getElementById('backspace');
const percent = document.getElementById('percent');
const reciprocal = document.getElementById('reciprocal');
const square = document.getElementById('square');
const squareRoot = document.getElementById('square-root');
const negate = document.getElementById('negate');

let currentOperand = '';
let previousOperand = '';
let operation = null;

const operands = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    '%': (a, b) => a % b,
    reciprocal: (a) => 1 / a,
    square: (a) => a * a,
    squareRoot: (a) => Math.sqrt(a),
};

const operationSymbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
    '%': '%',
    reciprocal: '1/x',
    square: 'x²',
    squareRoot: '√x',
};

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === '.' && currentOperand.includes('.')) return;
        currentOperand += value;
        updateDisplay();
    });
});

add.addEventListener('click', () => handleOperation('add'));
subtract.addEventListener('click', () => handleOperation('subtract'));
multiply.addEventListener('click', () => handleOperation('multiply'));
divide.addEventListener('click', () => handleOperation('divide'));
percent.addEventListener('click', () => handleOperation('%'));
reciprocal.addEventListener('click', () => singleOperation('reciprocal'));
square.addEventListener('click', () => singleOperation('square'));
squareRoot.addEventListener('click', () => singleOperation('squareRoot'));
negate.addEventListener('click', negateNumber);
backspace.addEventListener('click', singleClear);
clear.addEventListener('click', clearDisplay);
clearEntry.addEventListener('click', clearCurrent);

equals.addEventListener('click', () => {
    calculate();
    updateDisplay(true);
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    if (!isNaN(key) || key === '.') {
        if (key === '.' && currentOperand.includes('.')) return;
        currentOperand += key;
        updateDisplay();
    } else if (key === 'Backspace') {
        singleClear();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        if (previousOperand && currentOperand) {
            calculate();
            updateDisplay(true);
        }
    } else if (key === '+') {
        handleOperation('add');
    } else if (key === '-') {
        handleOperation('subtract');
    } else if (key === '*') {
        handleOperation('multiply');
    } else if (key === '/') {
        handleOperation('divide');
    }
});


function handleOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function singleOperation(op) {
    if (currentOperand === '') return;
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    currentOperand = formatResult(operands[op](current));
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function calculate() {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    if (operation === 'divide' && current === 0) {
        currentOperand = 'Error: Division by 0';
    } else {
        currentOperand = formatResult(operands[operation](prev, current));
    }
    operation = null;
    previousOperand = '';
}

function formatResult(result) {
    return Number.isInteger(result) ? result.toString() : result.toFixed(2).toString();
}

function clearDisplay() {
    currentOperand = '';
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function singleClear() {
    currentOperand = currentOperand.slice(0, -1);
    updateDisplay();
}

function clearCurrent() {
    currentOperand = '';
    updateDisplay();
}

function negateNumber() {
    if (currentOperand === '') return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
    updateDisplay();
}

function updateDisplay(finalResult = false) {
    display.value = currentOperand;
    previousOperandDisplay.textContent = finalResult ? '' : `${previousOperand} ${(operation ? operationSymbols[operation] : '')}`;
}
