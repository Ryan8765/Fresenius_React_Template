import React, { Component } from 'react';


import gif from "./img/loadingGif.gif";
import "./styles.css";


function LoadingGif (props) {

    return (

        <div id="loading-icon">
            <img src={gif} alt="Loading Gif"/>
        </div>

    );


};


export default LoadingGif;




