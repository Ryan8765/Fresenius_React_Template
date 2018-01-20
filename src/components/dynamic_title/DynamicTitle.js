import React, { Component } from 'react';

import './styles.css';


function DynamicTitle( props ) {
    return (
        <div className="centered white-header margin-top">
            { props.title }
        </div>
    );
}


export default DynamicTitle;

