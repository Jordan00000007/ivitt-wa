import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import log from "../../utils/console";
import styled from 'styled-components';

import { useSelector, useDispatch } from "react-redux";
import { map, find, filter, includes, cloneDeep } from 'lodash-es';

import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';

import { selectCurrentBbox,setLabelIndex } from "../../redux/store/slice/currentBbox";
import { selectCurrentClassInfo, setClassEditingIndex } from "../../redux/store/slice/currentClassInfo";

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



const AnnotationItem = forwardRef((props, ref) => {

    const dispatch=useDispatch();

    const [selected, setSelected] = useState(false);

    const [labelIdx, setLabelIdx] = useState(props.labelIdx);

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;
    const classInfo = useSelector(selectCurrentClassInfo).classInfo;
   
    const handleItemClick = (ai) => {
        
        props.onClick(labelIdx,ai);
        //dispatch(setLabelIndex(labelIdx))

    };

    useImperativeHandle(ref, () => ({

    }));

    // const getClassName=(myClassId)=>{

    //     if (classInfo.length>0){
    //         const res = filter(classInfo, (obj) => {
    //             if (parseInt(obj.class_id) === parseInt(myClassId)) return true;
    //         })
    
            
    //         if (res[0]!==undefined) return res[0].class_name;

    //         return '';
    //     }else{
    //         return '';
    //     }
    // }

    const getClassColor = (myClassName) => {

        if (classInfo.length > 0) {

            const res = filter(classInfo, (obj) => {
                if (obj.class_name === myClassName) return true;
            })

            if (res[0] !== undefined) return res[0].color_hex;

            return '#ffffff';
        } else {
            return '#ffffff';
        }
    }


    useEffect(() => {

        if (props.ai){
            if (aiLabelIndex === props.labelIdx) {
                setSelected(true);
            }else{
                setSelected(false);
            }
        }else{
            if (labelIndex === props.labelIdx) {
                setSelected(true);
            }else{
                setSelected(false);
            }
        }
       
    }, [aiLabelIndex,labelIndex]);

    return (
        <div className="row" onClick={(evt)=>handleItemClick(props.ai)}>         
            <div className={`col-12 d-flex flex-row align-items-center ${selected?'my-annotation-item-selected':'my-annotation-item'}`} >
                {
                    (props.ai) ?
                        
                        <Label_AI stroke={getClassColor(props.className)}></Label_AI>
                        :
                        <Label_Man fill={getClassColor(props.className)} ></Label_Man>
                }
                <div style={{ paddingLeft: 10 }}>
                    {props.className}
                </div>
            </div>
        </div>
    );
});

export default AnnotationItem;
