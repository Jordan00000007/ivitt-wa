import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import { useDispatch, useSelector } from 'react-redux';

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


import { selectCurrentClassInfo, setClassInfo } from "../../redux/store/slice/currentClassInfo";
import { selectCurrentIdx, setCurrentIdx, setImgDataList, setImgBoxList, setDataSetList, updateBoxInfo } from "../../redux/store/slice/currentIdx";

const CustomSelectDataset = forwardRef((props, ref) => {

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

    const [classSelectorArr,setClassSelectorArr] =useState([['All', 'All'],['Unlabeled', 'Unlabeled']])

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;


    const handleSelectChange = (event, value) => {

        log(`${props.name} select change => ${value}`);
        
        setSelectedValue(value);
        if (value!==null){
            
            props.onChange(value);
        }
        

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

        if ((props.defaultValue !== '')&&(selectedValue===null)) {
            setSelectedValue(props.defaultValue);
        }

    }, [props]);

    useEffect(() => {

        const myClassSelectorArr = [['All', 'All'],['Unlabeled', 'Unlabeled']];
      
        if (classInfo.length>0){
            classInfo.forEach((item) => {
                const myClassItem = []
                myClassItem.push(item.class_name);
                myClassItem.push(item.class_name);
                myClassSelectorArr.push(myClassItem);
            })
            setClassSelectorArr(myClassSelectorArr);

        }
      

    }, [classInfo]);

    useEffect(() => {

       log('props.defaultValue',props.defaultValue)
       log('selectedValue',selectedValue)

    }, [props]);


  

    return (

        <CssVarsProvider theme={focus ? theme2 : theme1}>
            <Select
                indicator={<KeyboardArrowDown />}
                placeholder={placeHolder ? "--- please select ---" : ""}
                disabled={props.disabled}
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
                value={selectedValue}
                onChange={handleSelectChange}
                onListboxOpenChange={handleListBoxChange.bind(this)}

                slotProps={{
                   

                    listbox: {
                        sx: {
                            top: '-4px !important',
                            backgroundColor: '#FAFAFD',
                            maxHeight: parseInt(props.height) * 10,
                            
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

               


                {classSelectorArr.map((item, index) => (
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
                            {item[1]}
                        </Option>
                        {
                            (index===1)?<ListDivider key="divider" />:<></>
                        }
                        
                    </React.Fragment>

                ))}
            </Select>

        </CssVarsProvider>
    );
});

export default CustomSelectDataset;