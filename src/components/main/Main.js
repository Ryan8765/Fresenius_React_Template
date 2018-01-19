import React, { Component } from 'react';
//custom components
    import Content from '../content/content.js';
    import LoadingGif from "../loading/loading.js";
    import FreseniusHeader from "../header/Header.js";



class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageLoading: false
        };
    }

    render() {
        return (

            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div id="main">
                        <FreseniusHeader />
                        <Content />
                    </div>
                </div>
            </div>

        );
    }
}


export default Main;
