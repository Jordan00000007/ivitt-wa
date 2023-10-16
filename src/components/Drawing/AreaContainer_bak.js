import log from "../../utils/console";
import {getMediaSize} from "../../utils/geometric";

import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode,Transformer } from "react-konva";

import Konva from 'konva';
import useImage from "use-image";
import { apiHost } from '../../constant/API/APIPath';
import { map, find, filter, includes, remove } from 'lodash-es';




const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

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
                {...shapeProps}
                draggable={(isSelected)?true:false}
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

const initialRectangles = [
    {
    }
];

const AreaContainer = forwardRef((props, ref) => {

    const [rectangles, setRectangles] = React.useState(initialRectangles);
    const [selectedId, selectShape] = React.useState(null);

    const [mediaWidth, setMediaWidth] = React.useState(1);
    const [mediaHeight, setMediaHeight] = React.useState(1);

    const [imageWidth, setImageWidth] = React.useState(1);
    const [imeageHeight, setImageHeight] = React.useState(1);

    
    const [image] = useImage(`${apiHost}/display_img/${props.areaData.img_path.replace("./","/")}`);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
            props.onAreaChange(-1);
        }
    };

    const checkAreaIntersect=(myX,myY)=>{
      
        let result=[];
        log('rectangles')
        log(rectangles)
        rectangles.forEach((item)=>{
           
            if ((myX>=item.x)&&(myX<=(item.x+item.width))&&(myY>=item.y)&&(myY<=(item.y+item.height))){

                result.push(item.id)
            }
        });
        
        return result;
    }

    useEffect(() => {

    

    }, [props]);

    useEffect(() => {

        const imageSize={};
        imageSize.width=props.areaData.img_shape[1];
        imageSize.height=props.areaData.img_shape[0];

        const canvasSize={};
        canvasSize.width=props.width-4;
        canvasSize.height=props.height-4;

        const imageWidth=imageSize.width;
        const imageHeight=imageSize.height;

        setImageWidth(imageWidth);
        setImageHeight(imageHeight);

        const mediaWidth=getMediaSize(canvasSize,imageSize).width;
        const mediaHeight=getMediaSize(canvasSize,imageSize).height;

        setMediaWidth(mediaWidth);
        setMediaHeight(mediaHeight);

        const scaleX=mediaWidth/imageWidth;
        const scaleY=mediaHeight/imageHeight;

        
        if (props.areaData.box_info.length>0){
            let myData=[];
            props.areaData.box_info.forEach((ele,idx) => {

                const x1=Math.min(ele.bbox[0],ele.bbox[2]);
                const y1=Math.min(ele.bbox[1],ele.bbox[3]);
                const x2=Math.max(ele.bbox[0],ele.bbox[2]);
                const y2=Math.max(ele.bbox[1],ele.bbox[3]);


                const myRect={};
                myRect.x=Math.floor(x1*scaleX);
                myRect.y=Math.floor(y1*scaleY);
                myRect.width=Math.floor((x2-x1)*scaleX);
                myRect.height=Math.floor((y2-y1)*scaleY);   
                myRect.id=idx.toString();
                myRect.strokeWidth=4; // border width
                myRect.stroke=ele.color_hex;
                myData.push(myRect)
            });
            setRectangles(myData);
        }else{
            setRectangles([]);
        }

        selectShape(props.selectedLabelIdx.toString());
        

    }, [props]);

    return (
        <Stage
            width={mediaWidth}
            height={mediaHeight}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
        >
            <Layer>
            
                <Image image={image}  width={mediaWidth} height={mediaHeight}/>
                {rectangles.map((rect, i) => {
                    return (
                        <Rectangle
                            key={i}
                            shapeProps={rect}
                            draggable={false}
                            shadowBlur={5}
                            isSelected={rect.id === selectedId}
                            onSelect={(evt) => {
                               
                                let areaResult=checkAreaIntersect(evt.evt.offsetX,evt.evt.offsetY);
                              
                                if (areaResult.length===1){
                                    props.onAreaChange(areaResult[0]);
                                }else{
                                    let theIndex=0;
                                    areaResult.forEach((item,idx)=>{
                                        if (parseInt(item) === parseInt(selectedId)){
                                            theIndex=((idx+1)>=areaResult.length)?0:idx+1;
                                        }
                                    })
                                    props.onAreaChange(areaResult[theIndex]);
                                }

                            }}
                            onChange={(newAttrs) => {
                                log('on change')
                                const rects = rectangles.slice();
                                rects[i] = newAttrs;
                                setRectangles(rects);
                            }}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );

});

export default AreaContainer;