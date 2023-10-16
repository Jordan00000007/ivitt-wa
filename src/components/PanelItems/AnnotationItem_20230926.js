import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import log from "../../utils/console";
import styled from 'styled-components';

import { useSelector, useDispatch } from "react-redux";

import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';

import { selectCurrentBbox,setLabelIndex } from "../../redux/store/slice/currentBbox";

const CheckBoxWrapper = styled.div`
    position: relative;
`;

const RowItem = styled.div(props => ({
    fontFamily: 'Roboto, Regular',
    fontSize: 15,
    color: '#16272E',
    padding: '9px 20px 9px 20px',
    width: 290,
    height: 36,
    cursor: 'pointer',
    backgroundColor: '#E0F0FA',
    '&:hover': {
        backgroundColor: '#E0F0FA',
    }
}));

const RowItemSelected = styled.div(props => ({
    fontFamily: 'Roboto, Regular',
    fontSize: 15,
    color: '#16272E',
    padding: '9px 20px 9px 20px',
    width: 290,
    height: 36,
    cursor: 'pointer',
    backgroundColor: 'red',
    '&:hover': {
        backgroundColor: '#E0F0FA',
    }
}));

const AnnotationItem = forwardRef((props, ref) => {

    const dispatch=useDispatch();

    const [selected, setSelected] = useState(false);

    const [labelIdx, setLabelIdx] = useState(props.labelIdx);

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;



    const handleItemClick = (event) => {

        props.onClick(labelIdx);
        //dispatch(setLabelIndex(labelIdx))

    };

    useImperativeHandle(ref, () => ({



    }));


    useEffect(() => {
       
        if (labelIndex === props.labelIdx) {
            setSelected(true);
        }else{
            setSelected(false);
        }

    }, [props]);

    return (
        <div className="row" onClick={handleItemClick}>         
            <div className={selected?"col-12 d-flex flex-row align-items-center my-annotation-item-selected":"col-12 d-flex flex-row align-items-center my-annotation-item"} >
                {
                    (props.filled) ?
                        <Label_Man fill={currentBbox[props.labelIdx].color_hex} ></Label_Man>
                        :
                        <Label_AI stroke={currentBbox[props.labelIdx].color_hex}></Label_AI>
                }

                <div style={{ paddingLeft: 10 }}>
                    {currentBbox[props.labelIdx].class_name}
                </div>
            </div>
        </div>
    );
});

export default AnnotationItem;
