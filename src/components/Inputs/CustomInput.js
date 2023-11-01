import React, { useState, forwardRef, useEffect, useImperativeHandle } from "react";
import log from "../../utils/console";


const CustomInput = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState('');
    const [warnning, setWarnning] = useState(false);
    // const { ref1, ref2 } = ref;

    const handleTextChange = (evt) => {



        const oldName = inputValue;
        const newName = evt.target.value.replace("+", "").replace("/", "").replace("?", "").replace("%", "").replace("#", "").replace("&", "").replace("=", "").replace(" ", "");
        if (newName.length!== evt.target.value.length){
            props.onAlert(1,'Illegal character input');
        }


        setInputValue(newName);
        props.onChange(newName, oldName);

    }

    useImperativeHandle(ref, () => ({

        setInputValue: (myValue) => {
            setInputValue(myValue);
        },
        getInputValue: () => {
            return inputValue;
        },
        setWarnning: (myValue) => {
            setWarnning(myValue);
        }
    }));

    useEffect(() => {

        log('the input value')
        log(inputValue)

        if (inputValue === '') {
            log('set default value')
            setInputValue(props.defaultValue);
        }


    }, [props.defaultValue,inputValue]);

    return (
        <div>
            <input type="text"
                className={(warnning) ? "form-control roboto-b1 my-text-input-warnning" : "form-control roboto-b1 my-text-input"}
                value={inputValue}
                onChange={handleTextChange}
                style={{ width: parseInt(props.width), height: parseInt(props.height) }}

            >

            </input>
        </div>
    )
});

export default CustomInput;