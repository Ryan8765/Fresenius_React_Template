import React, { Component } from 'react';


// import gif from "./img/loadingGif.gif";
import "./styles.css";


function LoadingGif (props) {

    return (

        <div id="loading-icon">
            <div className="loader">
            </div>
            <div className="loading-icon-text">
                Retrieving Data
            </div>
        </div>

    );


};


export default LoadingGif;





