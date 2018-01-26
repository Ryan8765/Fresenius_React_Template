import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

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
            modal: false,
            //determines if page is loading (shows gif if so)
            pageLoading: true,
            pageTitle: "Loading",
            //handles modal content
            modalContent: {
                //should modal show error - or regular popup
                isError: false,
                header: "Data Saved!",
                modalBody: 'Your updates saved successfully!  You can click the "Exit" button below to continue updating, or you can close this window now.',
                error: {
                    code: null,
                    name: null,
                    action: null,
                    dbid: null
                }

            }
        };


        this.toggleModal = this.toggleModal.bind(this);

    }


    /**
     * Handles all logic for QB errors and showing modal and updating state
     * @param {Object} error - returned error object
     * @param {String} dbid - DBID of the table queried for
     */
    showQbErrorModal(error, dbid) {

        var code = error.code ? error.code : "Undefined";
        var name = error.name ? error.name : "Undefined";
        var action = error.action ? error.action : "Undefined";
        var error = {
            code,
            name,
            action,
            dbid
        };

        this.setState({
            modalContent: {
                ...this.state.modalContent,
                isError: true
            }
        }, () => {
            this.setState({
                modalContent: {
                    ...this.state.modalContent,
                    error
                }
            }, () => {
                this.setState({
                    modal: true
                });
            });
        });

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
                customText,
                readOnlyField
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
            clist: `${fieldName}.${fieldType}.${fieldFid}.${fieldTbleDbid}.${fieldLabel}.${fieldHelpText}.${keyFieldFid}.${uiName}.${uiTblDbid}.${customText}.${fieldChoiceValues}.${readOnlyField}`,
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
                
        
            }).catch((error)=>{
                
                //handles showing error details from QB API call and rendering modal
                this.showQbErrorModal( error, tblDbid );
                
            });

        }).catch((err) => {
            
            this.showQbErrorModal(err, config.tbl_uiFields.dbid);
            // object returned if there is an error: {"code":83,"name":"Invalid error code: 83","action":"API_DoQuery"}
        });

    }



    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
        this.setState({
            modalContent: {
                ...this.state.modalContent,
                isError: false
            }
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


    /**
     * Handles rendering modal - handles errors and confirmations.
     * @param {Object} modalContent - Object containing modal content details
     */
    renderModal(modalContent) {
        //renderModalget the necessary data off the modalState object
        const { isError, header, modalBody, error } = this.state.modalContent;

        if (isError) {
            var today = new Date();
            var date = (today.getMonth() + 1)
                + '-' + today.getDate()
                + '-' + today.getFullYear();

            var time = today.getHours() + ":" + today.getMinutes();
            var dateTime = date + ' ' + time;
            return (
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}><span className="text-danger">Error</span></ModalHeader>
                        <ModalBody>
                            <div className="alert alert-danger">
                                We are sorry, we have received the following error!
                                <br />
                                <br />
                                DBID: {error.dbid} <br />
                                Record ID#: {this.props.rid} <br />
                                Action: {error.action} <br />
                                Error Code: {error.code} <br />
                                Details: {error.name} <br />
                                Date/Time: {dateTime} <br />
                                <br />
                                Please close or refresh this window and try again.  If the issue persists, please take a screen shot of this window and send to your system administrator at Charles.Giles@fmc-na.com.  Please include in the email, the project you were working on, which browser you are using, and any other pertinent details.  This will help us to debug and correct this error in a timely manner. Thank You!
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggleModal}>Exit</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        } else {
            return (
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>{header}</ModalHeader>
                        <ModalBody>
                            {modalBody}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggleModal}>Exit</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }

    }//end rendermodal

    render() {
        const {modalContent} = this.state;
        return (  
            <div id="main">

                {/* Image Header */}
                <FreseniusHeader />

                {/* White Title */}
                <DynamicTitle title={this.state.pageTitle} />
                
                {/* modal */}
                {this.renderModal(modalContent)}
                
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
