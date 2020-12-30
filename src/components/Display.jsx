import React from 'react';
import './Display.css';

export default props =>
    <>
        <div className="history">{props.history}</div>
        <div className="display">{props.value}</div>
    </>
