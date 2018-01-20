import React, { Component } from 'react';

import './styles.css';


function CustomHeaderField(props) {
    return (
        <div className="section-title">{ props.header }</div>
    );
}


export default CustomHeaderField;

