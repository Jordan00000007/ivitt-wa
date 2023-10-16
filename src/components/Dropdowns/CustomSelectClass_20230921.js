import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';
import ListDivider from '@mui/joy/ListDivider';
import { useIsFocusVisible } from '@mui/material';

import FavoriteBorder from '@mui/icons-material/FavoriteBorder';



const CustomSelectClass = forwardRef((props, ref) => {

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
        props.onChange(value);

    };

    const handleListBoxChange = (event, value) => {

        setFocus(event);

    };

    const renderValue = (item) => {

        if (!item) {
            return null;
        }

        const myIndex = item.ref.current.getAttribute('index');
        const myColor = props.dataArr[myIndex][2];

        return (
            <React.Fragment>
                <ListItemDecorator
                    sx={{
                        minHeight: parseInt(props.height),
                        height: parseInt(props.height),
                        '--ListItemDecorator-size': '26px',
                    }}
                >
                    <div style={{ position: 'relatvie' }}>
                        <div style={{ position: 'absolute', top: 5, left: 13 }}>
                            
                            <Label_Man fill={myColor}></Label_Man>
                        
                        </div>
                    </div>
                </ListItemDecorator>
                <div style={{ position: 'relatvie' }}>
                    <div style={{ position: 'absolute', top: 6, left: 38 }}>
                        {item.label}
                    </div>
                </div>

            </React.Fragment>
        );
    }

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

        if (props.defaultValue !== '') {

            if (selectedValue==='')
                setSelectedValue(props.defaultValue);
        }

    }, [props]);


  

    return (

        <CssVarsProvider theme={focus ? theme2 : theme1}>
            <Select
                indicator={<KeyboardArrowDown />}
                placeholder={placeHolder ? "--- please select ---" : ""}
                disabled={props.disabled}
                renderValue={renderValue}
                sx={{
                    width: parseInt(props.width),
                    fontSize: parseInt(props.fontSize),
                    fontFamily: 'roboto',
                    fontWeight: 400,
                    color: '#16272E',
                    fontFamily: 'Roboto',
                    margin: 0,
                    minHeight: parseInt(props.height),
                    height: parseInt(props.height),
                    borderRadius: 6,

                    [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)',
                        },
                    },
                    "&:hover": {
                        border: "1px solid #979CB5",
                        backgroundColor: "#ffffff",
                    },
                    '--Select-placeholderOpacity': 0.31,
                    '--ListItemDecorator-size': '26px',


                }}
                ref={ref}
                defaultValue={placeHolder ? "" : props.defaultValue}
                value={selectedValue}
                onChange={handleSelectChange}
                onListboxOpenChange={handleListBoxChange.bind(this)}

                slotProps={{
                   

                    listbox: {
                        sx: {
                            top: '-4px !important',
                            backgroundColor: '#FAFAFD',
                            maxHeight: parseInt(props.height) * 5,
                            '--ListItemDecorator-size': '26px',
                            
                        },
                        placement: 'bottom-start',

                    },
                    button: {
                        sx: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 188,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',

                        },
                    },


                }}
            >

               


                {props.dataArr.map((item, index) => (
                    <React.Fragment key={index}>
                        <Option value={item[0]} label={item[1]} index={index}
                            sx={{
                                fontSize: parseInt(props.fontSize),
                                fontFamily: 'roboto',
                                fontWeight: 400,
                                color: '#16272E',
                                backgroundColor: '#FAFAFD',
                                minHeight: parseInt(props.height),
                                height:parseInt(props.height)
                            }}

                        >
                            <ListItemDecorator>
                                <Label_Man fill={item[2]}></Label_Man>
                            </ListItemDecorator>
                            {item[1]}
                        </Option>
                    </React.Fragment>

                ))}
            </Select>

        </CssVarsProvider>
    );
});

export default CustomSelectClass;