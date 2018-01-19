import React, { Component } from 'react';

import logo from "./img/Fresenius.jpg";
import './styles.css';


function FreseniusHeader(props) {
    return (
        <div id = "header">
            <div className="logo">
                <img className="logo-image" src={logo} alt="Fresenius Logo" />
            </div>
        </div>
    );
}


export default FreseniusHeader;

