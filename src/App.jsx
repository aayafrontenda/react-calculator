import React, { useReducer } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear', 
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

// sum of floating point numbers
function add(a, b) {
  var c, d, e;
  try {
      c = a.toString().split(".")[1].length;
  } catch (f) {
      c = 0;
  }
  try {
      d = b.toString().split(".")[1].length;
  } catch (f) {
      d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

// Subtract floating point numbers
function sub(a, b) {
  var c, d, e;
  try {
      c = a.toString().split(".")[1].length;
  } catch (f) {
      c = 0;
  }
  try {
      d = b.toString().split(".")[1].length;
  } catch (f) {
      d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

// Multiply floating point numbers
function mul(a, b) {
  var c = 0,
      d = a.toString(),
      e = b.toString();
  try {
      c += d.split(".")[1].length;
  } catch (f) {}
  try {
      c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// divide floating point
function div(a, b) {
  var c, d, e = 0,
      f = 0;
  try {
      e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
      f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

function reducer(state, { type, payload }) {
  if (state.currentOperand === '{error}' || (state.previousOperand && state.previousOperand.toString().includes('error')))
    return {};

  switch (type) {
    case ACTIONS.ADD_DIGIT:      
      if (state.isEvaluated) {
        return {
          // ...state, currentOperand: currentOperand + payload.digit
          ...state, 
          currentOperand: payload.digit,
          previousOperand: null,
          isEvaluated: false
          // currentOperand || '' setting '' as a default string
        }
      }
      
      if (payload.digit === '0' && state.currentOperand === '0')
        return state;

      if (payload.digit === '.' && state.currentOperand !== null && state.currentOperand.toString().includes('.'))
        return state;
      
      return {
        // ...state, currentOperand: currentOperand + payload.digit
        ...state, 
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
        // currentOperand || '' setting '' as a default string
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand === undefined)
        return state;

      if (state.currentOperand.toString().length == 1) {
        return {
          ...state,
          currentOperand: '0'
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.toString().slice(0, state.currentOperand.toString().length - 1)
      }
    case ACTIONS.CHOOSE_OPERATION: 
      if (state.isEvaluated) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
          isEvaluated: false
        }
      }

      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null
        }
      }

      return {
        ...state, 
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null
      }
    case ACTIONS.CLEAR: 
      return {}

    case ACTIONS.EVALUATE: 
      if (state.isEvaluated)
        return state;

      if (!state.currentOperand || !state.previousOperand || !state.operation)
        return state;

      return {
        ...state,
        previousOperand: `${state.previousOperand}${state.operation}${state.currentOperand}=${evaluate(state)}`,
        currentOperand: evaluate(state),
        operation: null,
        isEvaluated: true
      }
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
});

function formatOperand(operand) {
  if (operand == null) 
    return;
  
  const [integer, decimal] = operand.toString().split('.');

  if (decimal == null) 
    return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; 
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr))
    return '';

  switch(operation) {
    case '+':
      return add(prev, curr);

    case '-':
      return sub(prev, curr);

    case '÷':
      if (curr == 0) {
        return '{error}';
      }
       
      return div(prev, curr);

    case '*':
      return mul(prev, curr);
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation, isEvaluated }, dispatch] = useReducer(reducer, {});
  return (
    <div className="App">
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>{previousOperand}{operation}</div>
          <div id='display' className='current-operand'>{(currentOperand !== '{error}' && (currentOperand && !currentOperand.toString().includes('-'))) ? formatOperand(currentOperand) : currentOperand}</div>
        </div>
        <button id='clear' onClick={() => dispatch({ type: ACTIONS.CLEAR })} className='span-two'>AC</button>
        <button id='delete' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton id='divide' dispatch={dispatch} operation={'÷'}/>
        <DigitButton id='one' dispatch={dispatch} digit='1' />
        <DigitButton id='two' dispatch={dispatch} digit='2' />
        <DigitButton id='three' dispatch={dispatch} digit='3' />
        <OperationButton id='multiply' dispatch={dispatch} operation={'*'}/>
        <DigitButton id='four' dispatch={dispatch} digit='4' />
        <DigitButton id='five' dispatch={dispatch} digit='5' />
        <DigitButton id='six' dispatch={dispatch} digit='6' />
        <OperationButton id='add' dispatch={dispatch} operation={'+'}/>
        <DigitButton id='seven' dispatch={dispatch} digit='7' />
        <DigitButton id='eight' dispatch={dispatch} digit='8' />
        <DigitButton id='nine' dispatch={dispatch} digit='9' />
        {
          (operation != '*' && operation != '÷') 
          ? <OperationButton id='subtract' dispatch={dispatch} operation={'-'}/>
          : <DigitButton id='substract' dispatch={dispatch} digit='-' />
        }
        <DigitButton id='decimal' dispatch={dispatch} digit={'.'} />
        <DigitButton id='zero' dispatch={dispatch} digit='0' />
        <button id='equals' onClick={() => dispatch({ type: ACTIONS.EVALUATE })} className='span-two'>=</button>
      </div>
    </div>
  )
}

export default App
