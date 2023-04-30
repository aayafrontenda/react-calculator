import React from 'react'
import { ACTIONS } from './App'

export default function DigitButton({ dispatch, digit }) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit: digit} })}>
      <span style={{marginLeft: 'auto', marginRight: 'auto'}}>{digit}</span>
    </button>
  )
}
