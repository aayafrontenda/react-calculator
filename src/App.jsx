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
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
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

      if (payload.digit === '.' && state.currentOperand.toString().includes('.'))
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
      return prev + curr;

    case '-':
      return prev - curr;

    case '÷':
      return prev / curr;

    case '*':
      return prev * curr;
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation, isEvaluated }, dispatch] = useReducer(reducer, {});
  return (
    <div className="App">
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>{previousOperand}{operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button onClick={() => dispatch({ type: ACTIONS.CLEAR })} className='span-two'>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton dispatch={dispatch} operation={'÷'}/>
        <DigitButton dispatch={dispatch} digit='1' />
        <DigitButton dispatch={dispatch} digit='2' />
        <DigitButton dispatch={dispatch} digit='3' />
        <OperationButton dispatch={dispatch} operation={'*'}/>
        <DigitButton dispatch={dispatch} digit='4' />
        <DigitButton dispatch={dispatch} digit='5' />
        <DigitButton dispatch={dispatch} digit='6' />
        <OperationButton dispatch={dispatch} operation={'+'}/>
        <DigitButton dispatch={dispatch} digit='7' />
        <DigitButton dispatch={dispatch} digit='8' />
        <DigitButton dispatch={dispatch} digit='9' />
        <OperationButton dispatch={dispatch} operation={'-'}/>
        <DigitButton dispatch={dispatch} digit={'.'} />
        <DigitButton dispatch={dispatch} digit='0' />
        <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })} className='span-two'>=</button>
      </div>
    </div>
  )
}

export default App
