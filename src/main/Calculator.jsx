import React, { Component } from 'react';
import './Calculator.css';

import Button from '../components/Button';
import Display from '../components/Display';

const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0,
    history: ''
}

export default class Calculator extends Component {

    state = { ...initialState };

    constructor(props) {
        super(props);
        this.clearMemory = this.clearMemory.bind(this);
        this.setOperation = this.setOperation.bind(this);
        this.addDigit = this.addDigit.bind(this);
        this.backspace = this.backspace.bind(this);
    }

    doOperation(operation, firstValue, secondValue) {
        switch (operation) {
            case '+':
                return parseFloat(firstValue) + parseFloat(secondValue);
            case '-':
                return parseFloat(firstValue) - parseFloat(secondValue);
            case '*':
                return parseFloat(firstValue) * parseFloat(secondValue);
            case '/':
                return parseFloat(firstValue) / parseFloat(secondValue);
            default: return undefined;
        }
    }

    clearMemory() {
        this.setState({ ...initialState });
    }

    lastIndexIsNotaOperation() {
        const history = this.state.history.trim();
        const historyLength = history.length;
        return !(history[historyLength - 1] === '+' || history[historyLength - 1] === '-' ||
            history[historyLength - 1] === '/' || history[historyLength - 1] === '*');
    }

    isValideSetOperation() {
        const historyIsNotEmpty = this.state.history.length >= 1;
        const historyLastIndexIsaOperation = this.lastIndexIsNotaOperation();

        return historyIsNotEmpty && historyLastIndexIsaOperation
    }

    setOperation(operation) {
        if (!this.isValideSetOperation()) return;
        if (this.state.current === 0) {
            let history = '';

            if (this.state.history.includes('=')) {
                history = this.state.history.split('=')[1] += operation + ' '
            } else {
                history += this.state.history + ' ' + operation + ' ';
            }

            const newState = {
                current: 1,
                clearDisplay: true,
                operation: operation,
                history: history
            }

            this.setState(newState);
        } else {
            const isEquals = operation === '=';
            const result = this.doOperation(this.state.operation, this.state.values[0], this.state.values[1])

            const values = [...this.state.values];
            values[0] = result;
            values[1] = 0;

            const newState = {
                clearDisplay: true,
                operation: operation,
                current: isEquals ? 0 : 1,
                displayValue: result,
                values: isEquals ? [result, 0] : values,
                history: this.state.history + ' ' + operation + ' ' + `${isEquals ? result ?? '' : ''}` + ' '
            }
            this.setState(newState);
            console.log(this.state.values)
        }
    }

    addDigit(n) {

        if (n === '.' && this.state.displayValue.includes('.')) return;

        const history = this.state.operation === '=' ? n : this.state.history + n

        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay;
        const currentValue = clearDisplay ? '' : this.state.displayValue
        const displayValue = currentValue + n
        this.setState({ displayValue, clearDisplay: false, history: history })

        if (n !== '.') {
            const i = this.state.current
            const newValues = parseFloat(displayValue)
            const values = [...this.state.values]
            values[i] = newValues
            console.log(values);
            this.setState({ values })
        }
    }

    backspace() {
        const currentValue = this.state.displayValue;
        const currentValueLength = currentValue.length;
        let newValue;
        let history;

        if (currentValueLength > 1) {
            newValue = currentValue.slice(0, currentValue.length - 1)
        } else if (this.state.current === 0) {
            newValue = '0'
        } else {
            newValue = '';
        }

        if (this.state.current === 0) {
            history = newValue;
        } else {
            history = newValue.split(' ');
        }

        this.setState({ displayValue: newValue, history: history });
    }

    render() {
        return <div className='calculator'>
            <Display value={this.state.displayValue} history={this.state.history} />
            <Button label="AC" click={this.clearMemory} double />
            <Button label="<" click={this.backspace} />
            <Button label="/" click={this.setOperation} operation />
            <Button label="7" click={this.addDigit} />
            <Button label="8" click={this.addDigit} />
            <Button label="9" click={this.addDigit} />
            <Button label="*" click={this.setOperation} operation />
            <Button label="4" click={this.addDigit} />
            <Button label="5" click={this.addDigit} />
            <Button label="6" click={this.addDigit} />
            <Button label="-" click={this.setOperation} operation />
            <Button label="1" click={this.addDigit} />
            <Button label="2" click={this.addDigit} />
            <Button label="3" click={this.addDigit} />
            <Button label="+" click={this.setOperation} operation />
            <Button label="0" click={this.addDigit} double />
            <Button label="." click={this.addDigit} />
            <Button label="=" click={this.setOperation} operation />
        </div>
    }
}