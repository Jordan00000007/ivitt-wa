import React, { useState, useEffect, useImperativeHandle, forwardRef, useContext, useRef, useMemo } from 'react';
import log from "../utils/console";
import 'bootstrap/dist/css/bootstrap.css';
import '../css/App.css';
import styled from 'styled-components';
import Hotkeys from "react-hot-keys";
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeGrid as Grid } from 'react-window';
import { map, find, filter, includes, cloneDeep, uniqBy } from 'lodash-es';
import OutsideClickHandler from 'react-outside-click-handler';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';


import { getAllProjectsAPI, toGetDatasetImgAPI, getBboxAPI, toGetClassAndNumberAPI, favoriteLabelAPI, addClassAPI } from '../constant/API';
import { updateBboxAPI, getIterationAPI, modifyAutoLabelingParameterAPI, getAutoLabelingParameterAPI, openAutoLabelingAPI, inferAutoLabelingAPI, thresholdAPI, confirmStatusAPI } from '../constant/API';
import { getAutolabelStatusAPI, setAutolabelStatusAPI, getImgLabelAPI } from '../constant/API';

import { apiHost } from '../constant/API/APIPath';


import CustomSelectDataset from '../components/Dropdowns/CustomSelectDataset';
import CustomSelectClass from '../components/Dropdowns/CustomSelectClass';
import CustomSelect from '../components/Dropdowns/CustomSelect';

import ToggleButton from '../components/Buttons/ToggleButton';
import AnnotationItem from '../components/PanelItems/AnnotationItem';
import AreaContainer from '../components/Drawing/AreaContainer';
import DrawingTooltip from '../components/Tooltips/DrawingTooltip';

import CustomInput from '../components/Inputs/CustomInput';
import CustomButton from '../components/Buttons/CustomButton';

import ClassButtonPanel from '../components/Panels/ClassButtonPanel';


import { ReactComponent as Icon_Delete } from '../assets/Icon_Delete.svg';
import { ReactComponent as Icon_Point } from '../assets/Icon_Point.svg';
import { ReactComponent as Icon_Back } from '../assets/Icon_Back.svg';
import { ReactComponent as Image_Default } from '../assets/Image_Default.svg';


import { selectCurrentTab, setCurrentTab } from '../redux/store/slice/currentTab';
import { selectCurrentIdx, setCurrentIdx } from "../redux/store/slice/currentIdx";

import { selectCurrentBbox, setLabelIndex, setAiLabelIndex, setCurrentBbox, setAutoBox } from "../redux/store/slice/currentBbox";
import { selectCurrentClassInfo, setClassInfo, setFavLabels } from "../redux/store/slice/currentClassInfo";

import { selectIteration } from "../redux/store/slice/currentIteration";
import { closeLoading, openLoading } from '../redux/store/slice/loading';

import { MainContext } from './Main';
import { useGetBoxInfo } from './label/hook/useLabelPage';
import { isObjectLiteralElementLike } from 'typescript';


const AnnotationItemPanel = styled.div({
    height: 235,
    overflowY: 'scroll',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-track': { margin: 2, borderRadius: 10, background: 'rgba(224, 225, 230, 0.376)' },
    '&::-webkit-scrollbar-thumb': { background: 'rgb(224, 225, 230)', borderRadius: 10 },
});

const ThumbPanel = styled.div({
    height: 'calc(100vh - 540px)',
    overflow: 'hidden',
    background: 'white',
    border: 0,
    paddingLeft: 10
});


const GUTTER_SIZE = 10;


const AutoLabel = forwardRef((props, ref) => {


    const [imgDataList, setImgDataList] = useState([]);
    const [imgBoxList, setImgBoxList] = useState([]);
    const [dataSetList, setDataSetList] = useState([]);
    const [unlabeledCount, setUnlabeledCount] = useState(0);

    const [combinedClassArr, setCombinedClassArr] = useState([]);

    const [combinedClassSelectorArr, setCombinedClassSelectorArr] = useState([]);

    const [currentSelectedClass, setCurrentSelectedClass] = useState(null);


    const [selectedLabelIdx, setSelectedLabelIdx] = useState(-1);

    const [showAutoLabelingSettingModal, setShowAutoLabelingSettingModal] = useState(false);

    const [iterationData, setIterationData] = useState([]);
    const [confidenceData, setconfidenceData] = useState([[0.7, 0.7], [0.75, 0.75], [0.8, 0.8], [0.85, 0.85], [0.9, 0.9], [0.95, 0.95]]);

    const [defaultIteration, setDefaultIteration] = useState('');
    const [defaultConfidence, setDefaultConfidence] = useState('');


    const [toolSelect, setToolSelect] = useState(true);

    const [confirmStatus, setConfirmStatus] = useState(false);

    const currentTab = useSelector(selectCurrentTab).tab;

    const currentIter = useSelector(selectIteration).iteration;

    const currentIdx = useSelector(selectCurrentIdx).idx;

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const aiLabelIndex = useSelector(selectCurrentBbox).aiLabelIndex;
    const imageName = useSelector(selectCurrentBbox).imageName;


    const gridRef = React.createRef();



    const { datasetId, dataType, combinedClass, activeClassName, setActiveClassName } = useContext(MainContext);

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;

    const dispatch = useDispatch();

    const [disabled, setDisabled] = useState(false);

    const iterationParameterRef = useRef();
    const confidenceParameterRef = useRef();
    const AutoLabelingToggleRef = useRef();

    const currPath = useMemo(() => {
        if (currentTab !== 'Label') return { image_path: `undefined` };
        return { image_path: `/${imgDataList[currentIdx]}` }
    }, [currentIdx, currentTab, imgDataList]);

    //const { boxInfo } = useGetBoxInfo(datasetId, dataType, currPath , imgDataList);

    const handleMouseEnter = () => {
        this.setState({ isHovered: true })
    }

    const handleMouseLeave = () => {
        this.setState({ isHovered: false })
    }

    const handleClassChange = (mySelectedClassItem) => {
        log('handle class change')
        log(mySelectedClassItem)
        setCurrentSelectedClass(mySelectedClassItem)

    }

    const setDataSetListByClassId = (myData, myClassId) => {
        switch (myClassId) {
            case -1: {
                setDataSetList(myData);
                break;
            }
            case -2: {
                const res = filter(myData, (obj) => {
                    if (obj.box_info.length === 0) return true;
                })
                setDataSetList(res);
                break;
            }
            default: {

                const res = filter(myData, (obj) => {
                    const res2 = find(obj.box_info, (obj2) => {
                        if (obj2.class_id === myClassId) return true
                    })
                    if (res2 !== undefined) return true;
                })
                setDataSetList(res);
                break;
            }
        }
    }

    const handleDatatSetFilterChange = (myValue) => {

        dispatch(setCurrentIdx(0));
        setScrollingLocation(0);
        if (myValue !== null) {

            setDataSetListByClassId(imgBoxList, myValue)

            setActiveClassName(myValue);
        }
    }

    useImperativeHandle(ref, () => ({

    }));



    useEffect(() => {

        if (imgDataList.length > 0) {

            if (dataType === 'object_detection') {

                let myImgBoxInfo = new Array(imgDataList.length);
                let myCounter = 0;
                let myUnlabeledCounter = 0;

                imgDataList.forEach((item, idx) => {

                    getBboxAPI(datasetId, { image_path: item.replace("./", "/") })
                        .then(({ data }) => {


                            log('data.data')
                            log(data.data)


                            data.data.img_path = imgDataList[idx]
                            myImgBoxInfo[idx] = data.data;
                            myImgBoxInfo[idx].idx = idx;
                            myCounter++;
                            if (data.data.box_info.length === 0) myUnlabeledCounter++;

                            if (myCounter === imgDataList.length) {



                                setImgBoxList(myImgBoxInfo);

                                const myClassId = (activeClassName === 'All') ? -1 : ((activeClassName === 'Unlabeled') ? -2 : getClassId(activeClassName));

                                log('-------------------------------')
                                log('myImgBoxInfo', myImgBoxInfo)
                                log('myClassId', myClassId)

                                setDataSetListByClassId(myImgBoxInfo, myClassId);
                                setUnlabeledCount(myUnlabeledCounter);
                                dispatch(closeLoading());

                            }

                        })
                        .catch((error) => {
                            log(error);
                        });

                })
            }

            if (dataType === 'classification') {

                let myImgBoxInfo = new Array(imgDataList.length);
                let myCounter = 0;
                let myUnlabeledCounter = 0;

                imgDataList.forEach((item, idx) => {

                    getImgLabelAPI(datasetId, item.replace("./", "/"))
                        .then(({ data }) => {

                            log('--- getImgLabelAPI : data ---')
                            log(data)
                            log(data.data)

                            const keyArr = Object.keys(data.data)

                            data.data.img_path = imgDataList[idx]
                            myImgBoxInfo[idx] = data.data;
                            myImgBoxInfo[idx].idx = idx;
                            myImgBoxInfo[idx].img_shape = [100, 100];


                            if (JSON.stringify(data.data) === '{}') {
                                myUnlabeledCounter++;
                                myImgBoxInfo[idx].box_info = [];
                            } else {

                                log('keyArr')
                                log(keyArr)

                                const myBoxInfo = {};
                                if (keyArr.length > 0) {
                                    const myClass = keyArr[0];
                                    myBoxInfo.class_name = myClass;
                                    myBoxInfo.class_id = data.data[myClass].class_id;
                                    myBoxInfo.color_hex = data.data[myClass].color_hex;
                                    myBoxInfo.color_id = data.data[myClass].color_id;
                                    myBoxInfo.bbox = [0, 0, 0, 0];

                                }

                                log('myBoxInfo')
                                log(myBoxInfo)

                                if (JSON.stringify(myBoxInfo) !== '{}'){
                                    myImgBoxInfo[idx].box_info = [myBoxInfo];
                                }else{
                                    myImgBoxInfo[idx].box_info = [];
                                }
                                
                            }

                            log('myUnlabeledCounter')
                            log(myUnlabeledCounter)

                            getBboxAPI(datasetId, { image_path: item.replace("./", "/") })
                                .then(({ data }) => {
                                    log('=== getBboxAPI data.data ===')
                                    log(data.data.img_shape)
                                    myImgBoxInfo[idx].img_shape = data.data.img_shape;
                                    myCounter++;

                                    if (myCounter === imgDataList.length) {

                                        log('--- raw data ---')
                                        log(myImgBoxInfo)
                                        setImgBoxList(myImgBoxInfo);

                                        const myClassId = (activeClassName === 'All') ? -1 : ((activeClassName === 'Unlabeled') ? -2 : getClassId(activeClassName));

                                        log('-------------------------------')
                                        log('myImgBoxInfo', myImgBoxInfo)
                                        log('myClassId', myClassId)

                                        setDataSetListByClassId(myImgBoxInfo, myClassId);
                                        setUnlabeledCount(myUnlabeledCounter);
                                        dispatch(closeLoading());

                                    }


                                })
                                .catch(({ response }) => {
                                    log(response.data.message);
                                });


                        })
                        .catch(({ response }) => {
                            log(response.data.message);
                        });






                })
            }

        }

    }, [imgDataList]);

    useEffect(() => {

        const myCombinedClassArr = [];
        combinedClass.forEach((item) => {
            const myClassItem = []
            myClassItem.push(item.class_id);
            myClassItem.push(item.name);
            myClassItem.push(item.color_hex);
            myCombinedClassArr.push(myClassItem);
        })
        setCombinedClassArr(myCombinedClassArr);

        if (combinedClass.length > 0) {
            setCurrentSelectedClass([combinedClass[0].class_id, combinedClass[0].name, combinedClass[0].color_hex])
        }

    }, [combinedClass]);



    useEffect(() => {
        setSelectedLabelIdx(-1);
    }, [currentIdx]);


    useEffect(() => {

        log('currentIter')
        log(currentIter)

        log('activeClassName')
        log(activeClassName)

        log('dataType')
        log(dataType)

        const reqData = {
            iteration: currentIter,
            class_name: activeClassName,
        }

        try {
            toGetDatasetImgAPI(datasetId, reqData).then((data) => {
                setImgDataList(data.data.data.img_path)
            })
        } catch (error) {
            log(error)
        }

    }, [datasetId]);

    useEffect(() => {

        try {
            toGetClassAndNumberAPI(datasetId, 'workspace').then((data) => {

                const classes_info = data.data.data.classes_info;
                const myClassInfo = [];
                Object.keys(classes_info).forEach(function (myKey) {
                    const myItem = {};
                    myItem.class_name = myKey;
                    myItem.class_id = classes_info[myKey].class_id;
                    myItem.color_id = classes_info[myKey].color_id;
                    myItem.color_hex = classes_info[myKey].color_hex;
                    myClassInfo.push(myItem);

                });

                dispatch(setClassInfo(myClassInfo));

            })
        } catch (error) {
            log(error)
        }

    }, []);


    //useFetchIterationInfo

    const containerStyle = { height: 'calc(100vh - 56px)', backgroundColor: '#F5F5F5' };
    const rightPanelStyle = { height: 'calc(100vh - 56px)', width: '300px' };
    const leftPanelStyle = { height: 'calc(100vh - 56px)', width: 'calc(100vw - 300px)', borderRight: '1px solid #979CB580' };
    const topPanelStyle = { height: '52px', width: 'calc(100vw - 300px)', backgroundColor: '#F5F5F5', padding: '8px 16px 8px 16px' };
    const bottomPanelStyle = { height: '52px', width: 'calc(100vw - 300px)', backgroundColor: '#F5F5F5' };
    const toolPanelStyle = { height: '300px', width: '48px', backgroundColor: 'white', position: 'absolute', top: -150, borderRadius: 6, border: '1px solid #979CB580' };
    const canvasStyle = { height: 'calc(100vh - 310px)', width: 'calc(100vw - 510px)', backgroundColor: '#f1f1f1', border: '1px solid #979CB580' };
    const imageStyle = { maxHeight: 'calc(100vh - 314px)', maxWidth: 'calc(100vw - 514px)', minHeight: 300, minWidth: 400 };
    const toolIconStyle = { position: 'absolute', left: 6, cursor: 'pointer', transform: 'rotate(-90deg)' };
    const pageForwardStyle = { width: 24, height: 24, cursor: 'pointer', transform: 'rotate(180deg)', fill: '#16272ED9', top: 1, position: 'absolute' };
    const pageBackwardStyle = { width: 24, height: 24, cursor: 'pointer', transform: 'rotate(0deg)', fill: '#16272ED9', top: 1, position: 'absolute' };
    const pagePanelStyle = { backgroundColor: 'white', width: 132, height: 33, border: '1px solid #979CB580', borderRadius: '6px 6px 0px 0px', padding: '5px 8px 4px 8px' };
    const annotationPanelStyle = { backgroundColor: 'white', width: 300, height: 280, borderBottom: '1px solid #979CB580' };
    const autoLabelingPanelStyle = { backgroundColor: 'white', width: 300, height: 150, borderBottom: '1px solid #979CB580' };
    const datasetPanelStyle = { backgroundColor: 'white', width: 300, height: 'calc(100vh - 486px)' };
    const panelTitleStyle = { fontFamily: 'Roboto, Medium', fontSize: 18, color: '#16272E', fontWeight: 500, padding: '16px 20px 10px 20px', width: 300 };
    const classItemStyle = { fontFamily: 'Roboto, Regular', fontSize: 15, color: '#16272E', padding: '9px 20px', width: 300, height: 36 };
    const descriptionStyle = { padding: '0px 20px', color: '#979CB5', fontSize: 13 };
    const thumbImageStyle = { width: 80, height: 80, border: '1px solid #979CB580', marginRight: 10, cursor: 'pointer' };
    const GridItemOdd = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const GridItemEven = { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f0' };

    const classSelectorRef = useRef();

    const handleBack = (evt) => {
        log('back to main page')
        log(currentTab)
        dispatch(setCurrentTab('Dataset'))
    }

    const setScrollingLocation = (theIndex) => {
        if (gridRef.current) {

            const colCount = 3;
            const rowCount = Math.ceil(dataSetList.length / colCount);
            let colIndex = theIndex % colCount;
            let rowIndex = Math.floor(theIndex / colCount);
            gridRef.current.scrollToItem({
                align: "auto",
                rowIndex: rowIndex,
            });
        } else {
            log('grid not ready')
        }
    }

    const handleImgRight = () => {
        const newIdx = ((currentIdx + 1) >= dataSetList.length) ? 0 : (currentIdx + 1);
        dispatch(setCurrentIdx(newIdx));
        setScrollingLocation(newIdx);
    }

    const handleImgLeft = () => {
        const newIdx = ((currentIdx - 1) < 0) ? (dataSetList.length - 1) : currentIdx - 1;
        dispatch(setCurrentIdx(newIdx));
        setScrollingLocation(newIdx);
    }

    const handleAutoLabelingSetting = () => {

        log('handle Auto Labeling Setting')
        setShowAutoLabelingSettingModal(true);

        getAutoLabelingParameterAPI(datasetId)
            .then(({ data }) => {

                if (data.data) {
                    const myIteration = data.data.iteration;
                    const myConfidence = data.data.threshold;
                    //iterationParameterRef.current.setSelectedValue(myIteration);
                    //confidenceParameterRef.current.setSelectedValue(myConfidence);

                    log('myIteration')
                    log(myIteration)
                    setDefaultIteration(myIteration)

                    log('myConfidence')
                    log(myConfidence)
                    setDefaultConfidence(myConfidence);
                }
            })
            .catch(({ response }) => {
                log('getAutoLabelingParameterAPI-Error', response.data);
            })

    }

    const handleKeyDown = (keyName, e, handle) => {

        e.preventDefault();

        log('-- key code ---')
        log(e.code)

        const colCount = 3;
        const rowCount = Math.ceil(dataSetList.length / colCount);
        let colIndex = currentIdx % colCount;
        let rowIndex = Math.floor(currentIdx / colCount);


        if (e.code === 'ArrowUp') {
            const newIdx = ((currentIdx - colCount) < 0) ? (((((rowCount - 1) * colCount) + currentIdx) > (dataSetList.length - 1)) ? (((rowCount - 2) * colCount) + currentIdx) : (((rowCount - 1) * colCount) + currentIdx)) : (currentIdx - colCount);
            dispatch(setCurrentIdx(newIdx));
            setScrollingLocation(newIdx);

        }
        if (e.code === 'ArrowDown') {
            const newIdx = ((currentIdx + colCount) >= dataSetList.length) ? (currentIdx % colCount) : (currentIdx + colCount);
            dispatch(setCurrentIdx(newIdx));
            setScrollingLocation(newIdx);
        }
        if (e.code === 'ArrowLeft') {
            const newIdx = ((currentIdx - 1) < 0) ? (dataSetList.length - 1) : currentIdx - 1;
            dispatch(setCurrentIdx(newIdx));
            setScrollingLocation(newIdx);
        }
        if (e.code === 'ArrowRight') {
            const newIdx = ((currentIdx + 1) >= dataSetList.length) ? 0 : (currentIdx + 1);
            dispatch(setCurrentIdx(newIdx));
            setScrollingLocation(newIdx);
        }
        if ((e.code === 'KeyD') || (e.code === 'Delete')) {

            deleteLabel();
        }
        if (e.code === 'Tab') {

            if (toolSelect) {


                const areaResult = [];

                currentBbox.forEach((item, idx) => {
                    areaResult.push('a' + idx)
                })

                autoBox.forEach((item, idx) => {
                    areaResult.push('b' + idx)
                })

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


    };

    const handleItemSelected = ((myLabelIdx, myType) => {

        classSelectorRef.current.setAllMenuClose();

        if (toolSelect) {

            if (myType) {

                log('set ai label index')
                log(aiLabelIndex)
                dispatch(setAiLabelIndex(myLabelIdx));
                dispatch(setLabelIndex(-1));

            } else {

                dispatch(setLabelIndex(myLabelIdx))
                dispatch(setAiLabelIndex(-1));

            }
        }
    });

    const handleAutoLabelingParameterUpdate = () => {
        log('handle Auto Labeling Parameter Update')
        log(iterationParameterRef.current.getSelectedValue())
        log(confidenceParameterRef.current.getSelectedValue())
        const myPayload = {};
        myPayload.iteration = iterationParameterRef.current.getSelectedValue();
        myPayload.threshold = confidenceParameterRef.current.getSelectedValue();
        setDefaultIteration(iterationParameterRef.current.getSelectedValue());
        setDefaultConfidence(confidenceParameterRef.current.getSelectedValue());

        modifyAutoLabelingParameterAPI(datasetId, myPayload)
            .then(({ status }) => {
                log('modifyAutoLabelingParameterAPI-res', status);

                setShowAutoLabelingSettingModal(false);

            })
            .catch(({ response }) => {
                log('modifyAutoLabelingParameterAPI-Error', response.data);
            })


    }

    const deleteLabel = () => {

        if (labelIndex >= 0) {

            const newBbox = currentBbox.filter(function (value, index) {
                return index !== labelIndex;
            });

            const myPayload = {};
            myPayload.image_name = imageName;
            myPayload.box_info = newBbox;
            myPayload.confirm = 0;

            dispatch(setCurrentBbox(newBbox));
            dispatch(setLabelIndex(-1));

            log('--- delete label ---')
            log(myPayload)

            updateBboxAPI(datasetId, myPayload)
                .then(({ status }) => {
                    log('updateBboxAPI-res', status);

                    favoriteLabelAPI(datasetId)
                        .then(({ data }) => {
                            const myData = data.data;
                            const myArr = [];
                            Object.keys(myData).forEach(function (k) {
                                log(myData[k]);
                                myArr.push(myData[k]);
                            });
                            dispatch(setFavLabels(myArr));
                        }).catch(({ response }) => {
                            log(response.data.message);
                            dispatch(setFavLabels([]));
                        });

                })
                .catch(({ response }) => {
                    log('updateBboxAPI-Error', response.data);
                })


            const realIndex = dataSetList[currentIdx].idx;
            imgBoxList[realIndex].box_info = newBbox;



        }

        if (aiLabelIndex >= 0) {

            const newBbox = autoBox.filter(function (value, index) {
                return index !== aiLabelIndex;
            });

            const myPayload = {};
            myPayload.image_name = imageName;
            myPayload.box_info = newBbox;
            myPayload.confirm = 0;

            dispatch(setAutoBox(newBbox));
            dispatch(setAiLabelIndex(-1));

            log('--- delete label ---')
            log(myPayload)



        }
    }

    const handleDeleteLabel = (evt) => {

        log('delete label')

        deleteLabel();

    }

    const handleAutoLabelingToggle = (myValue) => {

        log('handle Auto Labeling Toggle')
        log(myValue)

        if (dataType === 'object_detection') {

            checkAutoBoxStatus();

            if (myValue) {

                // 檢查圖片是否已經做過AutoLabeling
                const myPayload = {};
                myPayload.image_name = imageName.replace("//", "");

                confirmStatusAPI(datasetId, myPayload)
                    .then(({ data }) => {
                        log('confirmStatusAPI-OK', data);
                        const myConfirmStatus = data.data[myPayload.image_name];
                        setConfirmStatus(myConfirmStatus);
                        log('-------------- confirm status', myConfirmStatus)
                        if (!myConfirmStatus) {
                            getAutoBox(imageName);
                        } else {
                            dispatch(setAutoBox([]));
                        }

                    })
                    .catch(({ response }) => {
                        log('confirmStatusAPI-Error', response.data);
                    })



                //getAutoBox(imageName);

            }
            else {
                dispatch(setAutoBox([]));
            }
        }
    }

    const handleSelectLabel = (evt) => {

        // log('handle select label')
        // setToolSelect(!toolSelect);


    }

    const handleClassButtonClick = (myClassName) => {

        classSelectorRef.current.setSelectedClassName(myClassName);

    };

    const handleOutsideClick = (evt) => {
        log('out side click')

        const actionName = evt.target.getAttribute('name');

        log('actionName')
        log(actionName)

        if ((actionName !== 'deleteLabel') && (actionName !== 'classButton')) {
            dispatch(setLabelIndex(-1));
            dispatch(setAiLabelIndex(-1));
        }

    }

    const handleBoxChange = (myBox) => {

        const realIndex = dataSetList[currentIdx].idx;
        imgBoxList[realIndex].box_info = myBox;

    }

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

    const getClassId = (myClassName) => {

        log('classInfo')
        log(classInfo)

        if (classInfo.length > 0) {

            const res = filter(classInfo, (obj) => {
                if (obj.class_name === myClassName) return true;
            })

            if (res[0] !== undefined) return res[0].class_id;

            return 0;
        } else {
            return 0;
        }
    }


    const handleAutoBoxConfirm = () => {

        log('handle Auto Box Confirm')

        const myCurrentBbox = cloneDeep(currentBbox);
        const myAutoBox = cloneDeep(autoBox);

        const myNewBox = [...myCurrentBbox, ...myAutoBox];
        log('myNewBox')
        log(myNewBox)

        const myBox = [];
        myNewBox.forEach(item => {
            const myItem = {};
            myItem.class_name = item.class_name;
            myItem.bbox = item.bbox;
            myItem.class_id = getClassId(item.class_name);
            myItem.color_hex = getClassColor(item.class_name);
            myBox.push(myItem);
        })

        const myPayload = {};
        myPayload.image_name = imageName.replace("//", "");
        myPayload.box_info = myBox;
        myPayload.confirm = 1;

        log('my payload')
        log(myPayload)

        log('--- myBox --- ')
        log(myBox)


        dispatch(setLabelIndex(-1))
        dispatch(setAiLabelIndex(-1))
        setConfirmStatus(true);

        log('confrim status is true')

        dispatch(setCurrentBbox(myBox));
        dispatch(setAutoBox([]));

        updateBboxAPI(datasetId, myPayload)
            .then(({ status }) => {
                log('updateBboxAPI-res', status);

            })
            .catch(({ response }) => {
                log('updateBboxAPI-Error', response.data);
            })

        log('myBox')
        log(myBox)

        handleBoxChange(myBox);

    }

    const checkAutoBoxClass = (myAutoBoxArr) => {

        log('--- check auto box class ---')
        const myStepArr0 = map(classInfo, 'class_name')
        const myStepArr1 = uniqBy(myAutoBoxArr, 'class_name');
        const myStepArr2 = map(myStepArr1, 'class_name')

        log(myStepArr0)
        log(myStepArr2)

        myStepArr2.forEach((item, idx) => {
            if (!includes(myStepArr0, item)) {
                log('create new class -> ' + item);


                const ids = [];
                classInfo.map(object => {
                    if (parseInt(object.color_id) < 1000) {
                        ids.push(parseInt(object.color_id))
                    }

                });

                const myColorId = (ids.length > 0) ? ((Math.max(...ids) + 1) + idx) : 0;

                log('create new color id -> ' + myColorId);

                const myPayload = {};
                myPayload.class_name = item;
                myPayload.color_hex = '';
                myPayload.color_id = myColorId;

                addClassAPI(datasetId, myPayload)
                    .then(({ data }) => {
                        log('addClassAPI-OK');

                        toGetClassAndNumberAPI(datasetId, 'workspace')
                            .then((data) => {

                                const classes_info = data.data.data.classes_info;
                                const myClassInfo = [];
                                Object.keys(classes_info).forEach(function (myKey, idx) {
                                    const myItem = {};
                                    myItem.class_name = myKey;
                                    myItem.class_id = classes_info[myKey].class_id;
                                    myItem.color_id = classes_info[myKey].color_id;
                                    myItem.color_hex = classes_info[myKey].color_hex;
                                    myClassInfo.push(myItem);

                                });

                                dispatch(setClassInfo(myClassInfo));


                            }).catch(({ response }) => {
                                log('toGetClassAndNumberAPI-Error', response.data);
                            });


                    }).catch(({ response }) => {
                        log('addClassAPI-Error', response.data);
                    });
            }
        })



    }

    function getAutoLabelStatus() {
        return new Promise((resolve, reject) => {
            getAutolabelStatusAPI(datasetId)
                .then(({ data }) => {
                    log('getAutoLabelStatus-OK', data);
                    resolve(data.data.autolabel_status);
                })
                .catch(({ response }) => {
                    log('getAutoLabelStatus-Error', response.data);
                    reject('getAutoLabelStatus-Error');
                })
        })
    }

    function setAutoLabelStatus() {
        return new Promise((resolve, reject) => {
            setAutolabelStatusAPI(datasetId, {})
                .then(({ data }) => {
                    log('setAutoLabelStatus-OK', data);
                    resolve('setAutoLabelStatus-OK');
                })
                .catch(({ response }) => {
                    log('setAutoLabelStatus-Error', response.data);
                    reject('setAutoLabelStatus-Error');
                })
        })
    }

    const getAutoBox = (myImgName) => {

        const myImage = { "img_name": myImgName.replace('//', '') };

        inferAutoLabelingAPI(datasetId, myImage)
            .then(({ data }) => {
                log('inferAutoLabelingAPI-OK', data);


                const myParameter = {};
                //myParameter.threshold=defaultConfidence;
                myParameter.threshold = 0.5;
                myParameter.img_name = myImgName.replace('//', '');

                const myAutoBoxArr = [];
                thresholdAPI(datasetId, myParameter)
                    .then(({ data }) => {
                        log('thresholdAPI-OK', data);

                        if (data.data.detections) {
                            const data_keyArr = Object.keys(data.data.detections);
                            if (data_keyArr.length > 0) {
                                const data_key = data_keyArr[0];

                                const myResData = data.data.detections[data_key];
                                if (myResData.length > 0) {


                                    myResData.forEach((item, idx) => {
                                        const myAutoBox = {};
                                        myAutoBox.class_name = item.class;
                                        myAutoBox.bbox = item.bbox;
                                        myAutoBox.color_hex = '#ff0000';
                                        myAutoBox.class_id = '';
                                        myAutoBox.confidence = item.confidence;
                                        myAutoBoxArr.push(myAutoBox);
                                    });

                                    dispatch(setAutoBox(myAutoBoxArr));

                                } else {
                                    dispatch(setAutoBox([]));
                                }

                            }
                        }

                        checkAutoBoxClass(myAutoBoxArr);

                    })
                    .catch(({ response }) => {
                        log('thresholdAPI-Error', response.data);
                    })

            })
            .catch(({ response }) => {
                log('inferAutoLabelingAPI-Error', response.data);
            })
    }

    const handleDeleteClassDone = () => {

        log('--- handle Delete Class Done ---')

        const reqData = {
            iteration: currentIter,
            class_name: activeClassName,
        }

        setImgDataList([])
        try {
            toGetDatasetImgAPI(datasetId, reqData).then((data) => {
                setImgDataList(data.data.data.img_path)
            })
        } catch (error) {
            log(error)
        }

    }

    async function checkAutoBoxStatus() {

        log('check Auto Box Status')
        try {

            const myLocalChecked = AutoLabelingToggleRef.current.getValue();
            const myServerChecked = await getAutoLabelStatus();
            const setServerChecked = await setAutoLabelStatus();
            // if (myLocalChecked!==myServerChecked) {
            //     const setServerChecked=  await setAutoLabelStatus();
            // }

        } catch (err) {
            log(err)
        }

    }

    const openAutoLabelingModel = (myIteration, myConfidence) => {
        const myPayload = {};
        myPayload.iteration = myIteration;
        myPayload.threshold = myConfidence;

        if (iterationData.length > 0) {
            openAutoLabelingAPI(datasetId, myPayload)
                .then(({ data }) => {
                    log('openAutoLabelingAPI-OK', data);
                })
                .catch(({ response }) => {
                    log('openAutoLabelingAPI-Error', response.data);
                })
        }

    }


    useEffect(() => {
        dispatch(openLoading());



        // 取得AutoLabeling的狀態

        if (dataType === 'object_detection') {

            // 取得AutoLabeling的參數    
            getIterationAPI(datasetId)
                .then(({ data }) => {
                    log('getIterationAPI-res');
                    const IterationArr = [];
                    log(data.data.folder_name)
                    data.data.folder_name.forEach((item, idx) => {
                        //IterationArr.push([idx,])
                        log(item.iteration1)

                        //log(item[0].iteration1.mAP)
                        //log(item.getKey(0))
                        const data_keyArr = Object.keys(item);
                        if (data_keyArr.length > 0) {
                            const data_key = data_keyArr[0];
                            const data_mAP = item[data_key].mAP;
                            const data_class = item[data_key].class;
                            IterationArr.push([data_key, `${data_key} ( mAP = ${data_mAP}, class = ${data_class} )`])
                        }

                    })
                    setIterationData(IterationArr);

                    log('IterationArr')
                    log(IterationArr)

                    getAutoLabelingParameterAPI(datasetId)
                        .then(({ data }) => {

                            if (data.data) {
                                const myIteration = data.data.iteration;
                                const myConfidence = data.data.threshold;

                                log('myIteration')
                                log(myIteration)
                                setDefaultIteration(myIteration)

                                log('myConfidence')
                                log(myConfidence)
                                setDefaultConfidence(myConfidence);

                                openAutoLabelingModel(myIteration, myConfidence)



                            }
                        })
                        .catch(({ response }) => {
                            log('getAutoLabelingParameterAPI-Error', response.data);
                        })


                })
                .catch(({ response }) => {
                    log('getIterationAPI-Error', response.data);
                })

            try {
                getAutoLabelStatus()
                    .then((data) => {
                        log('myServerAutoLabelStatus', data)
                        if (data === true) {
                            AutoLabelingToggleRef.current.setValue(true);
                        }
                        if (data === false) {
                            AutoLabelingToggleRef.current.setValue(false);
                        }
                    })



            } catch (error) {
                log(error)
            }
        }

        if (dataType === 'classification') {
            setToolSelect(false);
        }


    }, []);


    useEffect(() => {

        log('image change', imageName)

        if ((imageName !== '')&&(dataType==='object_detection')) {

            const myPayload = {};
            myPayload.image_name = imageName.replace("//", "");

            // 檢查圖片是否已經做過AutoLabeling
            dispatch(setAutoBox([]));
            confirmStatusAPI(datasetId, myPayload)
                .then(({ data }) => {
                    log('confirmStatusAPI-OK', data);
                    log(myPayload.image_name)
                    log(data.data[myPayload.image_name])
                    const myConfirmStatus = data.data[myPayload.image_name];
                    setConfirmStatus(myConfirmStatus);
                    log('-------------- confirm status', myConfirmStatus)
                    if (!myConfirmStatus) {

                        if (AutoLabelingToggleRef.current.getValue()) {

                            getAutoBox(imageName);
                        }


                    }

                })
                .catch(({ response }) => {
                    log('confirmStatusAPI-Error', response.data);
                })

        }

    }, [imageName]);




    return (
        <div>
            <Hotkeys
                keyName="Tab,KeyD,Delete,Up,Down,Right,Left,KeyS"
                //keyName="*"
                onKeyDown={handleKeyDown.bind(this)}
            />
            <div className="container-fluid" style={containerStyle}>
                <div className="row d-flex justify-content-between">
                    <div className="col-8 position-relative" style={leftPanelStyle}>
                        <div className="row">
                            <div className="col-12 position-absolute top-0 start-0 d-flex justify-content-between" style={topPanelStyle}>



                                <CustomSelectClass defaultValue={0} ref={classSelectorRef} onDeleteClassDone={handleDeleteClassDone} ></CustomSelectClass>


                                <ClassButtonPanel combinedClass={combinedClass} onClick={handleClassButtonClick}></ClassButtonPanel>



                            </div>
                        </div>


                        <div className="row" style={{ height: '100%', backgroundColor: '#F5F5F5' }}>
                            <div className="col-12 d-flex align-items-center justify-content-center" >
                                {/* <div style={{ height: 'calc(100vh - 310px)', width: 'calc(100vw - 510px)', backgroundColor: '#f1f1f1', border: '1px solid #979CB580' }}> */}
                                <div style={{ height: 'calc(100vh - 310px)', width: 'calc(100vw - 510px)', border: '0px solid #979CB580' }}>
                                    {
                                        (dataSetList.length > 0) ?
                                            <>

                                                <AutoSizer>
                                                    {({ height, width }) => (


                                                        <div className="d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 312px)', width: 'calc(100vw - 512px)' }}>
                                                            <OutsideClickHandler onOutsideClick={handleOutsideClick}>
                                                                <AreaContainer areaData={dataSetList[currentIdx]} height={height} width={width} selectedLabelIdx={selectedLabelIdx} currentSelectedClass={currentSelectedClass} toolSelect={toolSelect} onBoxChange={handleBoxChange}></AreaContainer>
                                                            </OutsideClickHandler>
                                                        </div>

                                                    )}
                                                </AutoSizer>
                                            </>

                                            :
                                            <div className="d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 312px)', width: 'calc(100vw - 512px)' }}>
                                                <Image_Default style={imageStyle} />
                                            </div>


                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 position-absolute bottom-0 start-0 d-flex justify-content-center align-items-end" style={bottomPanelStyle}>
                                <div className='d-flex flex-row align-items-start' style={pagePanelStyle}>
                                    <div style={{ position: 'relative', width: 24, height: 24 }}>
                                        <Icon_Back style={pageBackwardStyle}
                                            onMouseEnter={(evt) => evt.target.style.fill = '#57B8FF'}
                                            onMouseLeave={(evt) => evt.target.style.fill = '#16272ED9'}
                                            onClick={handleImgLeft}
                                        ></Icon_Back>
                                    </div>
                                    <div className=' d-flex justify-content-center align-items-end' style={{ width: 64, height: 24, color: '#16272E', fontSize: 15, opacity: 0.85 }}>
                                        {`${(dataSetList.length === 0) ? 0 : currentIdx + 1}/${dataSetList.length}`}
                                    </div>
                                    <div style={{ position: 'relative', width: 24, height: 24 }}>
                                        <Icon_Back style={pageForwardStyle}
                                            onMouseEnter={(evt) => evt.target.style.fill = '#57B8FF'}
                                            onMouseLeave={(evt) => evt.target.style.fill = '#16272ED9'}
                                            onClick={handleImgRight}
                                        ></Icon_Back>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 position-absolute top-50 start-0" style={{ paddingLeft: 16 }} >
                                <div style={{ position: 'relative', padding: 0 }}>
                                    {
                                        (dataType === 'classification') ?
                                            <></>
                                            :
                                            <div style={toolPanelStyle}>
                                                <div style={{ width: 48, height: 48, padding: 0, position: 'relative' }} className='d-flex justify-content-center align-items-center' onClick={handleSelectLabel}>
                                                    <DrawingTooltip title="Select . Draw" keyword="S">
                                                        <Icon_Point className={toolSelect ? 'my-tool-icon-select-selected' : 'my-tool-icon-select'} onClick={handleSelectLabel}></Icon_Point>
                                                    </DrawingTooltip>
                                                </div>
                                                <div style={{ width: 48, height: 48, padding: 0, position: 'relative' }} className='d-flex justify-content-center align-items-center' onClick={handleDeleteLabel} name="deleteLabel">
                                                    <DrawingTooltip title="Delete" keyword="delete">
                                                        <Icon_Delete className='my-tool-icon-delete' name="deleteLabel"></Icon_Delete>
                                                    </DrawingTooltip>

                                                </div>

                                            </div>
                                    }

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-4" style={rightPanelStyle}>
                        <div className="row">
                            <div className="col-12 p-0">
                                <div style={annotationPanelStyle}>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12 d-flex justify-content-between" style={panelTitleStyle}>
                                                <div >
                                                    Annotation
                                                </div>
                                                {
                                                    ((autoBox.length > 0) && (!confirmStatus)) ?
                                                        <div className='my-confirm-button' onClick={handleAutoBoxConfirm}>
                                                            Confirm
                                                        </div>
                                                        :
                                                        <>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                {


                                                    ((currentBbox.length > 0) || (autoBox.length > 0)) ?
                                                        <AnnotationItemPanel className="container">
                                                            {
                                                                currentBbox.map((item, idx) => (
                                                                    // <AnnotationItem key={`Label_${idx}`} labelIdx={idx} selectedLabelIdx={selectedLabelIdx} name={item.class_name} color={item.color_hex} filled={true} onClick={handleItemSelected}></AnnotationItem>
                                                                    <AnnotationItem key={`Label_${idx}`} labelIdx={idx} className={item.class_name} onClick={handleItemSelected} ai={false}></AnnotationItem>
                                                                ))

                                                            }
                                                            {
                                                                autoBox.map((item, idx) => (
                                                                    // <AnnotationItem key={`Label_${idx}`} labelIdx={idx} selectedLabelIdx={selectedLabelIdx} name={item.class_name} color={item.color_hex} filled={true} onClick={handleItemSelected}></AnnotationItem>
                                                                    <AnnotationItem key={`AiLabel_${idx}`} labelIdx={idx} className={item.class_name} onClick={handleItemSelected} ai={true}></AnnotationItem>
                                                                ))

                                                            }
                                                        </AnnotationItemPanel>
                                                        :
                                                        <div style={descriptionStyle}>
                                                            This is new feature for user can quickly label after do some iterations. Please give it a try. You will find a new world.

                                                        </div>

                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (dataType === 'classification') ?
                                <></>
                                :
                                <div className="row">
                                    <div className="col-12 p-0">
                                        <div style={autoLabelingPanelStyle}>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-12 d-flex justify-content-between align-items-start" style={panelTitleStyle}>
                                                        <div >
                                                            Auto labeling
                                                        </div>
                                                        <div style={{ position: 'relative' }}>
                                                            <div style={{ position: 'absolute', top: 2, left: -35 }}>
                                                                <ToggleButton status='stop' onChange={handleAutoLabelingToggle} ref={AutoLabelingToggleRef}></ToggleButton>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12" style={descriptionStyle}>
                                                        This is new feature for user can quickly label after do some iterations. Please give it a try. You will find a new world.
                                                        <span className='my-setting-button' onClick={handleAutoLabelingSetting}>
                                                            Settings.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }

                        <div className="row">
                            <div className="col-12 p-0">
                                <div style={datasetPanelStyle}>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-12 d-flex flex-row justify-content-between" style={panelTitleStyle}>
                                                Dateset

                                                <div>
                                                    <CustomSelectDataset dataArr={combinedClassSelectorArr} width="122" height="28" fontSize="16" onChange={handleDatatSetFilterChange} name="DatasetFilter" defaultValue={activeClassName} unlabeledCount={unlabeledCount}></CustomSelectDataset>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                {
                                                    (dataSetList.length > 0) &&

                                                    <ThumbPanel>
                                                        <AutoSizer>
                                                            {({ height, width }) => (
                                                                <Grid className="my-grid-panel"
                                                                    columnCount={3}
                                                                    columnWidth={80 + GUTTER_SIZE}
                                                                    height={height}
                                                                    rowCount={Math.ceil(dataSetList.length / 3)}
                                                                    rowHeight={80 + GUTTER_SIZE}
                                                                    width={width}
                                                                    ref={gridRef}
                                                                    initialScrollTop={(currentIdx > 12) ? Math.floor(currentIdx / 3) * 90 : 0}


                                                                >
                                                                    {({ columnIndex, rowIndex, style }) => (

                                                                        <div
                                                                            className="my-grid-item"
                                                                            style={{
                                                                                ...style,
                                                                                backgroundColor: '#f1f1f1',
                                                                                border: '0px solid #979CB580',
                                                                                left: style.left + GUTTER_SIZE,
                                                                                top: style.top + GUTTER_SIZE,
                                                                                width: style.width - GUTTER_SIZE,
                                                                                height: style.height - GUTTER_SIZE,
                                                                            }}
                                                                        >
                                                                            {((columnIndex + rowIndex * 3) < dataSetList.length) ?
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <div className='d-flex align-items-center justify-content-center'
                                                                                        style={{ cursor: 'pointer', width: 80, height: 80, border: (currentIdx === (columnIndex + rowIndex * 3)) ? '2px solid #FF1111' : '0px' }}
                                                                                        onClick={() => {
                                                                                            dispatch(setCurrentIdx(columnIndex + rowIndex * 3));
                                                                                            classSelectorRef.current.setAllMenuClose();
                                                                                            // dispatch(setAutoBox([]));
                                                                                            // checkAutoBox(dataSetList[columnIndex + rowIndex * 3].img_path.slice(dataSetList[columnIndex + rowIndex * 3].img_path.indexOf('//')));

                                                                                        }}
                                                                                    >
                                                                                        <img src={`${apiHost}/display_img/${dataSetList[columnIndex + rowIndex * 3].img_path}`} style={{ maxWidth: '100%', maxHeight: '100%' }} className="my-thumb-image"></img>
                                                                                    </div>
                                                                                    {
                                                                                        (dataSetList[columnIndex + rowIndex * 3].box_info.length > 0) &&
                                                                                        <div style={{ position: 'absolute', bottom: 0, right: 3 }}>
                                                                                            <img src={require('../assets/Labeled.png')} />
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                                :
                                                                                <></>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </Grid>
                                                            )}
                                                        </AutoSizer>
                                                    </ThumbPanel>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>




            <Modal
                open={showAutoLabelingSettingModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 400 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-title'>
                                <div>
                                    Auto Labeling
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-parameter'>
                                <div style={{ paddingTop: 24 }}>
                                    Confidence*
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div style={{ paddingTop: 5 }}>
                                    <CustomSelect dataArr={confidenceData} width={418} height={52} fontSize={16} defaultValue={defaultConfidence} name="confidenceParameter" ref={confidenceParameterRef} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-parameter'>
                                <div style={{ paddingTop: 24 }}>
                                    Model iteration*
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div style={{ paddingTop: 5 }}>
                                    <CustomSelect dataArr={iterationData} width={418} height={52} fontSize={16} defaultValue={defaultIteration} name="iterationParameter" ref={iterationParameterRef} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{ padding: 0 }}>
                                <div style={{ paddingTop: 113 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowAutoLabelingSettingModal(false);
                                    }} />
                                    <CustomButton name="save" onClick={handleAutoLabelingParameterUpdate} />

                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>
        </div>

    );
});

export default AutoLabel;
