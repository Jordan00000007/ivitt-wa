import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faHouse } from '@fortawesome/free-solid-svg-icons';



const CustomButton = (props) => {

   // const {name}=props;

        if (props.name==="edit"){
            return (
                <button onClick={props.onClick} className="my-button-edit" style={{width:parseInt(props.width)}} >
                    Edit
                </button>
            )
        }

        if (props.name==="view"){
            return (
                <button onClick={props.onClick} className="my-button-view roboto-b1" style={((props.status==='run')||(props.status.indexOf('loading')>=0))?{width:'240px'}:{width:'115px'}} disabled={props.disabled}>
                    View
                </button>
            )
        }

      

        if (props.name==="confirm"){
            return (
                <button onClick={props.onClick} className="my-button-submit">
                    OK
                </button>
            )
        }



        if (props.name==="cancel"){
            return (
                <button onClick={props.onClick} className="my-button-cancel">
                    Cancel
                </button>
            )
        }

        if (props.name==="close"){
            return (
                <button onClick={props.onClick} className="my-button-cancel">
                    Close
                </button>
            )
        }

        if (props.name==="submit"){

            if (props.disabled){
                return (
                    <button className="my-button-disable">
                        Add
                    </button>
                )
            }else{
                return (
                    <button onClick={props.onClick} className="my-button-submit">
                        Add
                    </button>
                )
            }
            
        }

        if (props.name==="save"){
            if (props.disabled){
                return (
                    <button className="my-button-disable">
                        Save
                    </button>
                )
            }else{
                return (
                    <button onClick={props.onClick} className="my-button-submit">
                        Save
                    </button>
                )
            }
        }

        if (props.name==="delete"){
            return (
                <button onClick={props.onClick} className="my-button-submit">
                    Delete
                </button>
            )
        }


        return (
            <button onClick={props.onClick} className={props.className}>
            </button>
        );

       
    
};

CustomButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
}

export default CustomButton;