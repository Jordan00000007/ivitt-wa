import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import log from "../../utils/console";
import styled from 'styled-components';

import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';

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

    const [selected, setSelected] = useState(false);

    const [labelIdx, setLabelIdx] = useState(props.labelIdx);



    const handleItemClick = (event) => {

        props.onClick(labelIdx);
    };

    useImperativeHandle(ref, () => ({



    }));


    useEffect(() => {
        log('selectedLabelIdx')
        log(props.selectedLabelIdx)

        log('props.labelIdx')
        log(props.labelIdx)

        if (props.selectedLabelIdx === props.labelIdx) {
            setSelected(true);
        }

    }, [props]);

    return (
        <div className="row" onClick={handleItemClick}>
            {
                (selected) ?
                    <RowItemSelected className="col-12 d-flex flex-row align-items-center my-annotation-Item" $selected={selected}>
                        {
                            (props.filled) ?
                                <Label_Man fill={props.color} ></Label_Man>
                                :
                                <Label_AI stroke={props.color}></Label_AI>
                        }

                        <div style={{ paddingLeft: 10 }}>
                            {props.name}
                        </div>
                    </RowItemSelected>
                    :
                    <RowItem className="col-12 d-flex flex-row align-items-center my-annotation-Item" $selected={selected}>
                        {
                            (props.filled) ?
                                <Label_Man fill={props.color} ></Label_Man>
                                :
                                <Label_AI stroke={props.color}></Label_AI>
                        }

                        <div style={{ paddingLeft: 10 }}>
                            {props.name}
                        </div>
                    </RowItem>
            }

        </div>
    );
});

export default AnnotationItem;
