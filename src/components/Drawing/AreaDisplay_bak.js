import log from "../../utils/console";
import {getMediaSize} from "../../utils/geometric";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode,Transformer } from "react-konva";
import Konva from 'konva';
import useImage from "use-image";
import { apiHost } from '../../constant/API/APIPath';
import { map, find, filter, includes, remove } from 'lodash-es';

import { selectCurrentBbox} from "../../redux/store/slice/currentBbox";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();


    React.useEffect(() => {
      log('shapeProps')
      log(shapeProps)
    }, [shapeProps]);


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
                x={shapeProps.bbox[0]}
                y={shapeProps.bbox[1]}
                width={shapeProps.bbox[2]-shapeProps.bbox[0]}
                height={shapeProps.bbox[3]-shapeProps.bbox[1]}
                fill="transparent"
                stroke={shapeProps.color_hex}
                strokeWidth={3}
                draggable={false}
                
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    anchorFill='white'
                    anchorStroke='red'
                    anchorCornerRadius={5}
                    anchorStrokeWidth={3}
                    borderStroke='red'
                    borderStrokeWidth={3}
                    shouldOverdrawWholeArea={false}
                    rotateAnchorOffset={100}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
           
        </React.Fragment>
    );
};


const AreaDisplay = forwardRef((props, ref) => {

    const initialRectangles = [
        {
        }
    ];
 
    const dispatch = useDispatch();

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;


    const [rectangles, setRectangles] = React.useState(initialRectangles);
    const [selectedId, selectShape] = React.useState(null);

    const [mediaWidth, setMediaWidth] = React.useState(1);
    const [mediaHeight, setMediaHeight] = React.useState(1);

    const [imageWidth, setImageWidth] = React.useState(1);
    const [imeageHeight, setImageHeight] = React.useState(1);



    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
            props.onAreaChange(-1);
        }
    };

    React.useEffect(() => {

      
        log('currentBbox')
        log(currentBbox)
        log('sizeInfo')
        log(sizeInfo)

    }, [currentBbox,sizeInfo]);



    return (
       <>
                {currentBbox.map((rect, i) => {
                    return (
                        

                        // (i!==props.selectedLabelIdx) &&
                        <Rectangle
                            key={i}
                            // x={rect.bbox[0]}
                            // y={rect.bbox[1]}
                            // width={rect.bbox[2]-rect.bbox[0]}
                            // height={rect.bbox[3]-rect.bbox[1]}
                            shapeProps={rect}
                            draggable={false}
                            shadowBlur={5}
                            isSelected={rect.id === selectedId}
                          
                        />
                        
                    );
                })}
        </>
    );

});

export default AreaDisplay;