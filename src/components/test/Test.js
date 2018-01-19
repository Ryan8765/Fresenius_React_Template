import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './test.css';
import config from '../../config.js';




class Test extends Component {

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
      <div>
        <h1 className="ryan-test">Testing some sass styling!!!</h1>
        <Button color="danger">Danger!</Button>
        <img src="https://recsfmc.quickbase.com/up/bjdgs9pep/g/rc3/ei/va/89%20(2).gif" alt=""/>
      </div>
    );
  }
}

export default Test;
