import React, { useState,useEffect,useImperativeHandle,forwardRef } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = forwardRef((props, ref) => {
  const [color, setColor] = useState('#ffffff');
  //const [color, setColor] = useState({ hex: "#FFFFFF" });

  const onColorPickerInfoChange = myColor => {
    console.log("Main Color Change", myColor.hex);
    setColor(myColor.hex)
  };

  useEffect(() => {

   
    if (props.defaultValue !== '') {
        setColor(props.defaultValue);
    }


}, [props.defaultValue]);

useImperativeHandle(ref, () => ({
  
  getColor: () => {
      return color;
  }
}));

  return (
    <div>
      <ChromePicker
        color={color}
        onChangeComplete={onColorPickerInfoChange}
        disableAlpha={true}
      />
      <p>Selected Color: {color}</p>
    </div>
  );
});

export default ColorPicker;