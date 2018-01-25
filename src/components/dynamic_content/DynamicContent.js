import React, { Component } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Popover,
    PopoverHeader,
    PopoverBody,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    InputGroup, 
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';



//custom imports
import './styles.css';
import FreseniusHeader from "../header/Header.js";
import DynamicTitle from "../dynamic_title/DynamicTitle";
import CustomHeader from "../fields/CustomHeader/CustomHeader";
import config from "../../config";
import { formatToInputValueDate } from "../../helpers/qb_helpers";


class DynamicContent extends Component {

    constructor(props) {
        super(props);   
        
        //initialize QuickBase
        this.quickbase = new window.QuickBase({
            realm: config.REALM,
            userToken: config.USER_TOKEN,
            appToken: config.APPLICATION_TOKEN
        });

        this.state = {
            popoverOpen: false,
            modal: false,
            userInterfaceFieldRecords: [],
            updateFields: [],
            isSaving: false,
            userUpdatedRecord: false,
            testRecord: {

                7: "Custom Text sadasfasfds",
                8: 342,
                9: "Checkbox",
                12: "RBS Stuff",
                17: 3,
                15: "Custom Header Test",
                16: "This is some field help text",
                18: "Test UI",
                19: "bid34343",
                rid: 2
            }
        };

        //bindings
        this.toggle = this.toggle.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }


    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentWillMount() {
        var records = this.props.userInterfaceFieldRecords;
        const { fieldType } = config.tbl_uiFields.fids;

        //convert epoch dates from QB to appropriate format for html in appropriate fields
        records = records.map((record)=>{
            if( record[fieldType] === "Date" ) {
                if( !record.value ) return record;
                record.value = formatToInputValueDate(record.value);
                return record;
            } else {
                return record;
            }
        });

        //initialize state
        this.setState({
            userInterfaceFieldRecords: records
        });
    }


    /**
     * 
     * @param {Array} userInterfaceFieldRecords - array of field objects
     */
    handleSave() {
        var {userInterfaceFieldRecords} = this.state;
        
        const { fieldFid, uiTblDbid } = config.tbl_uiFields.fids;
        var dbid = userInterfaceFieldRecords[0][uiTblDbid];
        
        
        
        
        var updatedFieldObject = null;
        var updatedFields = [];

        //filter to just updated fields
        updatedFields = userInterfaceFieldRecords.filter((field)=>{
            if( field.wasUpdated ) {
                return true;
            }
        });        

        //return array appropriate for api edit record
        var fieldValues = updatedFields.map((field)=>{
            updatedFieldObject = {
                fid: field[fieldFid],
                value: field.value
            };
            return updatedFieldObject;
        });

        //if there are fields to update
        if( fieldValues.length > 0 ) {

           

            //hide save button
            this.setState({
                isSaving: true
            });


            this.quickbase.api('API_EditRecord', {
                dbid,             
                key: parseInt(this.props.rid),                         
                fields: fieldValues,
                msInUTC: true
            }).then((results) => {
                console.log(results);

                //reset all "wasUpdated" values in state to disable save button
                var resetRecords = userInterfaceFieldRecords.map((record)=>{
                    record.wasUpdated = false;
                    return record;
                });

                this.setState({
                    userInterfaceFieldRecords: resetRecords
                });

                this.setState({
                    userUpdatedRecord: false
                });

                this.setState({
                    isSaving: false
                });

                //show modal save
                this.toggleModal();
                
            }).catch((error) => {
                console.log(error);
                alert(error);
            });
        }        
        
    }


    /**
     * Handles making fields read only.
     * @param {String} isReadOnly - value returned from field "Is read Only" in UI fields table QB.
     */
    readOnly( isReadOnly ) {
        if( isReadOnly ) return "disabled";
    }


    /**
     * Handles making the save button clickable (user must update a field first)
     * @param {Boolean} userUpdatedRecord - true/false
     */
    enableDisabledSave( userUpdatedRecord ) {
        if( !userUpdatedRecord ) return true;
    }


    /**
     * This handles any change in input elements.  It updates the fields value to the value typed into the input element.
     * @param {Object} e - input change event 
     * @param {Interger} fieldFid - the fid of the field in question that is being changed
     */
    handleChange(e, fieldFidInput) {
        
        const { fieldFid } = config.tbl_uiFields.fids;
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        

        var updatedUserInterfaceFieldRecords =  this.state.userInterfaceFieldRecords.map((record)=>{
            //make sure the correct field ID is being referenced - if so, update that value.
            
            if (record[fieldFid] == fieldFidInput ) {
                record.value = value;
                record.wasUpdated = true;
                return record;
            } else {
                return record;
            }
        });    
        
        this.setState({
            userInterfaceFieldRecords: updatedUserInterfaceFieldRecords
        });

        //handles enabling save button once user has changed something
        this.setState({
            userUpdatedRecord: true
        });
    }

    /**
     * Handles checking/unchecking checkbox
     * @param {Boolean} value - value of the checkbox field (1 or 0 or true or false)
     */
    isChecked( value ) {
        if( value == 1 || value == true ) {
            return "checked";
        }
    }


    /**
     * Renders help text if present for inputs in form.
     * @param {String} fieldHelpText 
     */
    renderHelpText(fieldHelpText) {
        if( fieldHelpText ) {
            return ( 
                <FormText>{ fieldHelpText }</FormText>
            );
        }
    }

    /**
     * Used to render field choice value options in the dropdown. 
     * @param {String} choiceValues - Value from UI interface fields "Field Choice Values" in QB. 
     */
    renderInputOptions( choiceValues ) {
        var choiceValues = choiceValues.split(";");

        if( choiceValues.length < 1 ) {
            alert('Check Quick Base configuration to make sure options in all dropdown fields were provided.')
            return false;
        };

        var optionElements = choiceValues.map(function(choice, i){
            return <option key={i} value={choice}>{choice}</option>;
        });

        optionElements.unshift(<option key="1000000" value="">Select</option>);
        

        return optionElements;
    }//end render input options


    renderSaveOrLoading( isSaving ) {
        const { userUpdatedRecord } = this.state;

        if( isSaving ) {
            return (
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="margin-top">
                            <div id="save-loading-icon">
                                <div className="save-loader">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="margin-top">
                            <Button 
                                color="success" 
                                block 
                                onClick={this.handleSave} 
                                disabled={this.enableDisabledSave(userUpdatedRecord)}>Save Updates</Button>
                        </div>
                    </div>
                </div>
            );
        }
        
    }


    /**
     * Handles rendering all types elements from field list from Quick Base
     * record - one record from UI fields table from QB
     */
    renderInputElements( record ) {
        //fids
        const {
                fieldName,
                fieldType,
                fieldFid,
                fieldTbleDbid,
                fieldLabel,
                fieldChoiceValues,
                fieldOrderNumber,
                fieldHelpText,
                customText,
                keyFieldFid,
                uiName,
                uiTblDbid,
                readOnlyField
            } = config.tbl_uiFields.fids;
        //field type of record from QB
        const recordFieldType = record[fieldType];
        const recordFieldLabel = record[fieldLabel];
        const recordFieldHelpText = record[fieldHelpText];
        const recordCustomText = record[customText];
        const recordfieldChoiceValues = record[fieldChoiceValues];
        const recordFieldFid = record[fieldFid];
        const recordReadOnly = record[readOnlyField];
        
        var recordValue = record.value;
        if (!recordValue) recordValue = ""; 
        
            
        switch( recordFieldType ) {
            case "Checkbox":
                return(
                    <FormGroup key={recordFieldFid} check>
                        <Label check>
                            <Input 
                            type="checkbox" 
                            checked={this.isChecked( recordValue )}
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            disabled={this.readOnly(recordReadOnly)}/>
                            { recordFieldLabel }
                        </Label>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Date":
                return (
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleDate">{ recordFieldLabel }</Label>
                        <Input 
                            type="date" 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue}
                            disabled={this.readOnly(recordReadOnly)}/>
                        {this.renderHelpText( recordFieldHelpText )}
                    </FormGroup>
                );
            case "Choice":
                
                return (
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleSelect">{recordFieldLabel}</Label>
                        <Input type="select" 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue} disabled={this.readOnly(recordReadOnly)}>
                            {this.renderInputOptions(recordfieldChoiceValues )}
                        </Input>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Number":
                return(
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleText">{recordFieldLabel}</Label>
                        <Input 
                            type="number" 
                            step='0.01' 
                            placeholder='0.00' 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue}
                            disabled={this.readOnly(recordReadOnly)}/>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Currency":
                
                //convert to decimals
                if( typeof recordValue !== "string" ) {
                    recordValue = recordValue.toFixed(2);
                }
                return(
                    <div key={recordFieldFid}>
                        <div className="form-group">
                            <Label>{recordFieldLabel}</Label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">$</span>
                                </div>
                                <Input 
                                    type="number" 
                                    id="exampleText" 
                                    step='0.01' 
                                    placeholder='$0.00' 
                                    value={recordValue}
                                    onChange={(e) => this.handleChange(e, recordFieldFid)}
                                    disabled={this.readOnly(recordReadOnly)}/>
                            </div>
                            {this.renderHelpText(recordFieldHelpText)}
                        </div>
                    </div>
                );
            case "Notes":
                return(
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleText"> {recordFieldLabel} </Label>
                        <Input 
                            type="textarea" 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue}
                            disabled={this.readOnly(recordReadOnly)}/>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Text":
                return(
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleText"> {recordFieldLabel} </Label>
                        <Input 
                            type="text" 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue} 
                            disabled={this.readOnly(recordReadOnly)}/>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Custom Text":
                return(
                    <p className="margin-top-sm" key={recordFieldFid}>{recordCustomText}</p>
                );
            case "Custom Heading":
                return (
                    <div className="section-title" key={recordFieldFid}>{recordCustomText}</div>
                );
            default: 
                break;
        }//end switch
    

    }//end renderInputElements




    render() {
        const { userInterfaceFieldRecords, isSaving } = this.state; 

        //get all HTML elements
        var inputElements = userInterfaceFieldRecords.map(record=>this.renderInputElements(record)); 
        
        return (
            <div>
                
                { inputElements }

                

                {/*modal*/}
                <div>
                    {/* <Button color="danger" onClick={this.toggleModal}>Modal</Button> */}
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                        <ModalHeader toggle={this.toggleModal}>Data Saved!</ModalHeader>
                        <ModalBody>
                            Your updates saved successfully!  You can click the "Exit" button below to continue updating, or you can close this window now.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggleModal}>Exit</Button>
                        </ModalFooter>
                    </Modal>
                </div>

                <div className="margin-top">
                    {this.renderSaveOrLoading(isSaving)}
                </div>
            </div>                
        );
    }
}


export default DynamicContent;