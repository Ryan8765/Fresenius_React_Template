import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.js';


class App extends Component {

    constructor(props) {
        super(props);


        this.quickbase = new window.QuickBase({
            realm: config.REALM,
            userToken: config.USER_TOKEN,
            appToken: config.APPLICATION_TOKEN
        });


    }

    componentWillMount() {

        this.quickbase.api('API_DoQuery', {
            dbid: 'bkcdrryt2',
            includeRids: true
        }).then((results)=>{
            alert("results in Quick Base " + JSON.stringify(results));
        }).catch((err)=>{
            console.log(err);
        });

    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
