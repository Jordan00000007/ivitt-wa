import React, { useState, useEffect, useImperativeHandle, forwardRef,useRef } from 'react';
import log from "../../utils/console";
import { HexColorPicker,RgbaColorPicker } from "react-colorful";


const ColorfulPicker = forwardRef((props, ref) => {
    //const [color, setColor] = useState('#ffffff');
    const [color, setColor] = useState("#b32aa9");

    const pickerRef=useRef(null);

    const valueToHex = (c) => {
        const hex = ('0'+c.toString(16)).slice(-2);
        return hex
    }

    const rgbToHex = (myColor) => {

        const rgb = myColor.substring(4, myColor.length-1)
                .replace(/ /g, '')
                .split(',');

        return '#'+(valueToHex(parseInt(rgb[0])) + valueToHex(parseInt(rgb[1])) + valueToHex(parseInt(rgb[2])));
    }

    const onColorPickerInfoChange = myColor => {
        console.log("Main Color Change", myColor.hex);
        setColor(myColor.hex)
    };

    const handleColorChange = (myColor) => {

       props.onChange(myColor);
    }

    useEffect(() => {

        if (props.defaultColor!==null){            
            setColor(props.defaultColor);
        }

    }, [props.defaultColor]);

    useImperativeHandle(ref, () => ({

        getColor: () => {
          
            return color;
        },
        getPicker: () => {
          
            return pickerRef;
        },
       
    }));

    return (
        <div ref={pickerRef}>
            <HexColorPicker color={color} onChange={handleColorChange}/>
        </div>
    );
});

export default ColorfulPicker;