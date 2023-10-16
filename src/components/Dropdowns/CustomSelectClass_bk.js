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
        props.onChange(event, value);

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

        if (props.defaultValue !== '') {
            setSelectedValue(props.defaultValue);
        }

    }, [props]);


    const renderValue = (item) => {

        log('--- item ---')


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
                        <div style={{ position: 'absolute', top: 6, left: 13 }}>
                            <svg width="14px" height="15px" preserveAspectRatio="none" viewBox="0 0 167 90" fill={myColor} xmlns="http://www.w3.org/2000/svg">
                                <path vectorEffect="non-scaling-stroke" d="M2.10786 45L83.5 1.13597L164.892 45L83.5 88.864L2.10786 45Z" fillOpacity="0.3" stroke={myColor} strokeWidth="2" />
                            </svg>
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
                    '--ListItemDecorator-size': '44px',


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
                            '--List-padding': '0px',
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
                    
                        <Option value={item[0]} label={item[1]} index={index} color={item[2]}
                            sx={{
                                fontSize: parseInt(props.fontSize),
                                fontFamily: 'roboto',
                                fontWeight: 400,
                                color: '#16272E',
                                backgroundColor: '#FAFAFD',
                                minHeight: parseInt(props.height),
                            }}

                        >
                            <ListItemDecorator>
                                <svg width="14px" height="15px" preserveAspectRatio="none" viewBox="0 0 167 90" fill={item[2]} xmlns="http://www.w3.org/2000/svg">
                                    <path vectorEffect="non-scaling-stroke" d="M2.10786 45L83.5 1.13597L164.892 45L83.5 88.864L2.10786 45Z" fillOpacity="0.3" stroke={item[2]} strokeWidth="2" />
                                </svg>
                            </ListItemDecorator>
                            {item[1]}
                        </Option>
                   
                ))}
            </Select>

        </CssVarsProvider>
    );
});

export default CustomSelectClass;