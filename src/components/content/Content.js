import React, { Component } from 'react';

//custom imports
import './styles/styles.css';
import LoadingGif from "../loading/loading.js";
import FreseniusHeader from "../header/Header.js";
import DynamicContent from "../dynamic_content/DynamicContent";
import DynamicTitle from "../dynamic_title/DynamicTitle";
import config from "../../config";
import queryString from "query-string";
import { getClistRecords, getClist, associateFldValuesToFldRecords } from "../../helpers/qb_helpers";




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
            pageLoading: true,
            pageTitle: "Loading"
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
                fieldChoiceValues,
                uiName,
                uiTblDbid,
                customText
            } = config.tbl_uiFields.fids;
            
        
        // testing genresults table
        // this.quickbase.api('API_GenResultsTable', {
        //     dbid: config.tbl_uiFields.dbid,                       
        //     query: `{'6'.EX.'${crid}'}`,
        //     clist: `${fieldName}.${fieldType}.${fieldFid}.${fieldTbleDbid}.${fieldLabel}.${fieldHelpText}.${keyFieldFid}.${uiName}.${uiTblDbid}.${customText}`,
        //     slist: fieldOrderNumber,
        //     jsa: 1,
        //     fmt: 'structured'
        // }).then((results) => {
        //     console.log("TESTTTT");
            
        //     console.log(results);
            
        // }).catch((error) => {
        //     // Handle error
        // });
        
        //get user interfaceFieldRecords (refer to specs)
        this.quickbase.api('API_DoQuery', {
            dbid: config.tbl_uiFields.dbid,
            clist: `${fieldName}.${fieldType}.${fieldFid}.${fieldTbleDbid}.${fieldLabel}.${fieldHelpText}.${keyFieldFid}.${uiName}.${uiTblDbid}.${customText}.${fieldChoiceValues}`,
            slist: fieldOrderNumber,
            query: `{'6'.EX.'${crid}'}`,
            fmt: 'structured',
        }).then((results) => {
            const records = results.table.records;
            

            if (records.length < 1) return Promise.reject({ "code": 404, "name": "Check UI Fields configuration DBID bnda9x7py", "action": "API_DoQuery" });

            //filter records for "Custom Header" and "Custom Text" field types as they don't contain fid's
            var clistRecords = getClistRecords(records, 9);
            var clist = getClist(8, clistRecords);
            //table you will be editing dbid
            var tblDbid = clistRecords[0][uiTblDbid];
            //dyanmic page title
            var title = clistRecords[0][uiName];
            //table you will be editing dbid
            var keyFid = clistRecords[0][keyFieldFid];
            
            //if necessary data isn't provided - throw error modal
            if (clistRecords.length < 1 || !clist || !tblDbid || !keyFid) return Promise.reject({ "code": 404, "name": "Check URL parameters or UI Table/Fields configuration in Quick Base", "action": "API_DoQuery" });


            //get main table values ("fieldValues" variable in specs)
            this.quickbase.api('API_DoQuery', {
                dbid: tblDbid,
                clist: clist,
                query: `{'${keyFid}'.EX.'${rid}'}`,
                fmt: 'structured'
            }).then((res)=>{
                
                const fieldValues = res.table.records;
                
                

                if (fieldValues.length < 1) return Promise.reject({ "code": 404, "name": "No records were found.  Check the 'rid' parameter or the configuration in Quick Base (table DBID).", "action": "API_DoQuery" });
                
                //associate field values with UI fields records (step 5 specifications)
                var userInterfaceFieldRecords = associateFldValuesToFldRecords(fieldValues[0], records, fieldFid );

                
                


                //if records exist - add array to props, else throw alert to user
                this.setState({
                    userInterfaceFieldRecords
                });
                this.setState({
                    pageLoading: false
                });
                this.setState({
                    pageTitle: title
                });
                
        
            }).catch((err)=>{
                alert('Error1111' + JSON.stringify(err));
            });

        }).catch((err) => {
            console.log(err);
            
            alert('Error22222' + JSON.stringify(err));
            // object returned if there is an error: {"code":83,"name":"Invalid error code: 83","action":"API_DoQuery"}
        });

    }

   

    /**
     *   When page is loading, show loading gif until data populates content.
     */
    pageLoadingRender() {
        const { userInterfaceFieldRecords } = this.state;
        //get Query Parameters
        const getQueryString = queryString.parse(window.location.search);
        const { rid } = getQueryString; 
        
        if( this.state.pageLoading ) {
            return (
                <LoadingGif />
            );
        } else {
            return (
                <DynamicContent 
                    userInterfaceFieldRecords={ userInterfaceFieldRecords } 
                    rid={rid}/>
            );
        }
    }

    render() {
        return (  
            <div id="main">

                {/* Image Header */}
                <FreseniusHeader />

                {/* White Title */}
                <DynamicTitle title={this.state.pageTitle} />
                
                
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
