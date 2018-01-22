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
    ModalFooter
} from 'reactstrap';



//custom imports
import './styles.css';
import FreseniusHeader from "../header/Header.js";
import DynamicTitle from "../dynamic_title/DynamicTitle";
import CustomHeader from "../fields/CustomHeader/CustomHeader";
import config from "../../config";


class DynamicContent extends Component {

    constructor(props) {
        super(props);       

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
        this.setState({
            userInterfaceFieldRecords: this.props.userInterfaceFieldRecords
        });
    }

    handleChange(event) {
        console.log(event.target.value);
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
        
            
        switch( recordFieldType ) {
            case "Checkbox":
                return(
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" onChange={this.handleChange}/>
                            { recordFieldLabel }
                        </Label>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Date":
                return (
                    <FormGroup>
                        <Label for="exampleDate">{ recordFieldLabel }</Label>
                        <Input 
                            type="date" 
                            placeholder="date placeholder" 
                            onChange={this.handleChange} />
                        {this.renderHelpText( recordFieldHelpText )}
                    </FormGroup>
                );
            case "Choice":
                return (
                    <FormGroup>
                        <Label for="exampleSelect">{recordFieldLabel}</Label>
                        <Input type="select" onChange={this.handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Input>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Number":
                return(
                    <FormGroup>
                        <Label for="exampleText">{recordFieldLabel}</Label>
                        <Input type="number" step='0.01' placeholder='0.00' onChange={this.handleChange} />
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Currency":
                return(
                    <FormGroup>
                        <Label for="exampleText">{recordFieldLabel}</Label>
                        <Input type="number" step='0.01' placeholder='$0.00' onChange={this.handleChange}/>
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Notes":
                return(
                    <FormGroup>
                        <Label for="exampleText"> {recordFieldLabel} </Label>
                        <Input type="textarea" onChange={this.handleChange} />
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Text":
                return(
                    <FormGroup>
                        <Label for="exampleText"> {recordFieldLabel} </Label>
                        <Input type="text" onChange={this.handleChange} />
                        {this.renderHelpText(recordFieldHelpText)}
                    </FormGroup>
                );
            case "Custom Text":
                return(
                    <p className="margin-top-sm">{recordCustomText}</p>
                );
            case "Custom Heading":
                return (
                    <div className="section-title">{recordCustomText}</div>
                );
            default: 
                return false;
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
                            <Button color="success" block>Save Updates</Button>
                        </div>
                    </div>
                </div>
            </div>                
        );
    }
}


export default DynamicContent;