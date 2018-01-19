import React, { Component } from 'react';

// custom components
import Test from './components/test/Test';
import Content from "./components/content/Content";


class App extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="App">
                    <Content />
                </div>
            </div>
        );
    }
}

export default App;
