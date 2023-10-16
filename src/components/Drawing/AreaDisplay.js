import log from "../../utils/console";
import {getMediaSize} from "../../utils/geometric";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode,Transformer } from "react-konva";
import Konva from 'konva';
import useImage from "use-image";
import { apiHost } from '../../constant/API/APIPath';
import { map, find, filter, includes, remove,findIndex } from 'lodash-es';

import { selectCurrentBbox,setLabelIndex } from "../../redux/store/slice/currentBbox";
import { selectCurrentClassInfo,setClassSelectedIndex } from "../../redux/store/slice/currentClassInfo";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, isHover, ai }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();
    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const classInfo = useSelector(selectCurrentClassInfo).classInfo;

    const getClassColor=(myClassName)=>{

        if (classInfo.length>0){

            const res = filter(classInfo, (obj) => {
                if (obj.class_name === myClassName) return true;
            })

            if (res[0]!==undefined) return res[0].color_hex;

            return '#ffffff';
        }else{
            return '#ffffff';
        }
    }


    React.useEffect(() => {
     
    }, []);


    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            //trRef.current.zIndex(3);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            
            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                x={Math.round(shapeProps.bbox[0]/sizeInfo.imageWidth*sizeInfo.mediaWidth)}
                y={Math.round(shapeProps.bbox[1]/sizeInfo.imageHeight*sizeInfo.mediaHeight)}
                width={Math.round((shapeProps.bbox[2]-shapeProps.bbox[0])/sizeInfo.imageWidth*sizeInfo.mediaWidth)}
                height={Math.round((shapeProps.bbox[3]-shapeProps.bbox[1])/sizeInfo.imageHeight*sizeInfo.mediaHeight)}
                fill="transparent"
                stroke={getClassColor(shapeProps.class_name)}
                strokeWidth={isHover?7:4}
                draggable={false}
                dash={[10,5]}
                dashEnabled={ai}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
               
            />
            
           
        </React.Fragment>
    );
};


const AreaDisplay = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    //const currentBbox = useSelector(selectCurrentBbox).bbox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const [selectedId, selectShape] = React.useState(null);

    //const [currentBbox, setCurrentBbox] = React.useState(props.currentBbox);

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;

    React.useEffect(() => {

    
        log('--- ai Label Index change [area display] ---')
        log(aiLabelIndex)

    }, [aiLabelIndex]);


    return (
       <>
                {currentBbox.map((rect, i) => {
                    return (
                    
                        (i!==labelIndex) &&
                        <Rectangle
                            key={`display_${i}`}
                            shapeProps={rect}
                            draggable={false}
                            shadowBlur={5}
                            isSelected={rect.id === selectedId}
                            isHover={(findIndex(props.hoverBbox, function(o) { return o===i; }))>=0}
                            ai={false}
                        />
                        
                    );
                })}

                {autoBox.map((rect, i) => {
                    return (
                    
                        (i!==aiLabelIndex) &&
                        <Rectangle
                            key={`display_${i}`}
                            shapeProps={rect}
                            draggable={false}
                            shadowBlur={5}
                            isSelected={rect.id === selectedId}
                            isHover={(findIndex(props.hoverBbox, function(o) { return o===i; }))>=0}
                            ai={true}
                        />
                        
                    );
                })}
        </>
    );

});

export default AreaDisplay;