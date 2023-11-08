import log from "../../utils/console";
import { getMediaSize, getRboxFromBbox, getBboxFromRbox } from "../../utils/geometric";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rect, Transformer } from "react-konva";
import Konva from 'konva';
import useImage from "use-image";
import { apiHost } from '../../constant/API/APIPath';
import { map, filter, cloneDeep, findIndex } from 'lodash-es';

import { selectCurrentBbox, setLabelIndex, setAiLabelIndex, setCurrentBbox, setAutoBox } from "../../redux/store/slice/currentBbox";
import { selectCurrentClassInfo } from "../../redux/store/slice/currentClassInfo";

import { updateBboxAPI } from '../../constant/API';
import { MainContext } from '../../pages/Main';

const Rectangle = forwardRef(({ shapeProps, isSelected, onSelect, mediaWidth, mediaHeight, onBoxChange, isHover }, ref) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;
    const imageName = useSelector(selectCurrentBbox).imageName;

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;

    const { datasetId } = React.useContext(MainContext);

    const dispatch = useDispatch();

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

    useImperativeHandle(ref, () => ({

        batchDraw: () => {
            log('do batch drawing')
            //trRef.current.nodes([shapeRef.current]);

        },

    }));

    useEffect(() => {

        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        // //trRef.current.zIndex(3);
        trRef.current.getLayer().draw();



        // trRef.update = function () {
        //     let nodeTopLeft = trRef.current.findOne('.top-left');
        //     // disaable fill
        //     nodeTopLeft.fill('blue');
        //     // enable icon
        //     //rot.fillpatternimage(iconcanvas);
        // };
        // trRef.update();
        //trRef.getlayer().draw();


        trRef.current.getLayer().draw();


        //log('trRef.current.nodes')
        // log(trRef.current.findOne('.top-left').fill('red'))

        //log(trRef.current)

        // trRef.current.rotateAnchorCursor('grab');

        let nodeTopLeft = trRef.current.findOne('.top-left');
        //nodeTopLeft.fillPriority("color");
        nodeTopLeft.on('mouseenter', (evt) => {
            log('mouse enter top left...')
            // nodeTopLeft.stroke('orange');
            // nodeTopLeft.fill('black');

            // log(evt.target)

            // evt.target.setAttr('fill', 'black')
            // evt.target.setAttr('stroke', 'yellow')
            //evt.target.getLayer().getStage().container().style.cursor='default';

            try {
                //evt.target.getLayer().forceUpdate();
                // trRef.current.getLayer().forceUpdate();
            } catch (error) {
                log(error)
            }

            //trRef.current.find(".top-left").fillPriority("color");
            //trRef.current.find(".top-left").fillPatternImage(anchorShapeCanvas);
            // trRef.current.find(".top-left").strokeEnabled(false);
            //  trRef.current.getLayer().batchDraw();


            //log()


            //evt.target.attrs.stroke='orange';
            //evt.target.stroke('orange');
            //trRef.current.forceUpdate();
            //if (trRef!==undefined)
            //trRef.current.getLayer().forceUpdate();

            //evt.target.parent.getLayer().forceUpdate();

        })
        //trRef.current.getLayer().forceUpdate();

        // anchorFill={'white'}
        // anchorStroke={getClassColor(shapeProps.class_name)}

        // trRef.current.findOne('.anchor').on('mouseenter', () => {
        //     // "content" property is not documented and private
        //     // but for now you can use it
        //     // it is element where transformer is applying its styles
        //     //stage.content.style.cursor = 'move';

        //     log('mouse over ---')
        //   });

    }, [shapeProps]);

    return (

        <React.Fragment>

            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                fill="transparent"
                strokeWidth={0}
                draggable={true}
                
                onDragEnd={(e) => {
                    log('move end')
                    const node = shapeRef.current;

                    if (node !== null) {

                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);

                        const rbox = {};
                        rbox.x = node.x();
                        rbox.y = node.y();
                        rbox.width = Math.max(5, node.width() * scaleX);
                        rbox.height = Math.max(node.height() * scaleY);

                        const bbox = getBboxFromRbox(rbox, sizeInfo);


                        if (labelIndex >= 0) {
                            const newBbox = cloneDeep(currentBbox);
                            log('newBbox')
                            log(newBbox)
                            newBbox[labelIndex].bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

                            const myPayload = {};
                            myPayload.image_name = imageName;
                            myPayload.box_info = newBbox;
                            myPayload.confirm = 0;

                            dispatch(setCurrentBbox(newBbox));
                            const lastLabelIndex = labelIndex;
                            dispatch(setLabelIndex(-1))
                            dispatch(setLabelIndex(lastLabelIndex))

                            updateBboxAPI(datasetId, myPayload)
                                .then(({ status }) => {
                                    log('updateBboxAPI-res', status);

                                })
                                .catch(({ response }) => {
                                    log('updateBboxAPI-Error', response.data);
                                })

                            onBoxChange(newBbox);
                        } else {
                            const newBbox = cloneDeep(autoBox);

                            newBbox[aiLabelIndex].bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

                            dispatch(setAutoBox(newBbox));
                            const lastLabelIndex = aiLabelIndex;
                            dispatch(setAiLabelIndex(-1))
                            dispatch(setAiLabelIndex(lastLabelIndex))

                            onBoxChange(newBbox);
                        }
                    }

                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();
                    const rbox = {};

                    if (rotation === -180) {

                        const x1 = Math.round(node.x());
                        const y1 = Math.round(node.y());
                        const x2 = x1 - Math.round(Math.max(5, node.width() * scaleX));
                        const y2 = y1 - Math.round(Math.max(node.height() * scaleY));
                        rbox.x = Math.min(x1, x2);
                        rbox.y = Math.min(y1, y2);
                        rbox.width = Math.abs(x2 - x1);
                        rbox.height = Math.abs(y2 - y1);

                    } else {

                        const x1 = Math.round(node.x());
                        const y1 = Math.round(node.y());
                        const x2 = x1 + Math.round(Math.max(5, node.width() * scaleX));
                        const y2 = y1 + Math.round(Math.max(node.height() * scaleY));
                        rbox.x = Math.min(x1, x2);
                        rbox.y = Math.min(y1, y2);
                        rbox.width = Math.abs(x2 - x1);
                        rbox.height = Math.abs(y2 - y1);

                    }

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    node.rotation(0);

                    if (labelIndex >= 0) {

                        const bbox = getBboxFromRbox(rbox, sizeInfo);
                        const newBbox = cloneDeep(currentBbox);
                        newBbox[labelIndex].bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

                        const myPayload = {};
                        myPayload.image_name = imageName;
                        myPayload.box_info = newBbox;
                        myPayload.confirm = 0;

                        dispatch(setCurrentBbox(newBbox));
                        const lastLabelIndex = labelIndex;
                        dispatch(setLabelIndex(-1))
                        dispatch(setLabelIndex(lastLabelIndex))

                        updateBboxAPI(datasetId, myPayload)
                            .then(({ status }) => {
                                log('updateBboxAPI-res', status);

                            })
                            .catch(({ response }) => {
                                log('updateBboxAPI-Error', response.data);
                            })

                        onBoxChange(newBbox);
                    }
                    else {



                        const bbox = getBboxFromRbox(rbox, sizeInfo);
                        const newBbox = cloneDeep(autoBox);
                        newBbox[aiLabelIndex].bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

                        dispatch(setAutoBox(newBbox));
                        const lastAiLabelIndex = aiLabelIndex;
                        dispatch(setAiLabelIndex(-1))
                        dispatch(setAiLabelIndex(lastAiLabelIndex))

                        onBoxChange(newBbox);
                    }
                }}
                onMouseOver={event => {
                    log('on mouse over...')
                    // const container = event.target.getStage().container();
                    // container.classList.remove('my-white-cursor');
                    // container.classList.add('my-black-cursor');

                }}
                onMouseLeave={event => {
                    // const container = event.target.getStage().container();
                    // container.classList.remove('my-black-cursor');
                    // container.classList.add('my-white-cursor');

                }}
                dragBoundFunc={(pos) => {

                    const node = shapeRef.current;
                    let point = pos;
                    if (point.x < 1) point.x = 1;
                    if (point.y < 1) point.y = 1;
                    if ((point.x + node.width()) >= mediaWidth) point.x = mediaWidth - node.width() - 1;
                    if ((point.y + node.height()) >= mediaHeight) point.y = mediaHeight - node.height() - 1;
                    return point;
                }}
            />

            <Transformer
                ref={trRef}
                rotateEnabled={false}
                anchorFill={'white'}
                anchorStroke={getClassColor(shapeProps.class_name)}
                keepRatio={false}
                borderStroke={getClassColor(shapeProps.class_name)}
                anchorCornerRadius={6}
                anchorStrokeWidth={2}
                anchorSize={11}
                
                //shouldOverdrawWholeArea={false}
                //rotateAnchorOffset={100}
                borderDash={(aiLabelIndex >= 0) ? [10, 5] : []}
                borderStrokeWidth={isHover ? 7 : 4}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                boundBoxFunc={(oldBox, newBox) => {

                    if ((Math.abs(newBox.x) + Math.abs(newBox.width)) > mediaWidth) {
                        return oldBox;
                    }

                    if ((Math.abs(newBox.y) + Math.abs(newBox.height)) > mediaHeight) {
                        return oldBox;
                    }

                    if (newBox.x < 1) {
                        return oldBox;
                    }

                    if (newBox.y < 1) {
                        return oldBox;
                    }

                    return newBox;
                }}
                


                // anchorStyleFunc={(anchor) => {
                //     // log('anchor')
                //     // log(anchor)

                //     anchor.on('mouseover', (evt) => {

                //         // log('(1) mouse enter...')
                //         // log(evt.target.attrs.stroke)
                //         // evt.target.stroke('red')
                //         // anchor.fill('orange')
                //         // anchor.stroke('blue')

                //         const myStroke=evt.target.attrs.stroke;
                //         const myFill=evt.target.attrs.fill;

                //         log(myStroke,myFill)
                //         // this.stroke('red')
                //         // this.fill('red')

                //         evt.target.strokeWidth(4);

                //         //this.stroke('#ff0000');
                //         //this.fill(myStroke);
                //         // evt.target.getLayer().forceUpdate()

                //     });

                //     // anchor.cornerRadius(10);
                //     // if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
                //     //     anchor.height(6);
                //     //     anchor.offsetY(3);
                //     //     anchor.width(30);
                //     //     anchor.offsetX(15);
                //     // }
                //     // if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
                //     //     anchor.height(30);
                //     //     anchor.offsetY(15);
                //     //     anchor.width(6);
                //     //     anchor.offsetX(3);
                //     // }
                // }}

                // anchorStyleFunc={ (anchor) => {
                //     // anchor is Konva.Rect instance
                //     // you manually change its styling
                //     // anchor.cornerRadius(10);
                //     // if (anchor.hasName('top-left') || anchor.hasName('top-right')) {
                //     //   anchor.height(6);
                //     //   anchor.offsetY(3);
                //     //   anchor.width(30);
                //     //   anchor.offsetX(15);
                //     // }
                //     // if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
                //     //   anchor.height(30);
                //     //   anchor.offsetY(15);
                //     //   anchor.width(6);
                //     //   anchor.offsetX(3);
                //     // }

                //     anchor.on('mouseenter', (evt) => {

                //         //log('anchor mouse over')
                //         anchor.fill('red')
        
                //     });
                // }}
            />


        </React.Fragment>

    );
});


const AreaEdit = forwardRef((props, ref) => {

    const [selectedId, selectShape] = React.useState(null);

    const [mediaWidth, setMediaWidth] = React.useState(1);
    const [mediaHeight, setMediaHeight] = React.useState(1);

    const [tag, setTag] = React.useState('');

    const [editData, setEditData] = React.useState({});

    const dispatch = useDispatch();

    const RectangleRef = React.useRef(null);

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;

    const labelIndex = useSelector(selectCurrentBbox).labelIndex;

    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;

    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;

    useEffect(() => {

        if (labelIndex >= 0) {

            if (labelIndex < currentBbox.length) {
                setEditData(getRboxFromBbox(currentBbox[labelIndex], sizeInfo))
            }
            setMediaWidth(sizeInfo.mediaWidth);
            setMediaHeight(sizeInfo.mediaHeight)
            setTag('a'+labelIndex);


        } else if (aiLabelIndex >= 0) {

            if (aiLabelIndex < autoBox.length) {
                setEditData(getRboxFromBbox(autoBox[aiLabelIndex], sizeInfo))
            }
            setMediaWidth(sizeInfo.mediaWidth);
            setMediaHeight(sizeInfo.mediaHeight);
            setTag('b'+aiLabelIndex);


        } else {
            setEditData({});
            setTag('');
        }


    }, [labelIndex, aiLabelIndex]);


    useEffect(() => {

        if (labelIndex >= 0) {
            if (labelIndex < currentBbox.length) {
                setEditData(getRboxFromBbox(currentBbox[labelIndex], sizeInfo))
            }
            setMediaWidth(sizeInfo.mediaWidth);
            setMediaHeight(sizeInfo.mediaHeight)
        }

    }, [currentBbox]);

    useEffect(() => {

        if (aiLabelIndex >= 0) {
            if (aiLabelIndex < autoBox.length) {
                setEditData(getRboxFromBbox(autoBox[aiLabelIndex], sizeInfo));
            }
            setMediaWidth(sizeInfo.mediaWidth);
            setMediaHeight(sizeInfo.mediaHeight);
        }

    }, [autoBox]);







    return (
        <>

            <Rectangle
                key={`EditRect`}
                mediaWidth={mediaWidth}
                mediaHeight={mediaHeight}
                shapeProps={editData}
                ref={RectangleRef}
                onBoxChange={props.onBoxChange}
                isHover={(findIndex(props.hoverBbox, function (o) { return o === tag; })) >= 0}
            />


        </>
    );

});

export default AreaEdit;