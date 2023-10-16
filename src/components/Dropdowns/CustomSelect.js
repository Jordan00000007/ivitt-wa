import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import ListDivider from '@mui/joy/ListDivider';
import { useIsFocusVisible } from '@mui/material';

const CustomSelect = forwardRef((props, ref) => {

    const theme1 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#979CB580',
                    }),
                },
            },

        },
    });

    const theme2 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#979CB5',
                    }),
                },
            },

        },
    });

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [selectedValue, setSelectedValue] = useState('');
    const [focus, setFocus] = useState(false);


    const handleSelectChange = (event, value) => {

        log(`${props.name} select change`);
        log(value)
        setSelectedValue(value);
        //props.onChange(event, value);

    };

    const handleListBoxChange = (event, value) => {

        setFocus(event);

    };

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => {
            // log(`${props.name} get selected value`)
            return selectedValue;
        },
        setSelectedValue: (myValue) => {
            // log(`${props.name} set selected value`)
            // log(myValue)
            setSelectedValue(myValue);

        }
    }));

    useEffect(() => {

        // if (props.defaultIndex!=='') {
        //     if (selectedValue===''){
               
        //         if ((props.dataArr.length-1)>=props.defaultIndex){
        //             log(props.dataArr[props.defaultIndex][0])
        //             setSelectedValue(props.dataArr[props.defaultIndex][0]);
        //         }
                
        //     }
        // }

        if (props.defaultValue!=='') {
            if (selectedValue===''){
               
                setSelectedValue(props.defaultValue);
                
            }
        }

    }, []);



    return (

        <CssVarsProvider theme={focus ? theme2 : theme1}>
            <Select
                indicator={<KeyboardArrowDown />}
                placeholder={placeHolder ? "--- please select ---" : ""}
                disabled={props.disabled}


                sx={{
                    width: props.width,
                    fontSize: props.fontSize,
                    fontFamily: 'roboto',
                    fontWeight: 400,
                    color: '#16272E',
                    margin: 0,
                    paddingleft: 5,
                    minHeight: props.height,
                    borderRadius: 6,
                    
                    [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)',
                        },
                    },
                    "&:hover": {
                        border: "1px solid #979CB5",
                        backgroundColor: "#FFFFFF",
                    },
                    '--Select-placeholderOpacity': 0.31,



                }}
                
                defaultValue={placeHolder ? "" : props.defaultValue}
                value={selectedValue}
                onChange={handleSelectChange}
                onListboxOpenChange={handleListBoxChange.bind(this)}

                slotProps={{
                    
                    listbox: {
                        sx: {

                            top: '-4px !important',
                            backgroundColor: '#FAFAFD!important',
                            // '--List-padding': '0px',
                            maxHeight: props.height * 7,
                            
                            
                        },
                        placement: 'bottom-start',
                    },
                    button: {
                        sx: {
                            overflow:'hidden',
                            textOverflow: 'ellipsis',
                            //maxWidth:188,
                            display: 'inline-block',   
                            whiteSpace: 'nowrap',
                            textAlign:'left',
                            
                        },
                    },


                }}
            >

                {
                    (props.dataArr.length === 0) &&
                    <Option value={-1}
                        sx={{
                            fontSize: props.fontSize,
                            fontFamily: 'roboto',
                            fontWeight: 400,
                            color: '#979CB599',
                            backgroundColor: '#FAFAFD!important',
                            minHeight: props.height,
                            
                        }}
                        disabled
                    >--- please select ---</Option>
                }


                {props.dataArr.map((item, index) => (

                    <Option value={item[0]} key={index}
                        sx={{
                            fontSize: props.fontSize,
                            fontFamily: 'roboto',
                            fontWeight: 400,
                            color: '#16272E',
                            backgroundColor: '#FAFAFD',
                            minHeight: props.height,
                            
                           
                           
                        }}

                    >
                        {item[1]}
                    </Option>

                ))}
            </Select>

        </CssVarsProvider>
    );
});

export default CustomSelect;