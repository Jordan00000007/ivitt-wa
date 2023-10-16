import React, { useState, forwardRef, useEffect,useImperativeHandle} from "react";
import log from "../../utils/console";


const CustomInput  = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState('');
    const [warnning, setWarnning] = useState(false);
   // const { ref1, ref2 } = ref;

    useImperativeHandle(ref, () => ({
      
        setInputValue: (myValue) => {
            setInputValue(myValue);
        },
        getInputValue: () => {
            return inputValue;
        },
        setWarnning:(myValue)=>{
            setWarnning(myValue);
        }
    }));

    useEffect(() => {

        log('the input value')
        log(inputValue)
        
        if (inputValue===''){
            log('set default value')
            setInputValue(props.defaultValue);
        }
       

     }, [props.defaultValue]);

    return (
        <div>
            <input type="text" 
                className={(warnning)?"form-control roboto-b1 my-text-input-warnning":"form-control roboto-b1 my-text-input"}
                value={inputValue} 
                onChange={(event)=>{
                    const oldName=inputValue;
                    setInputValue(event.target.value);
                    props.onChange(event.target.value,oldName);
                }} 
                style={{width:parseInt(props.width),height:parseInt(props.height)}} 
              
            >

            </input>
        </div>
    )
});

export default CustomInput;