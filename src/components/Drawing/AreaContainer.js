import log from "../../utils/console";
import { getMediaSize, checkPointInRect, getBboxFromRbox } from "../../utils/geometric";

import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode, Transformer } from "react-konva";

import useImage from "use-image";
import { apiHost } from '../../constant/API/APIPath';
import { updateBboxAPI, getBboxAPI, favoriteLabelAPI } from '../../constant/API';
import { map, find, filter, includes, remove, cloneDeep } from 'lodash-es';

import AreaDisplay from '../Drawing/AreaDisplay';
import AreaEdit from '../Drawing/AreaEdit';

import { MainContext } from '../../pages/Main';
import { selectCurrentBbox, setCurrentBbox, setSizeInfo, setLabelIndex, setAiLabelIndex, setImageName } from '../../redux/store/slice/currentBbox';
import { selectCurrentClassInfo, setClassSelectedIndex, setFavLabels } from "../../redux/store/slice/currentClassInfo";


const AreaContainer = forwardRef((props, ref) => {


    const [currentSize, setCurrentSize] = useState({ "width": 0, "height": 0 });
    const [hoverBbox, setHoverBbox] = useState([]);
    const [mouseCursorClass, setMouseCursorClass] = useState('my-white-cursor');

    const { datasetId, dataType } = useContext(MainContext);

    const sizeInfo = useSelector(selectCurrentBbox).sizeInfo;
    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const imageName = useSelector(selectCurrentBbox).imageName;

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;
    const classSelectedIndex = useSelector(selectCurrentClassInfo).classSelectedIndex;

    const [image] = useImage((props.areaData.img_path) ? `${apiHost}/display_img/${props.areaData.img_path.replace("./", "/")}` : '');

    const dispatch = useDispatch();

    const shapeRef = React.useRef(null);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            dispatch(setLabelIndex(-1))
            dispatch(setAiLabelIndex(-1))
        }
    };


    const checkAreaIntersect = (myX, myY) => {

        let result = [];
        currentBbox.forEach((item, idx) => {

            const myPoint = {};
            myPoint.x = myX;
            myPoint.y = myY;
            if (checkPointInRect(myPoint, item.bbox, sizeInfo)) {
                result.push('a' + idx);
            }
        });


        autoBox.forEach((item, idx) => {

            const myPoint = {};
            myPoint.x = myX;
            myPoint.y = myY;
            if (checkPointInRect(myPoint, item.bbox, sizeInfo)) {
                result.push('b' + idx);
            }
        });

        return result;
    }

    const handleLayerClick = (e) => {

        log('layer click')
        // window.document.body.classList.add('my-black-cursor')

        if ((props.toolSelect) && (dataType === 'object_detection')) {

            setNewAnnotation([]);

            const sx = e.evt.offsetX;
            const sy = e.evt.offsetY;

            const areaResult = checkAreaIntersect(sx, sy);

            const container = e.target.getStage().container();


            if ((areaResult.length) === 0) {
                dispatch(setLabelIndex(-1));
                dispatch(setAiLabelIndex(-1));

            }
            else if ((areaResult.length) === 1) {

                if (areaResult[0].indexOf('a') >= 0) {

                    const myIdx = parseInt(areaResult[0].replace('a', ''));
                    dispatch(setLabelIndex(myIdx));
                    dispatch(setAiLabelIndex(-1));
                }
                if (areaResult[0].indexOf('b') >= 0) {

                    const myIdx = parseInt(areaResult[0].replace('b', ''));
                    dispatch(setLabelIndex(-1));
                    dispatch(setAiLabelIndex(myIdx));
                }



            }
            else if ((areaResult.length) > 1) {

                if ((labelIndex === -1) && (aiLabelIndex === -1)) {
                    if (areaResult[0].indexOf('a') >= 0) {
                        const myIdx = parseInt(areaResult[0].replace('a', ''));
                        dispatch(setLabelIndex(myIdx));
                        dispatch(setAiLabelIndex(-1));
                    }
                    if (areaResult[0].indexOf('b') >= 0) {
                        const myIdx = parseInt(areaResult[0].replace('b', ''));
                        dispatch(setLabelIndex(-1));
                        dispatch(setAiLabelIndex(myIdx));
                    }
                } else {
                    let currentIndex = '';
                    if (labelIndex >= 0) currentIndex = 'a' + labelIndex;
                    if (aiLabelIndex >= 0) currentIndex = 'b' + aiLabelIndex;
                    const arrayIndex = areaResult.indexOf(currentIndex);
                    let nextIndex = -1;
                    if (arrayIndex < (areaResult.length - 1)) {
                        nextIndex = arrayIndex + 1;
                    } else {
                        nextIndex = 0;
                    }
                    if (areaResult[nextIndex].indexOf('a') >= 0) {
                        const myIdx = parseInt(areaResult[nextIndex].replace('a', ''));
                        dispatch(setLabelIndex(myIdx));
                        dispatch(setAiLabelIndex(-1));
                    }
                    if (areaResult[nextIndex].indexOf('b') >= 0) {
                        const myIdx = parseInt(areaResult[nextIndex].replace('b', ''));
                        dispatch(setLabelIndex(-1));
                        dispatch(setAiLabelIndex(myIdx));
                    }
                }


            }


        }

    }

    

    const handleMouseCursorChange = (e) => {

       
        setMouseCursorClass(prevState => {
            if (prevState === 'my-black-cursor') {
                return 'my-white-cursor';
            }
            return 'my-black-cursor';
        });

    }

    useEffect(() => {

        const imageSize = {};
        imageSize.width = props.areaData.img_shape[1];
        imageSize.height = props.areaData.img_shape[0];

        const canvasSize = {};
        canvasSize.width = props.width;
        canvasSize.height = props.height;

        const mediaSize = {};
        mediaSize.width = getMediaSize(canvasSize, imageSize).width;
        mediaSize.height = getMediaSize(canvasSize, imageSize).height;


        const sizeInfo = {};
        sizeInfo.imageWidth = imageSize.width;
        sizeInfo.imageHeight = imageSize.height;
        sizeInfo.mediaWidth = mediaSize.width;
        sizeInfo.mediaHeight = mediaSize.height;

        dispatch(setCurrentBbox(props.areaData.box_info));
        dispatch(setSizeInfo(sizeInfo));

        const myFileName = props.areaData.img_path.replace(/^.*[\/]/, '')

        log('myFileName-------------->', myFileName)

        dispatch(setImageName(myFileName));
        dispatch(setLabelIndex(-1));
        setCurrentSize(mediaSize);




    }, [props.areaData]);

    useEffect(() => {


        const imageSize = {};
        imageSize.width = props.areaData.img_shape[1];
        imageSize.height = props.areaData.img_shape[0];

        const canvasMinWidth = 1456;
        const canvasMinHeight = 586;

        const canvasSize = {};
        canvasSize.width = props.width;
        canvasSize.height = props.height;

        const mediaSize = {};
        mediaSize.width = getMediaSize(canvasSize, imageSize).width;
        mediaSize.height = getMediaSize(canvasSize, imageSize).height;


        const sizeInfo = {};
        sizeInfo.imageWidth = imageSize.width;
        sizeInfo.imageHeight = imageSize.height;
        sizeInfo.mediaWidth = mediaSize.width;
        sizeInfo.mediaHeight = mediaSize.height;


        dispatch(setSizeInfo(sizeInfo));

        setCurrentSize(mediaSize);


    }, [props.height, props.width]);

    const [annotations, setAnnotations] = useState([]);
    const [newAnnotation, setNewAnnotation] = useState([]);

    const checkPointInside = (x, y) => {

        let myCheck = false;
        if ((x >= 1) && (y >= 1) && (x <= sizeInfo.mediaWidth - 1) && (y <= sizeInfo.mediaHeight - 1)) {
            myCheck = true;
        }
        log('myCheck', myCheck)
        return myCheck;


    }

    const handleDrawingMouseUp = (event) => {

        log('handle Outside Mouse Up');

        const tx = event.x;
        const ty = event.y;

        const sx = event.currentTarget.sx;
        const sy = event.currentTarget.sy;

        const xx = event.currentTarget.xx;
        const yy = event.currentTarget.yy;

        const xxx = (tx - xx) + sx;
        const yyy = (ty - yy) + sy;

        const ex = (xxx <= 1) ? 1 : (xxx >= sizeInfo.mediaWidth - 1) ? sizeInfo.mediaWidth - 1 : xxx;
        const ey = (yyy <= 1) ? 1 : (yyy >= sizeInfo.mediaHeight - 1) ? sizeInfo.mediaHeight - 1 : yyy;

        log(sx, sy, ex, ey);

        const annotationToAdd = {
            x: Math.min(sx, ex),
            y: Math.min(sy, ey),
            width: Math.abs(sx - ex),
            height: Math.abs(sy - ey),
            key: annotations.length + 1
        };

        let checkAdd = true;
        if ((annotationToAdd.width <= 5) && (annotationToAdd.height <= 5)) checkAdd = false;
        if ((annotationToAdd.width === 0) || (annotationToAdd.height === 0)) checkAdd = false;


        if (!checkAdd) {
            setAnnotations([]);
        } else {

            annotations.push(annotationToAdd);
            setNewAnnotation([]);
            setAnnotations(annotations);

            const newBox = {};
            newBox.class_id = classInfo[classSelectedIndex].class_id;
            newBox.class_name = classInfo[classSelectedIndex].class_name;
            newBox.color_hex = classInfo[classSelectedIndex].color_hex;

            const rbox = {};
            rbox.x = Math.min(sx, ex);
            rbox.y = Math.min(sy, ey);
            rbox.width = Math.abs(sx - ex);
            rbox.height = Math.abs(sy - ey);

            const bbox = getBboxFromRbox(rbox, sizeInfo);
            newBox.bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

            const myBoxInfo = cloneDeep(currentBbox);
            myBoxInfo.push(newBox);

            const myPayload = {};
            myPayload.box_info = myBoxInfo;
            myPayload.image_name = imageName.replace('//', '');
            myPayload.confirm = props.confirmStatus;


            dispatch(setCurrentBbox(myBoxInfo));
            //dispatch(setLabelIndex(myBoxInfo.length - 1))
            dispatch(setLabelIndex(-1))

            updateBboxAPI(datasetId, myPayload)
                .then(({ status }) => {
                    log('updateBboxAPI-res', status);
                    updateFavoriteLabel();
                })
                .catch(({ response }) => {
                    log('updateBboxAPI-Error', response.data);
                })
            props.onBoxChange(myBoxInfo);

            // }

            setNewAnnotation([]);


        }

        document.removeEventListener('mouseup', handleDrawingMouseUp);
        document.removeEventListener('mousemove', handleDrawingMouseMove);
    }


    const handleDrawingMouseMove = event => {

        const tx = event.x;
        const ty = event.y;

        const sx = event.currentTarget.sx;
        const sy = event.currentTarget.sy;

        const xx = event.currentTarget.xx;
        const yy = event.currentTarget.yy;

        const xxx = (tx - xx) + sx;
        const yyy = (ty - yy) + sy;

        const ex = (xxx <= 1) ? 1 : (xxx >= sizeInfo.mediaWidth - 1) ? sizeInfo.mediaWidth - 1 : xxx;
        const ey = (yyy <= 1) ? 1 : (yyy >= sizeInfo.mediaHeight - 1) ? sizeInfo.mediaHeight - 1 : yyy;

        const rbox = {};
        rbox.x = Math.min(sx, ex);
        rbox.y = Math.min(sy, ey);
        rbox.width = Math.abs(sx - ex);
        rbox.height = Math.abs(sy - ey);
        rbox.key = "0";

        setNewAnnotation([rbox]);

    };

    const handleMouseDown = event => {



        if ((newAnnotation.length === 0) && (labelIndex < 0) && (aiLabelIndex < 0) && (props.toolSelect) && (classSelectedIndex >= 0)) {
            const { x, y } = event.target.getStage().getPointerPosition();
            setNewAnnotation([{ x, y, width: 0, height: 0, key: "newArea" }]);


            document.addEventListener('mouseup', handleDrawingMouseUp);
            document.sx = x;
            document.sy = y;
            document.xx = event.evt.x;
            document.yy = event.evt.y;
            document.addEventListener('mousemove', handleDrawingMouseMove);

        }


    };

    const updateFavoriteLabel = () => {

        favoriteLabelAPI(datasetId)
            .then(({ data }) => {
                const myData = data.data;
                const myArr = [];
                Object.keys(myData).forEach(function (k) {
                    myArr.push(myData[k]);
                });
                dispatch(setFavLabels(myArr));
            }).catch(({ response }) => {
                dispatch(setFavLabels([]));
                log(response.data.message);
            });

    }

    const handleMouseUp = (event) => {

        document.removeEventListener('mouseup', handleDrawingMouseUp);

        log('(2) mouse up')
        log(event)

        //event.preventDefault();
        //event.stopPropagation();
        // event.preventDefault();

        if (newAnnotation.length === 1) {
            const sx = newAnnotation[0].x;
            const sy = newAnnotation[0].y;
            const { x, y } = event.target.getStage().getPointerPosition();
            const annotationToAdd = {
                x: Math.min(sx, (x - sx)),
                y: Math.min(sy, (y - sy)),
                width: Math.abs(x - sx),
                height: Math.abs(y - sy),
                key: annotations.length + 1
            };

            let checkAdd = true;
            if ((annotationToAdd.width <= 5) && (annotationToAdd.height <= 5)) checkAdd = false;
            if ((annotationToAdd.width === 0) || (annotationToAdd.height === 0)) checkAdd = false;

            if (!checkAdd) {
                setAnnotations([]);
            } else {

                annotations.push(annotationToAdd);
                setNewAnnotation([]);
                setAnnotations(annotations);

                const newBox = {};
                newBox.class_id = classInfo[classSelectedIndex].class_id;
                newBox.class_name = classInfo[classSelectedIndex].class_name;
                newBox.color_hex = classInfo[classSelectedIndex].color_hex;

                const rbox = {};
                rbox.x = sx;
                rbox.y = sy;
                rbox.width = x - sx;
                rbox.height = y - sy;

                const bbox = getBboxFromRbox(rbox, sizeInfo);
                newBox.bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

                const myBoxInfo = cloneDeep(currentBbox);
                myBoxInfo.push(newBox);

                const myPayload = {};
                myPayload.box_info = myBoxInfo;
                myPayload.image_name = imageName.replace('//', '');
                myPayload.confirm = props.confirmStatus;


                dispatch(setCurrentBbox(myBoxInfo));
                //dispatch(setLabelIndex(myBoxInfo.length - 1))
                dispatch(setLabelIndex(-1))

                updateBboxAPI(datasetId, myPayload)
                    .then(({ status }) => {
                        log('updateBboxAPI-res', status);
                        updateFavoriteLabel();
                    })
                    .catch(({ response }) => {
                        log('updateBboxAPI-Error', response.data);
                    })
                props.onBoxChange(myBoxInfo);

            }
        }


    };



    const handleMouseMove = event => {

        if (dataType === 'object_detection') {
            const sx = event.evt.offsetX;
            const sy = event.evt.offsetY;
            const areaResult = checkAreaIntersect(sx, sy);
            //log('areaResult --->',areaResult)
            const container = event.target.getStage().container();

            // if ((areaResult.length) === 0) {

            //     container.className='my-white-cursor';
            // }else{

            //     container.className='my-black-cursor';
            // }

            setHoverBbox(areaResult)
        }
    };

    const handleMouseLeave_xx = event => {

        log('handle mouse leave')

        if (newAnnotation.length === 1) {

            const bbox = getBboxFromRbox(newAnnotation[0], sizeInfo);

            const newBox = {};
            //newBox.class_id = classInfo[classSelectedIndex].class_id;
            newBox.class_id = classInfo[classSelectedIndex].class_id;
            newBox.class_name = classInfo[classSelectedIndex].class_name;
            newBox.color_hex = classInfo[classSelectedIndex].color_hex;
            newBox.bbox = [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

            const myBoxInfo = cloneDeep(currentBbox);
            myBoxInfo.push(newBox);

            const myPayload = {};
            myPayload.box_info = myBoxInfo;
            myPayload.image_name = imageName;
            myPayload.confirm = props.confirmStatus;

            log('my Box Info')
            log(myBoxInfo)

            log('label index')
            log(labelIndex)

            dispatch(setCurrentBbox(myBoxInfo));
            dispatch(setLabelIndex(-1))

            updateBboxAPI(datasetId, myPayload)
                .then(({ status }) => {
                    log('updateBboxAPI-res', status);
                    updateFavoriteLabel();
                })
                .catch(({ response }) => {
                    log('updateBboxAPI-Error', response.data);
                })

            props.onBoxChange(myPayload);
        }
        setNewAnnotation([]);
    }

    const handleMouseLeave = event => {

    }

    const annotationsToDraw = [...newAnnotation];

    const stageRef = useRef();


    useEffect(() => {

        log('img url ----------------------->')
        log(`${apiHost}/display_img/${props.areaData.img_path.replace("./", "/")}`)

    }, []);

    useEffect(() => {

        if ((imageName !== '') && (dataType === 'object_detection')) {

            setNewAnnotation([]);
        }
    }, [imageName]);


    return (
        <Stage
            width={currentSize.width}
            height={currentSize.height}
            onMouseDown={handleMouseDown}
            //onMouseUp={(evt) => { handleMouseUp(evt) }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={stageRef}
            className={mouseCursorClass}

        >
            <Layer onClick={handleLayerClick}
                onMouseDown={handleMouseCursorChange}
                onMouseUp={handleMouseCursorChange}
                
            >

                <Image image={image} width={currentSize.width} height={currentSize.height} />

                {
                    (dataType === 'object_detection') ?
                        <AreaDisplay currentBbox={currentBbox} hoverBbox={hoverBbox}></AreaDisplay>
                        :
                        <></>
                }


                {
                    ((labelIndex >= 0) || (aiLabelIndex >= 0)) &&
                    <AreaEdit onBoxChange={props.onBoxChange} hoverBbox={hoverBbox} currentBbox={currentBbox} autoBoxbox={autoBox}></AreaEdit>
                }




                {
                    annotationsToDraw.map((value, idx) => {
                        return (
                            <Rect
                                ref={shapeRef}
                                key={`new_${idx}`}
                                x={value.x}
                                y={value.y}
                                width={value.width}
                                height={value.height}
                                //dash={[10, 5]}
                                fill="transparent"
                                stroke={(classInfo[classSelectedIndex] === undefined) ? '#ff0000' : classInfo[classSelectedIndex].color_hex}
                                strokeWidth={4}
                                dragBoundFunc={(pos) => {

                                    const node = shapeRef.current;
                                    let point = pos;
                                    if (point.x < 1) point.x = 1;
                                    if (point.y < 1) point.y = 1;
                                    if ((point.x + node.width()) >= sizeInfo.mediaWidth) point.x = sizeInfo.mediaWidth - node.width() - 1;
                                    if ((point.y + node.height()) >= sizeInfo.mediaHeight) point.y = sizeInfo.mediaHeight - node.height() - 1;
                                    return point;
                                }}
                            />
                        );

                    })}

            </Layer>
        </Stage>
    );

});

export default AreaContainer;