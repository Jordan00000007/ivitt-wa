import React, { useState, forwardRef, useEffect, useImperativeHandle,useRef } from "react";
import log from "../../utils/console";


const CustomInput = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState('');
    const [warnning, setWarnning] = useState(false);
    // const { ref1, ref2 } = ref;

    const inputRef=useRef();

    const isSpecialChar= (str) => {
        //把特殊字符放在数组里
        var specialchar = ['+', ' ', '/','?','%','&','='];
        for (var key in specialchar) {
            if (str.indexOf(specialchar[key]) != -1) {
                return true;
            }
        }
        return false;
    }

    const handleTextChange = (evt) => {

        const oldName = inputValue;
        const newName = evt.target.value.replace("+", "").replace("/", "").replace("?", "").replace("%", "").replace("#", "").replace("&", "").replace("=", "").replace(" ", "");
       
        setInputValue(newName);
        if (isSpecialChar(evt.target.value)){
            props.onAlert(1,'Illegal character input');
            setInputValue(newName);
        }else{
            props.onChange(newName, oldName);
        }

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
        },
        setFocus: () => {
            inputRef.current.focus();
        }
    }));

    // useEffect(() => {

    //     log('the input value')
    //     log(inputValue)

    //     if (inputValue === '') {
    //         log('set default value')
    //         setInputValue(props.defaultValue);
    //     }


    // }, [props.defaultValue,inputValue]);

     useEffect(() => {

        setInputValue(props.defaultValue);


    }, []);

    return (
        <div>
            <input type="text"
                className={(warnning) ? "form-control roboto-b1 my-text-input-warnning" : "form-control roboto-b1 my-text-input"}
                value={inputValue}
                onChange={handleTextChange}
                style={{ width: parseInt(props.width), height: parseInt(props.height) }}
                ref={inputRef}

            >

            </input>
        </div>
    )
});

export default CustomInput;