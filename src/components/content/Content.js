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
    ModalFooter} from 'reactstrap';

//custom imports
import './styles/styles.css';
import logo from './img/Fresenius.jpg';
import LoadingGif from "../loading/loading.js";
import FreseniusHeader from "../header/Header.js";



class Content extends Component {

    constructor(props) {
        super(props);

        
        this.state = {
            popoverOpen: false,
            modal: false
        };

        //bindings
        this.toggle = this.toggle.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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

    render() {
        return (  
            <div id="main">
            
                <FreseniusHeader />

                <div className="centered white-header margin-top">
                    Dynamic Title
                </div>
                

                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div id="content">
                            <div className="section-title">Section Title</div>

                            {/*dropdown*/}
                            <FormGroup>
                                <Label for="exampleSelect">Select</Label>
                                {/* popover for help text */}
                                <span id="user-help-hover-1" className="user-help-hover" onClick={this.toggle}><i className="fa fa-question-circle" aria-hidden="true"></i></span>

                                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="user-help-hover-1" toggle={this.toggle}>
                                    <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                </Popover>
                                {/* popover for help text */}


                                <Input type="select" name="select" id="exampleSelect" disabled>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="exampleDate">Date</Label>
                                <Input type="date" name="date" id="exampleDate" placeholder="date placeholder" />
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

                            <LoadingGif />


                            <div className="row justify-content-center">
                                <div className="col-md-10">
                                    <div className="margin-top">
                                        <Button color="success" block>Save Updates</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}


export default Content;
