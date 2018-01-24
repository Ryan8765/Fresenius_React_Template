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

            console.log(dbid);
            console.log(parseInt(this.props.rid));

            
                

            this.quickbase.api('API_EditRecord', {
                dbid,             
                key: parseInt(this.props.rid),                         
                fields: fieldValues,
                msInUTC: true
            }).then((results) => {
                console.log(results);
                
            }).catch((error) => {
                console.log(error);
                alert(error);
            });
        }        
        
    }


    /**
     * This handles any change in input elements.  It updates the fields value to the value typed into the input element.
     * @param {Object} e - input change event 
     * @param {Interger} fieldFid - the fid of the field in question that is being changed
     */
    handleChange(e, fieldFidInput) {
        console.log('hello');
        
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
                uiTblDbid
            } = config.tbl_uiFields.fids;
        //field type of record from QB
        const recordFieldType = record[fieldType];
        const recordFieldLabel = record[fieldLabel];
        const recordFieldHelpText = record[fieldHelpText];
        const recordCustomText = record[customText];
        const recordfieldChoiceValues = record[fieldChoiceValues];
        const recordFieldFid = record[fieldFid];
        
        var recordValue = record.value;
        if (!recordValue) recordValue = ""; 
        
            
        switch( recordFieldType ) {
            case "Checkbox":
                return(
                    <FormGroup key={recordFieldFid} check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleChange}/>
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
                            value={recordValue}/>
                        {this.renderHelpText( recordFieldHelpText )}
                    </FormGroup>
                );
            case "Choice":
                
                return (
                    <FormGroup key={recordFieldFid}>
                        <Label for="exampleSelect">{recordFieldLabel}</Label>
                        <Input type="select" 
                            onChange={(e) => this.handleChange(e, recordFieldFid)} 
                            value={recordValue}>
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
                            value={recordValue}/>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Currency":
                //convert to decimals
                recordValue = recordValue.toFixed(2);
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
                                    onChange={(e) => this.handleChange(e, recordFieldFid)}/>
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
                            value={recordValue}/>
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
                            value={recordValue} />
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
        const { userInterfaceFieldRecords } = this.state; 

        //get all HTML elements
        var inputElements = userInterfaceFieldRecords.map(record=>this.renderInputElements(record)); 
        
        return (
            <div>
                
                { inputElements }

                {/*dropdown*/}
                <FormGroup>
                    <Label for="exampleSelect">Select</Label>
                    {/* popover for help text */}
                    <span id="user-help-hover-1" className="user-help-hover" onClick={this.toggle}><i className="fa fa-question-circle" aria-hidden="true"></i></span>

                    <Popover placement="bottom" isOpen={this.state.popoverOpen} target="user-help-hover-1" toggle={this.toggle}>
                        <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                    </Popover>
                    {/* popover for help text */}


                    <Input type="select" name="select" id="exampleSelect" onChange={this.handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="exampleDate">Date</Label>
                    <Input type="date" name="date" id="exampleDate" placeholder="date placeholder" />
                </FormGroup>

                

                <FormGroup>
                    <Label for="exampleText">Text Area</Label>
                    <Input type="textarea" id="exampleText" />
                    <FormText>Example help text that remains unchanged.</FormText>
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Numeric</Label>
                    <Input type="number" id="exampleText" step='0.01' placeholder='0.00' />
                </FormGroup>

                <div>
                    <div className="form-group">
                        <Label>Currency ($)</Label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">$</span>
                            </div>
                            <input className="form-control" type="number" step='0.01' placeholder='0.00' />
                        </div>
                    </div>
                </div>

                <FormGroup>
                    <Label for="exampleText">Currency ($)</Label>
                    <Input type="number" id="exampleText" step='0.01' placeholder='$0.00' />
                    
                    <FormText>Example help text that remains unchanged.</FormText>
                </FormGroup>

                
                    

                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" />
                        Check me out
                    </Label>
                </FormGroup>

                

                <p>This is some Custom Text that will be used to notifiy the user of something.  Doobydooby dooo</p>

                {/*modal*/}
                <div>
                    <Button color="danger" onClick={this.toggleModal}>Modal</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                        <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                        <ModalBody>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggleModal}>Do Something</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="margin-top">
                            <Button color="success" block onClick={this.handleSave}>Save Updates</Button>
                        </div>
                    </div>
                </div>
            </div>                
        );
    }
}


export default DynamicContent;