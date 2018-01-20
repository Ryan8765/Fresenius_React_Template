import React, { Component } from 'react';

//custom imports
import './styles/styles.css';
import LoadingGif from "../loading/loading.js";
import FreseniusHeader from "../header/Header.js";
import DynamicContent from "../dynamic_content/DynamicContent";
import DynamicTitle from "../dynamic_title/DynamicTitle";
import config from "../../config";
import queryString from "query-string";




class Content extends Component {

    constructor(props) {
        super(props);

        //initialize QuickBase
        this.quickbase = new window.QuickBase({
            realm: config.REALM,
            userToken: config.USER_TOKEN,
            appToken: config.APPLICATION_TOKEN
        });
        
        this.state = {
            //determines if page is loading (shows gif if so)
            pageLoading: true
        };
    }


    /**
     *  Get QB Data and set to props
     */
    componentWillMount() {
        

        //get Query Parameters
        const getQueryString = queryString.parse(window.location.search);
        const { crid, rid } = getQueryString; 
        //fids
        const {
                fieldName,
                fieldType,
                fieldFid,
                fieldTbleDbid,
                fieldLabel,
                fieldOrderNumber,
                fieldHelpText,
                keyFieldFid,
                uiName,
                uiTblDbid
            } = config.tbl_uiFields.fids;      
        

        this.quickbase.api('API_DoQuery', {
            dbid: config.tbl_uiFields.dbid,
            clist: `${fieldName}.${fieldType}.${fieldFid}.${fieldTbleDbid}.${fieldLabel}.${fieldHelpText}.${keyFieldFid}.${uiName}.${uiTblDbid}`,
            slist: fieldOrderNumber,
            query: `{'6'.EX.'${crid}'}`
        }).then((results) => {

            const records = results.table.records;
            //if records exist - add array to props, else throw alert to user
            if( records.length > 0 ) {
                this.setState({
                    userInterfaceFieldRecords: records
                });

                this.setState({
                    pageLoading: false
                });
            } else {
                alert('No Records Found!  Check configuration in Quick Base');
            }

        }).catch((err) => {
            console.log('Error' + JSON.stringify(err));
            // object returned if there is an error: {"code":83,"name":"Invalid error code: 83","action":"API_DoQuery"}
        });

    }

   

    /**
     *   When page is loading, show loading gif until data populates content.
     */
    pageLoadingRender() {
        const { userInterfaceFieldRecords } = this.state;
        
        if( this.state.pageLoading ) {
            return (
                <LoadingGif />
            );
        } else {
            return (
                <DynamicContent userInterfaceFieldRecords={ userInterfaceFieldRecords } />
            );
        }
    }

    render() {
        return (  
            <div id="main">

                {/* Image Header */}
                <FreseniusHeader />

                {/* White Title */}
                <DynamicTitle title="Dynamic Title" />
                
                
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div id="content">
                            { this.pageLoadingRender() }
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}


export default Content;
