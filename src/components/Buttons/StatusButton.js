import React from 'react';
import log from "../../utils/console";

const StatusButton = ({ name }) => {

   // const {name}=props;
  
        if (name==="finish"){
            return (
                <button className="my-button-green">
                    Finish
                </button>
            )
        }

        if (name==="training"){
            return (
                <button className="my-button-green" style={{width:79}}>
                    Training
                </button>
            )
        }

        if ((name==="stop")||(name==="manual stop")){
            return (
                <button className="my-button-yellow">
                    Stop
                </button>
            )
        }

        if (name==="failed"){
            return (
                <button className="my-button-red">
                    Fail
                </button>
            )
        }

        if (name==="waiting"){
            return (
                <button className="my-button-gray"  style={{width:79}}>
                    Waiting
                </button>
            )
        }


       
        if (name.toLowerCase().indexOf('err')>=0){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    
                </div>
            )
        }

     


        console.log(`name=${name}`)

       
        return (
            <button className="my-button">

            </button>
        );

       
    
};

export default StatusButton;